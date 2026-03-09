import React, { useState } from 'react'

const EMOJIS = { PENDIENTE: '📌', EVENTO: '📅', COMPRA: '🛒', AGENDA: '🚗' }

export default function ListView({ items, onToggle, onUpdate, onDelete }) {
  const [editId, setEditId]       = useState(null)
  const [editText, setEditText]   = useState('')
  const [lightbox, setLightbox]   = useState(null)

  const startEdit = (item) => { setEditId(item.id); setEditText(item.descripcion) }
  const saveEdit  = (item) => {
    if (editText.trim()) onUpdate(item.id, { descripcion: editText.trim() })
    setEditId(null)
  }

  const pendientes  = items.filter(i => !i.completado)
  const completados = items.filter(i => i.completado)

  if (items.length === 0) {
    return (
      <div className="list-empty">
        <div className="empty-icon">📋</div>
        <div className="empty-title">Sin items por ahora</div>
        <div className="empty-sub">Escribe en Slack para agregar tareas, eventos o compras</div>
      </div>
    )
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
            <span className="item-desc" onClick={() => startEdit(item)}>{item.descripcion}</span>
          )}
        </div>

        {/* Thumbnail de imagen */}
        {item.imagen_url && (
          <div className="item-image-wrap" onClick={() => setLightbox(item.imagen_url)}>
            <img src={item.imagen_url} alt="adjunto" className="item-thumbnail" loading="lazy" />
          </div>
        )}

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
          <div className="section-label">
            PENDIENTES ({pendientes.length})
          </div>
          {pendientes.map(renderItem)}
        </>
      )}
      {completados.length > 0 && (
        <>
          <div className="section-label completed-label">
            COMPLETADOS ({completados.length})
          </div>
          {completados.map(renderItem)}
        </>
      )}

      {/* Lightbox para ver imagen completa */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Vista completa" className="lightbox-img" />
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
