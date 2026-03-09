import React, { useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')
const localizer = momentLocalizer(moment)

const COLORS = { PENDIENTE: '#f59e0b', EVENTO: '#3b82f6', COMPRA: '#10b981', AGENDA: '#8b5cf6' }

function parseFecha(fecha) {
  if (!fecha) return null
  const hoy = moment()

  const iso = moment(fecha, ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DD'], true)
  if (iso.isValid()) return iso.toDate()

  const clean = fecha.toLowerCase().trim()

  const spanishFormats = [
    'D [de] MMMM [de] YYYY',
    'D [de] MMMM YYYY',
    'DD/MM/YYYY',
    'D/M/YYYY',
    'MMMM D',
  ]
  for (const fmt of spanishFormats) {
    const m = moment(clean, fmt, 'es', true)
    if (m.isValid()) {
      if (!fmt.includes('YYYY')) {
        m.year(hoy.year())
        if (m.isBefore(hoy, 'day')) m.year(hoy.year() + 1)
      }
      return m.toDate()
    }
  }

  const withoutYear = ['D [de] MMMM', 'D MMMM']
  for (const fmt of withoutYear) {
    const m = moment(clean, fmt, 'es', true)
    if (m.isValid()) {
      m.year(hoy.year())
      if (m.isBefore(hoy, 'day')) m.year(hoy.year() + 1)
      return m.toDate()
    }
  }

  const meses = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
    'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
    'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
  }
  let foundMes = null
  for (const [mes, num] of Object.entries(meses)) {
    if (clean.includes(mes)) { foundMes = num; break }
  }
  const diaMatch = clean.match(/\b(\d{1,2})\b/)

  if (diaMatch && foundMes) {
    const dia = parseInt(diaMatch[1])
    if (dia >= 1 && dia <= 31) {
      const m = moment({ year: hoy.year(), month: foundMes - 1, date: dia })
      if (m.isValid()) {
        if (m.isBefore(hoy, 'day')) m.year(hoy.year() + 1)
        return m.toDate()
      }
    }
  }

  if (!diaMatch && foundMes) {
    const m = moment({ year: hoy.year(), month: foundMes - 1, date: 1 })
    if (m.isValid()) {
      if (m.isBefore(hoy, 'day')) m.year(hoy.year() + 1)
      return m.toDate()
    }
  }

  const diasSemana = {
    'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
    'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0,
  }
  for (const [dia, dow] of Object.entries(diasSemana)) {
    if (clean.includes(dia)) {
      const m = hoy.clone()
      let daysUntil = (dow - m.day() + 7) % 7
      if (daysUntil === 0) daysUntil = 7
      if (diaMatch) {
        const dayNum = parseInt(diaMatch[1])
        if (dayNum >= 1 && dayNum <= 31) {
          const candidate = m.clone().date(dayNum)
          if (candidate.isBefore(hoy, 'day')) candidate.add(1, 'month')
          if (candidate.isValid()) return candidate.toDate()
        }
      }
      m.add(daysUntil, 'days')
      return m.toDate()
    }
  }

  if (diaMatch && !foundMes) {
    const dia = parseInt(diaMatch[1])
    if (dia >= 1 && dia <= 31) {
      const m = hoy.clone().date(dia)
      if (m.isBefore(hoy, 'day')) m.add(1, 'month')
      if (m.isValid()) return m.toDate()
    }
  }

  return null
}

export default function CalendarView({ items, onUpdate }) {
  const events = useMemo(() => {
    return items
      .filter(i => !i.completado && i.fecha)
      .map(item => {
        const start = parseFecha(item.fecha)
        if (!start) return null
        const end = new Date(start.getTime() + 60 * 60 * 1000)
        return { id: item.id, title: item.descripcion, start, end, tipo: item.tipo, item }
      })
      .filter(Boolean)
  }, [items])

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: COLORS[event.tipo] || '#6366f1',
      borderRadius: '6px', border: 'none', color: '#fff', fontSize: '12px',
      padding: '2px 6px', cursor: 'pointer',
    }
  })

  const messages = {
    today: 'Hoy', previous: '←', next: '→',
    month: 'Mes', week: 'Semana', day: 'Día', agenda: 'Agenda',
    noEventsInRange: 'No hay eventos en este período.',
    date: 'Fecha', time: 'Hora', event: 'Evento',
  }

  const sinFecha = items.filter(i => !i.completado && i.fecha && !parseFecha(i.fecha))

  return (
    <div className="calendar-wrapper">
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(COLORS).map(([tipo, color]) => (
          <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
            {tipo}
          </span>
        ))}
        {sinFecha.length > 0 && (
          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
            ⚠️ {sinFecha.length} item{sinFecha.length > 1 ? 's' : ''} con fecha no reconocida — edítalos en la lista
          </span>
        )}
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
