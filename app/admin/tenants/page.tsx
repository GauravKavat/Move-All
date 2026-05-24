'use client';

import React, { useState, useEffect } from 'react';
import type { Tenant, TenantHealth, TenantTier } from '@/lib/types';
import { Users, Search, MoreVertical, Building2, ShieldAlert } from 'lucide-react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { createClient } from '@/lib/client';

const TIER_STYLES: Record<TenantTier, string> = {
  Starter:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  Pro:        'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  Enterprise: 'bg-[#f37a2a]/10 text-[#f37a2a] dark:bg-[#f37a2a]/20 border-[#f37a2a]/20 dark:border-[#f37a2a]/30',
};

export default function AdminTenantHypervisorPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TenantHealth | 'All'>('All');
  const [search, setSearch] = useState('');

  // Provisioning form states
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientSlug, setClientSlug] = useState('');
  const [markupType, setMarkupType] = useState('flat');
  const [markupValue, setMarkupValue] = useState('10.00');
  const [provisioning, setProvisioning] = useState(false);

  const supabase = createClient();

  // Load clients and calculate metrics
  async function loadTenantsData() {
    try {
      setLoading(true);
      const { data: clientsData, error: clientsErr } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsErr) {
        toast.error(clientsErr.message || "Failed to load tenants.");
        return;
      }

      if (clientsData) {
        const computedTenants: Tenant[] = await Promise.all(
          clientsData.map(async (c: any) => {
            // Health: based on negative shipments count
            let health: TenantHealth = 'Healthy';
            if (c.negative_shipments_count === 1) health = 'At-Risk';
            else if (c.negative_shipments_count >= 2) health = 'Limited';

            // Tier
            let tier: TenantTier = 'Starter';
            if (c.markup_type === 'percentage') tier = 'Pro';
            if (c.markup_value > 50) tier = 'Enterprise';

            // GMV Sum
            const { data: ordersData } = await supabase
              .from('orders')
              .select('order_value')
              .eq('client_id', c.id);

            const monthlyGmv = ordersData ? ordersData.reduce((acc, curr) => acc + Number(curr.order_value || 0), 0) : 0;

            // Active shipments count
            const { count } = await supabase
              .from('shipments')
              .select('*', { count: 'exact', head: true })
              .eq('client_id', c.id)
              .in('status', ['Pending', 'In Transit', 'Out for Delivery', 'Shipped']);

            return {
              id: c.id,
              name: c.name,
              tier,
              lastActivity: new Date(c.created_at).toLocaleDateString('en-IN'),
              health,
              monthlyGmv,
              activeShipments: count || 0,
            };
          })
        );
        setTenants(computedTenants);
      }

      // Fetch profiles with role = 'client' that don't have a client slug yet
      const [
        { data: allProfiles },
        { data: allClients }
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role'),
        supabase.from('clients').select('user_id')
      ]);

      if (allProfiles) {
        const clientProfiles = allProfiles.filter(p => p.role === 'client');
        const unlinked = clientProfiles.filter(
          p => !allClients?.some(c => c.user_id === p.id)
        );
        setAvailableProfiles(unlinked);
      }

    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred loading tenants.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenantsData();
  }, []);

  const handleProfileSelect = (userId: string) => {
    setSelectedUserId(userId);
    const profile = availableProfiles.find(p => p.id === userId);
    if (profile) {
      setClientName(profile.full_name || '');
      // Generate initial slug from name
      const generatedSlug = (profile.full_name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setClientSlug(generatedSlug);
    }
  };

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to link.");
      return;
    }
    if (!clientSlug.trim()) {
      toast.error("Please enter a valid slug.");
      return;
    }

    setProvisioning(true);
    try {
      // 1. Create client slug entry
      const { data: newClient, error: clientErr } = await supabase
        .from('clients')
        .insert({
          user_id: selectedUserId,
          name: clientName,
          slug: clientSlug.toLowerCase().trim(),
          markup_type: markupType,
          markup_value: Number(markupValue),
          negative_shipments_count: 0
        })
        .select()
        .single();

      if (clientErr) {
        toast.error(clientErr.message || "Failed to provision tenant profile.");
        setProvisioning(false);
        return;
      }

      // 2. Create the associated wallet
      const { error: walletErr } = await supabase
        .from('wallets')
        .insert({
          client_id: newClient.id,
          balance: 0.00,
          currency: 'INR'
        });

      if (walletErr) {
        toast.error(walletErr.message || "Failed to initialize wallet for tenant.");
        setProvisioning(false);
        return;
      }

      toast.success("Tenant provisioned successfully! Wallet initialized to ₹0.00.");
      setProvisionOpen(false);
      
      // Reset form
      setSelectedUserId('');
      setClientName('');
      setClientSlug('');
      setMarkupType('flat');
      setMarkupValue('10.00');

      // Reload data
      loadTenantsData();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setProvisioning(false);
    }
  };

  const filtered = tenants.filter((t) => {
    const matchesFilter = filter === 'All' || t.health === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOrgCount = tenants.length;
  const totalGmvSum = tenants.reduce((acc, curr) => acc + curr.monthlyGmv, 0);
  const activeShipmentsSum = tenants.reduce((acc, curr) => acc + curr.activeShipments, 0);

  return (
    <div className="space-y-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Tenants & Users</h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Manage client organizations, audit tiers, and monitor account health.
          </p>
        </div>

        <Dialog open={provisionOpen} onOpenChange={setProvisionOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-[#f37a2a] text-white rounded-lg text-sm font-medium hover:bg-[#d96a20] transition-colors shadow-sm font-bold">
              + Provision New Tenant
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d]">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Provision New Tenant</DialogTitle>
              <DialogDescription>Link an existing client user profile to a custom client slug and set their billing markup.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProvisionTenant} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-[#475569] dark:text-[#94a3b8]">Select Client User *</Label>
                <Select value={selectedUserId} onValueChange={handleProfileSelect}>
                  <SelectTrigger className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white">
                    <SelectValue placeholder="Choose user..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d] text-black dark:text-white">
                    {availableProfiles.length > 0 ? (
                      availableProfiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name} ({p.id.substring(0, 6)})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-center text-gray-500">No unlinked client profiles found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#475569] dark:text-[#94a3b8]">Company / Client Name *</Label>
                <Input 
                  required 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="Acme Corp" 
                  className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#475569] dark:text-[#94a3b8]">Unique Slug * (Lowercase & numbers only)</Label>
                <Input 
                  required 
                  value={clientSlug} 
                  onChange={(e) => setClientSlug(e.target.value)} 
                  placeholder="acme" 
                  className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#475569] dark:text-[#94a3b8]">Markup Type</Label>
                  <Select value={markupType} onValueChange={setMarkupType}>
                    <SelectTrigger className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d] text-black dark:text-white">
                      <SelectItem value="flat">Flat (INR)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#475569] dark:text-[#94a3b8]">Markup Value</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={markupValue} 
                    onChange={(e) => setMarkupValue(e.target.value)} 
                    className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white"
                  />
                </div>
              </div>

              <Button type="submit" disabled={provisioning} className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white">
                {provisioning ? 'Provisioning...' : 'Provision Tenant'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Total Organizations</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">
            {loading ? '...' : totalOrgCount}
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 font-medium">Provisioned slug nodes</p>
        </div>
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Aggregated Monthly GMV</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">
            ₹{loading ? '...' : totalGmvSum.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">Sum of all client orders</p>
        </div>
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Active Global Shipments</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">
            {loading ? '...' : activeShipmentsSum.toLocaleString()}
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 font-medium">Across all tenants</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {(['All', 'Healthy', 'At-Risk', 'Limited'] as Array<TenantHealth | 'All'>).map((h) => (
              <button
                key={h}
                onClick={() => setFilter(h)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === h
                    ? 'bg-gray-100 dark:bg-[#2a2e3d] text-[#111827] dark:text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50 hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] text-sm text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#f37a2a]/20 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-[#16181d]/50 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider border-b border-gray-200 dark:border-[#2a2e3d]">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Monthly GMV</th>
                <th className="px-4 py-3">Active Shipments</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2a2e3d] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748b] dark:text-gray-400">
                    Loading tenants database...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gray-100 dark:bg-[#2a2e3d] flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-[#64748b] dark:text-[#94a3b8]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#111827] dark:text-white">{t.name}</p>
                          <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">{t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${TIER_STYLES[t.tier]}`}>
                        {t.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111827] dark:text-white">
                      ₹{t.monthlyGmv.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] dark:text-[#94a3b8]">
                      {t.activeShipments.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          t.health === 'Healthy' ? 'bg-emerald-500' :
                          t.health === 'At-Risk' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-xs font-semibold ${
                          t.health === 'Healthy' ? 'text-emerald-700 dark:text-emerald-400' :
                          t.health === 'At-Risk' ? 'text-amber-700 dark:text-amber-400' : 
                          'text-red-700 dark:text-red-400'
                        }`}>
                          {t.health}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ComingSoonDialog title="Tenant Options" type="action">
                        <button className="p-1 text-[#64748b] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </ComingSoonDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748b] dark:text-gray-400">
                    No tenants found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
