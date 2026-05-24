import { createClient } from "@/lib/client";

export async function processShipmentDeduction(clientId: string, delhiveryCost: number) {
  const supabase = createClient();
  
  // 1. Fetch Client settings and Wallet Balance
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('markup_type, markup_value, negative_shipments_count, wallets!inner(id, balance)')
    .eq('id', clientId)
    .single();

  if (clientError || !clientData) {
    throw new Error('Client or Wallet not found');
  }

  const walletRaw = clientData.wallets;
  const wallet = Array.isArray(walletRaw) ? walletRaw[0] : walletRaw;
  if (!wallet) throw new Error('Wallet not found');

  // 2. Calculate final cost (Delhivery Cost + Markup)
  let markup = 0;
  if (clientData.markup_type === 'flat') {
    markup = clientData.markup_value;
  } else if (clientData.markup_type === 'percentage') {
    markup = delhiveryCost * (clientData.markup_value / 100);
  }
  
  const finalCost = delhiveryCost + markup;
  const newBalance = wallet.balance - finalCost;

  // 3. Enforce Negative Balance Limit (Max 2 negative shipments)
  let newNegativeCount = clientData.negative_shipments_count;

  if (newBalance < 0) {
    if (newNegativeCount >= 2) {
      throw new Error(`Insufficient funds. Your wallet balance is ₹${wallet.balance.toFixed(2)}. You have reached the maximum allowed negative shipments (2). Please recharge your wallet to create a new shipment.`);
    }
    newNegativeCount += 1;
  } else {
    // If they go back to positive, we could optionally reset it
    if (newBalance >= 0) newNegativeCount = 0; 
  }

  // 4. Perform deduction (In a real scenario, use Supabase RPC for atomic transactions)
  const { error: walletError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id);

  if (walletError) throw new Error('Failed to update wallet balance');

  // 5. Update negative shipments count
  await supabase
    .from('clients')
    .update({ negative_shipments_count: newNegativeCount })
    .eq('id', clientId);

  // 6. Log Transaction
  await supabase
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      amount: -finalCost,
      type: 'deduction',
      description: 'Shipment Created',
    });

  return { success: true, finalCost, newBalance };
}
