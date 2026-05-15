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
  const text = await res.text()
  console.log('AUTH RESPONSE:', text)
  const data = JSON.parse(text)
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { phone, brand_id, amount = 1 } = await req.json()

    if (!phone || !brand_id) {
      return NextResponse.json({ error: 'Phone and brand_id required' }, { status: 400 })
    }

    // Format phone to 2547XXXXXXXX
    let formattedPhone = phone.replace(/\s/g, '')
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1)
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1)

    const accessToken = await getAccessToken()
    const shortcode = '174379' // sandbox shortcode always
    const passkey = process.env.MPESA_PASSKEY!

    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'ClosetCulture',
      TransactionDesc: 'Featured Listing',
    }

    console.log('STK PAYLOAD:', JSON.stringify(payload))

    const stkRes = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const text = await stkRes.text()
    console.log('STK RESPONSE:', text)
    const stkData = JSON.parse(text)

    if (stkData.ResponseCode === '0') {
      await supabase.from('payments').insert({
        brand_id,
        phone: formattedPhone,
        amount,
        checkout_request_id: stkData.CheckoutRequestID,
        status: 'pending',
      })
      return NextResponse.json({ success: true, checkoutRequestId: stkData.CheckoutRequestID })
    } else {
      return NextResponse.json({ error: stkData.errorMessage || stkData.ResponseDescription || 'STK push failed' }, { status: 400 })
    }
  } catch (err: any) {
    console.log('STK ERROR:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}