import { ToastProvider } from '@/components/ui/Toast'

export const metadata = {
  title: 'Admin Dashboard - BlackKeyX',
  description: 'Lead management and deal ingestion dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToastProvider>{children}</ToastProvider>
}
