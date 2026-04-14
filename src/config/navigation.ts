export const publicNav = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const adminNav = [
  { label: 'Projects', href: '/admin/projects', icon: 'Layers' },
  { label: 'Categories', href: '/admin/categories', icon: 'Grid' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const
