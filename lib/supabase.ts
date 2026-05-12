import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching your existing DB schema
export type Brand = {
  id: number
  name: string
  description: string
  website: string
  logo: string
  user_id: number
  location_type: 'physical' | 'hybrid' | 'online'
  stock_type: 'new' | 'thrift' | 'both'
  is_featured?: boolean
  category_names?: string // joined from brand_category + category
}

export type Post = {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  category: 'Post' | 'Interview'
  created_at: string
}

export type Review = {
  id: number
  brand_id: number
  rating: number
  review: string
  created_at: string
}

export type Category = {
  id: number
  name: string
}
