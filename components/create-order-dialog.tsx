'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/client';

interface CreateOrderDialogProps {
  children: React.ReactNode;
}

export function CreateOrderDialog({ children }: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [weight, setWeight] = useState('');
  const [orderValue, setOrderValue] = useState<number>(0);
  const [noInvoice, setNoInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create an order.");
        setIsSubmitting(false);
        return;
      }

      // Fetch client
      const { data: clientData, error: clientErr } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (clientErr || !clientData) {
        toast.error("Client profile not found.");
        setIsSubmitting(false);
        return;
      }

      // Generate a simulated base courier cost (e.g. ₹120 to ₹350)
      const baseCost = Math.round(120 + Math.random() * 230);

      // Call the atomic order creation RPC
      const { data, error } = await supabase.rpc('create_client_order', {
        client_uuid: clientData.id,
        c_name: customerName,
        c_phone: phoneNumber,
        c_address: deliveryAddress,
        c_pincode: pincode,
        pkg_weight: Number(weight),
        o_value: Number(orderValue),
        base_cost: baseCost,
      });

      if (error) {
        toast.error(error.message || "Failed to create order. Check wallet balance.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Order created successfully! Wallet balance updated.");
      setOpen(false);
      
      // Refresh to reflect the new order and transaction
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEwayCompulsory = orderValue > 50000;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#111827] dark:text-white flex items-center gap-2 text-xl font-bold">
            <Package className="h-5 w-5 text-[#f37a2a]" />
            Create New Order
          </DialogTitle>
          <DialogDescription className="text-[#64748b] dark:text-[#94a3b8]">
            Enter shipment details and upload necessary compliance documents.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1f2937] dark:text-white uppercase tracking-wider">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Customer Name *</label>
                <Input required placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#f8f9fa] dark:bg-[#16181d]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Phone Number *</label>
                <Input required placeholder="+91 9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-[#f8f9fa] dark:bg-[#16181d]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Delivery Address *</label>
              <Input required placeholder="123 Logistics Park, Hub Area" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="bg-[#f8f9fa] dark:bg-[#16181d]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Pincode *</label>
                <Input required placeholder="110001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="bg-[#f8f9fa] dark:bg-[#16181d]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Package Weight (kg) *</label>
                <Input required type="number" step="0.1" placeholder="5.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-[#f8f9fa] dark:bg-[#16181d]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Order Value (INR) *</label>
              <Input 
                required 
                type="number" 
                placeholder="25000" 
                value={orderValue || ''}
                className="bg-[#f8f9fa] dark:bg-[#16181d]" 
                onChange={(e) => setOrderValue(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-[#2a2e3d]">
            <h3 className="text-sm font-bold text-[#1f2937] dark:text-white uppercase tracking-wider">Compliance Documents</h3>
            
            {/* E-Way Bill section */}
            <div className={`p-4 rounded-lg border ${isEwayCompulsory ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50' : 'border-gray-200 dark:border-[#2a2e3d] bg-[#f8f9fa] dark:bg-[#16181d]'}`}>
              <div className="flex justify-between items-start mb-2">
                <label className={`text-sm font-bold ${isEwayCompulsory ? 'text-amber-800 dark:text-amber-500' : 'text-[#475569] dark:text-[#94a3b8]'}`}>
                  E-Way Bill {isEwayCompulsory && <span className="text-red-500">* (Required for &gt; 50K)</span>}
                </label>
              </div>
              <div className="relative">
                <Input type="file" required={isEwayCompulsory} className="bg-white dark:bg-[#1e212b] cursor-pointer file:text-sm file:font-semibold file:bg-[#f37a2a]/10 file:text-[#f37a2a] file:border-0 file:rounded-md file:mr-4 hover:file:bg-[#f37a2a]/20" />
              </div>
            </div>

            {/* Invoice or Declaration */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-[#f8f9fa] dark:bg-[#16181d] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#475569] dark:text-[#94a3b8]">
                  Commercial Invoice {(!noInvoice) && <span className="text-red-500">*</span>}
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[#f37a2a] focus:ring-[#f37a2a]"
                    checked={noInvoice}
                    onChange={(e) => setNoInvoice(e.target.checked)}
                  />
                  No Invoice Available
                </label>
              </div>
              
              {!noInvoice ? (
                <Input type="file" required className="bg-white dark:bg-[#1e212b] cursor-pointer file:text-sm file:font-semibold file:bg-[#f37a2a]/10 file:text-[#f37a2a] file:border-0 file:rounded-md file:mr-4 hover:file:bg-[#f37a2a]/20" />
              ) : (
                <div className="pt-2 border-t border-gray-200 dark:border-[#2a2e3d]">
                  <label className="text-sm font-bold text-[#475569] dark:text-[#94a3b8] block mb-2">
                    Declaration <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mb-2">Since no invoice is available, you must upload a signed declaration.</p>
                  <Input type="file" required className="bg-white dark:bg-[#1e212b] cursor-pointer file:text-sm file:font-semibold file:bg-[#f37a2a]/10 file:text-[#f37a2a] file:border-0 file:rounded-md file:mr-4 hover:file:bg-[#f37a2a]/20" />
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#2a2e3d]">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold">
              {isSubmitting ? 'Processing...' : 'Create Order & Upload Docs'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
