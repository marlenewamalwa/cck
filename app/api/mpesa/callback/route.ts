import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = body.Body?.stkCallback

    if (!result) return NextResponse.json({ ok: true })

    const checkoutRequestId = result.CheckoutRequestID
    const resultCode = result.ResultCode

    if (resultCode === 0) {
      // Payment successful
      const { data: payment } = await supabase
        .from('payments')
        .update({ status: 'success' })
        .eq('checkout_request_id', checkoutRequestId)
        .select()
        .single()

      if (payment) {
        // Mark brand as featured for 30 days
        const featuredUntil = new Date()
        featuredUntil.setDate(featuredUntil.getDate() + 30)

        await supabase
          .from('brands')
          .update({
            is_featured: true,
            featured_until: featuredUntil.toISOString(),
          })
          .eq('id', payment.brand_id)
      }
    } else {
      // Payment failed or cancelled
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('checkout_request_id', checkoutRequestId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}