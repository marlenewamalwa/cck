import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const res = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { phone, brand_id, amount = 500 } = await req.json()

    if (!phone || !brand_id) {
      return NextResponse.json({ error: 'Phone and brand_id are required' }, { status: 400 })
    }

    // Format phone — convert 07XX to 2547XX
    const formattedPhone = phone.startsWith('0')
      ? '254' + phone.slice(1)
      : phone.startsWith('+')
      ? phone.slice(1)
      : phone

    const accessToken = await getAccessToken()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkRes = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerBuyGoodsOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: `ClosetCulture-${brand_id}`,
          TransactionDesc: 'Featured Listing - Closet Culture',
        }),
      }
    )

    const stkData = await stkRes.json()

    if (stkData.ResponseCode === '0') {
      // Save pending payment to Supabase
      await supabase.from('payments').insert({
        brand_id,
        phone: formattedPhone,
        amount,
        checkout_request_id: stkData.CheckoutRequestID,
        status: 'pending',
      })
      return NextResponse.json({ success: true, checkoutRequestId: stkData.CheckoutRequestID })
    } else {
      return NextResponse.json({ error: stkData.errorMessage || 'STK push failed' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}