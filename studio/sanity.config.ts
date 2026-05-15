import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import post from './schemaTypes/post'

export default defineConfig({
  name: 'closet-culture',
  title: 'Closet Culture',
  projectId: '1iexirr1',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [post],
  },
})