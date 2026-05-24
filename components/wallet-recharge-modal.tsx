'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Wallet } from "lucide-react";

export function WalletRechargeModal({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    
    try {
      // Create Razorpay order
      const res = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');

      // Setup Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Move All Logistics",
        description: "Wallet Recharge",
        order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          // You could optionally verify the signature here by calling another API
          // Or rely on the webhook. Relying on webhook is safer.
          // For now, we assume it's successful if Razorpay returns a response.
          toast.success("Payment successful! Processing recharge...");
          
          // You can trigger a UI refresh here or wait for webhook
          setTimeout(() => {
              window.location.reload();
          }, 2000);
        },
        prefill: {
          name: "Client Name",
          email: "client@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#f37a2a"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err: any) {
      toast.error(err.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#f37a2a]" />
                Recharge Wallet
            </DialogTitle>
            <DialogDescription>
              Add funds to your wallet using Razorpay. The amount will be instantly credited to your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRecharge} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right font-bold">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                className="col-span-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                    Please note: Transactions may take a few moments to reflect. Your negative balance limit is 2 shipments.
                </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold h-11">
              {loading ? 'Initializing...' : `Pay ₹${amount || '0'}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
