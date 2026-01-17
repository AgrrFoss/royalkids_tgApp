import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    useSessions: false,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
