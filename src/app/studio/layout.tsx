import StudioLogoutButton from '@/components/StudioLogoutButton'

export const metadata = {
  title: 'Sanity Studio - Tienda de Joyería',
  description: 'Gestiona los productos de tu tienda',
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ margin: 0, height: '100vh', overflow: 'hidden' }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        <StudioLogoutButton />
      </div>
    </div>
  )
}
