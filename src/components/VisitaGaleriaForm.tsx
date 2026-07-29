'use client'

import { useState } from 'react'

interface FormState {
  nombre: string
  email: string
  telefono: string
  fechaPreferida: string
  horarioPreferido: string
  personas: string
  mensaje: string
}

const initialForm: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  fechaPreferida: '',
  horarioPreferido: 'flexible',
  personas: '1',
  mensaje: '',
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-300/50'

export default function VisitaGaleriaForm() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/galeria/visita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          personas: Number(form.personas),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'No pudimos enviar tu solicitud. Intenta de nuevo.')
        return
      }

      setSent(true)
      setForm(initialForm)
    } catch {
      setError('Error de conexión. Revisa tu internet e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Solicitud enviada</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Recibimos tu petición de visita. Te contactaremos pronto para confirmar fecha y horario.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold text-violet-800 hover:text-violet-950 underline-offset-2 hover:underline cursor-pointer"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre completo *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={form.nombre}
            onChange={handleChange}
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1.5">
            Teléfono / WhatsApp *
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            value={form.telefono}
            onChange={handleChange}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Correo electrónico *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="fechaPreferida" className="block text-sm font-medium text-gray-700 mb-1.5">
            Fecha preferida *
          </label>
          <input
            id="fechaPreferida"
            name="fechaPreferida"
            type="date"
            required
            min={minDate}
            value={form.fechaPreferida}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="horarioPreferido" className="block text-sm font-medium text-gray-700 mb-1.5">
            Horario preferido *
          </label>
          <select
            id="horarioPreferido"
            name="horarioPreferido"
            required
            value={form.horarioPreferido}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="manana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div>
          <label htmlFor="personas" className="block text-sm font-medium text-gray-700 mb-1.5">
            Personas *
          </label>
          <input
            id="personas"
            name="personas"
            type="number"
            required
            min={1}
            max={12}
            value={form.personas}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1.5">
          Comentarios (opcional)
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          value={form.mensaje}
          onChange={handleChange}
          placeholder="¿Te interesa alguna exposición o artista en particular?"
          className={`${inputClass} resize-y min-h-[100px]`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-violet-700 text-white font-semibold hover:bg-violet-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Enviando…' : 'Solicitar visita'}
      </button>
    </form>
  )
}
