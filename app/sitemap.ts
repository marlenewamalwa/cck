import { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://closetculture.co.ke'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/add-brand`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.4 },
  ]

  // Brands
  const { data: brands } = await supabase
    .from('brands')
    .select('id')
    .eq('is_approved', true)

  const brandPages = (brands ?? []).map((brand: any) => ({
    url: `${baseUrl}/brands/${brand.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  // Stories from Sanity
  const posts = await sanityClient.fetch(`
    *[_type == "post"] { slug, publishedAt }
  `)

  const storyPages = (posts ?? []).map((post: any) => ({
    url: `${baseUrl}/stories/${post.slug?.current}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    priority: 0.8,
  }))

  return [...staticPages, ...brandPages, ...storyPages]
}