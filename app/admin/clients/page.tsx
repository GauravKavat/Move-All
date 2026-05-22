"use client";

import { Search, Building, MoreHorizontal, Eye, ShieldAlert, Key } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";

type ClientData = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      const supabase = createClient();
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist yet, we'll just show empty state
        console.error("Error fetching clients:", error);
      } else if (data) {
        setClients(data);
      }
      setLoading(false);
    }
    fetchClients();
  }, []);

  const handleAction = (action: string, id: string) => {
    toast.success(`${action} initiated for client ID: ${id}`);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Clients Management</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Manage client accounts, view secret IDs, and configure route masking.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, slug, or secret ID..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => toast.info("Create Client modal coming soon")} className="bg-[#f37a2a] hover:bg-[#e06716] text-white">
            Add New Client
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Masked Route (Slug)</TableHead>
              <TableHead>Secret ID (UUID)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#f4f2ea] dark:bg-[#2a2e3d] flex items-center justify-center text-[#292F54] dark:text-white font-bold">
                        {client.name.charAt(0)}
                      </div>
                      {client.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm font-mono text-[#f37a2a] bg-[#f37a2a]/10 px-2 py-1 rounded w-fit">
                      /{client.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground max-w-[200px] truncate" title={client.id}>
                      <Key className="h-3 w-3" />
                      {client.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage Client</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleAction("View Details", client.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleAction("Suspend Account", client.id)}>
                          <ShieldAlert className="mr-2 h-4 w-4" /> Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No clients found. (Ensure the "clients" table is created in Supabase)
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
