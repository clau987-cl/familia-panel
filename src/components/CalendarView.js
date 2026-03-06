import React, { useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')
const localizer = momentLocalizer(moment)

const COLORS = { PENDIENTE: '#f59e0b', EVENTO: '#3b82f6', COMPRA: '#10b981', AGENDA: '#8b5cf6' }

function parseFecha(fecha) {
  if (!fecha) return null
  const formats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'D [de] MMMM', 'dddd D', 'D [del] MMMM']
  for (const fmt of formats) {
    const m = moment(fecha, fmt, 'es', true)
    if (m.isValid()) return m.toDate()
  }
  const m = moment(fecha, 'es')
  if (m.isValid()) return m.toDate()
  return null
}

export default function CalendarView({ items }) {
  const events = useMemo(() => {
    return items
      .filter(i => !i.completado && i.fecha)
      .map(item => {
        const start = parseFecha(item.fecha)
        if (!start) return null
        const end = new Date(start.getTime() + 60 * 60 * 1000)
        return {
          id:    item.id,
          title: `${item.descripcion}${item.responsable ? ` · ${item.responsable}` : ''}`,
          start,
          end,
          tipo:  item.tipo,
        }
      })
      .filter(Boolean)
  }, [items])

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: COLORS[event.tipo] || '#6366f1',
      borderRadius: '6px',
      border: 'none',
      color: '#fff',
      fontSize: '12px',
      padding: '2px 6px',
    }
  })

  const messages = {
    today: 'Hoy', previous: '←', next: '→',
    month: 'Mes', week: 'Semana', day: 'Día', agenda: 'Agenda',
    noEventsInRange: 'No hay eventos en este período.',
    date: 'Fecha', time: 'Hora', event: 'Evento',
  }

  return (
    <div className="calendar-wrapper">
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(COLORS).map(([tipo, color]) => (
          <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
            {tipo}
          </span>
        ))}
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        messages={messages}
        culture="es"
      />
    </div>
  )
}
