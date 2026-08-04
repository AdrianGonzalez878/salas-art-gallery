import StudioLogoutButton from '@/components/StudioLogoutButton'

export const metadata = {
  title: {
    absolute: 'Sanity Studio | Salas Art Gallery',
  },
  description: 'Gestiona el contenido de Salas Art Gallery',
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
