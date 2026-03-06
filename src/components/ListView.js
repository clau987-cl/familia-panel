import React, { useState } from 'react'

const EMOJIS = { PENDIENTE: '📌', EVENTO: '📅', COMPRA: '🛒', AGENDA: '🚗' }

export default function ListView({ items, onToggle, onUpdate, onDelete }) {
  const [editId, setEditId]     = useState(null)
  const [editText, setEditText] = useState('')

  const startEdit = (item) => { setEditId(item.id); setEditText(item.descripcion) }
  const saveEdit  = (item) => {
    if (editText.trim()) onUpdate(item.id, { descripcion: editText.trim() })
    setEditId(null)
  }

  const pendientes  = items.filter(i => !i.completado)
  const completados = items.filter(i => i.completado)

  if (items.length === 0) {
    return <div className="list-empty">✅ No hay items. ¡Escribe en Slack para agregar!</div>
  }

  const renderItem = (item) => (
    <div key={item.id} className={`item-card ${item.completado ? 'completado' : ''}`}>
      <div
        className={`item-check ${item.completado ? 'checked' : ''}`}
        onClick={() => onToggle(item)}
      />
      <div className="item-body">
        <div className="item-top">
          <span className={`item-tipo tipo-${item.tipo}`}>
            {EMOJIS[item.tipo]} {item.tipo}
          </span>
          {editId === item.id ? (
            <input
              className="item-edit-input"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={() => saveEdit(item)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(item); if (e.key === 'Escape') setEditId(null) }}
              autoFocus
            />
          ) : (
            <span className="item-desc">{item.descripcion}</span>
          )}
        </div>
        <div className="item-meta">
          {item.fecha && (
            <span className="item-fecha">⏰ {item.fecha}</span>
          )}
          {item.responsable && (
            <span className="item-persona">👤 {item.responsable}</span>
          )}
          {item.creado_por && item.creado_por !== item.responsable && (
            <span className="item-persona" style={{ background: '#ede9fe', color: '#5b21b6' }}>
              ✏️ {item.creado_por}
            </span>
          )}
        </div>
      </div>
      <div className="item-actions">
        <button className="btn-action" onClick={() => startEdit(item)} title="Editar">✏️</button>
        <button className="btn-action danger" onClick={() => onDelete(item.id)} title="Eliminar">🗑️</button>
      </div>
    </div>
  )

  return (
    <div className="list-view">
      {pendientes.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', padding: '4px 0' }}>
            PENDIENTES ({pendientes.length})
          </div>
          {pendientes.map(renderItem)}
        </>
      )}
      {completados.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', padding: '12px 0 4px' }}>
            COMPLETADOS ({completados.length})
          </div>
          {completados.map(renderItem)}
        </>
      )}
    </div>
  )
}
