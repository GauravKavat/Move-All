import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get client's wallet_id securely from server session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: clientData } = await supabase
      .from('clients')
      .select('id, wallets(id)')
      .eq('user_id', user.id)
      .maybeSingle();

    const walletRaw = clientData?.wallets;
    const wallet = Array.isArray(walletRaw) ? walletRaw[0] : walletRaw;
    const walletId = wallet?.id;

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_SECRET || 'dummy_secret',
    });

    // Create an order in Razorpay
    const options = {
      amount: amount * 100, // Razorpay amount is in paise
      currency: 'INR',
      receipt: `recharge_${Date.now()}`,
      payment_capture: 1, // Auto capture
      notes: {
        wallet_id: walletId || '',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
