import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const amountInRupees = payment.amount / 100;
      const walletId = payment.notes?.wallet_id;
      
      if (walletId) {
        const supabase = await createClient();
        
        const { error } = await supabase.rpc('recharge_client_wallet', {
          webhook_secret_token: secret,
          wallet_uuid: walletId,
          recharge_amount: amountInRupees,
          payment_id: payment.id,
        });

        if (error) {
          console.error(`Database recharge RPC failed:`, error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
        
        console.log(`Successfully recharged ₹${amountInRupees} via payment ${payment.id} for wallet ${walletId}`);
      } else {
        console.warn(`No wallet_id found in payment notes for payment ${payment.id}`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
