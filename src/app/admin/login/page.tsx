import { Suspense } from 'react'
import AdminLoginForm from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
          <div className="text-white/80 text-sm">Cargando…</div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
