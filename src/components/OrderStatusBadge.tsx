interface OrderStatusBadgeProps {
  estado: string
}

const estadoConfig: Record<string, { label: string; color: string }> = {
  pendiente_pago: {
    label: 'Pendiente de pago',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  procesando: {
    label: 'Procesando',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  enviado: {
    label: 'Enviado',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
}

export default function OrderStatusBadge({ estado }: OrderStatusBadgeProps) {
  const config = estadoConfig[estado] ?? {
    label: estado,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.label}
    </span>
  )
}



