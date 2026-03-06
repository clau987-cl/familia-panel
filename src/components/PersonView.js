import React, { useMemo } from 'react'

const EMOJIS = { PENDIENTE: '📌', EVENTO: '📅', COMPRA: '🛒', AGENDA: '🚗' }

export default function PersonView({ items, onToggle }) {
  const porPersona = useMemo(() => {
    const activos = items.filter(i => !i.completado)
    const mapa = {}
    for (const item of activos) {
      const persona = item.responsable || item.creado_por || 'Sin asignar'
      if (!mapa[persona]) mapa[persona] = []
      mapa[persona].push(item)
    }
    return Object.entries(mapa).sort((a, b) => b[1].length - a[1].length)
  }, [items])

  if (porPersona.length === 0) {
    return <div className="list-empty">✅ No hay pendientes activos.</div>
  }

  return (
    <div className="person-grid">
      {porPersona.map(([persona, personaItems]) => (
        <div key={persona} className="person-card">
          <div className="person-header">
            <div className="person-avatar">{persona[0]?.toUpperCase() || '?'}</div>
            <div>
              <div className="person-name">{persona}</div>
              <div className="person-count">{personaItems.length} pendiente{personaItems.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div className="person-items">
            {personaItems.map(item => (
              <div
                key={item.id}
                className="person-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onToggle(item)}
                title="Clic para marcar como completado"
              >
                <span className="person-item-emoji">{EMOJIS[item.tipo]}</span>
                <div>
                  <div className="person-item-text">{item.descripcion}</div>
                  {item.fecha && (
                    <div className="person-item-fecha">⏰ {item.fecha}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
