'use client'

import { useState } from 'react'
import type { Pedido } from '@/sanity/lib/types'
import OrderCard from './OrderCard'

interface OrderListProps {
  pedidos: Pedido[]
}

const estados = [
  { value: 'todos',      label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'procesando', label: 'Procesando' },
  { value: 'enviado',    label: 'Enviado' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'cancelado',  label: 'Cancelado' },
]

export default function OrderList({ pedidos }: OrderListProps) {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  const pedidosFiltrados =
    filtroEstado === 'todos'
      ? pedidos
      : pedidos.filter((pedido) => pedido.estado === filtroEstado)

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {estados.map((estado) => {
          const count =
            estado.value === 'todos'
              ? pedidos.length
              : pedidos.filter((p) => p.estado === estado.value).length
          const active = filtroEstado === estado.value
          return (
            <button
              key={estado.value}
              onClick={() => setFiltroEstado(estado.value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                active
                  ? 'bg-amber-400 text-gray-900 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {estado.label}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold ${
                  active ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No hay pedidos con este estado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <OrderCard key={pedido._id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  )
}
