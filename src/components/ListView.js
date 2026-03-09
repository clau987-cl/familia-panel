import React, { useState } from 'react'

const EMOJIS = { PENDIENTE: '📌', EVENTO: '📅', COMPRA: '🛒', AGENDA: '🚗' }
const TIPOS  = ['PENDIENTE', 'EVENTO', 'COMPRA', 'AGENDA']

function fechaToInput(fecha) {
  if (!fecha) return ''
  const iso = fecha.match(/^(\d{4}-\d{2}-\d{2})(T(\d{2}:\d{2}))?/)
  if (iso) return iso[3] ? `${iso[1]}T${iso[3]}` : `${iso[1]}T00:00`
  return ''
}

function formatFecha(fecha) {
  if (!fecha) return null
  const iso = fecha.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
  if (iso) {
    const [, date, time] = iso
    const [y, m, d] = date.split('-')
    const hora = time === '00:00' ? '' : ` a las ${time}`
    return `${d}/${m}/${y}${hora}`
  }
  return fecha
}

function EditModal({ item, onSave, onClose }) {
  const [desc, setDesc]   = useState(item.descripcion || '')
  const [tipo, setTipo]   = useState(item.tipo || 'PENDIENTE')
  const [fecha, setFecha] = useState(fechaToInput(item.fecha))
  const fechaOriginal = item.fecha && !fechaToInput(item.fecha) ? item.fecha : null

  const handleSave = () => {
    const updates = {}
    if (desc.trim() !== item.descripcion) updates.descripcion = desc.trim()
    if (tipo !== item.tipo)               updates.tipo        = tipo
    const fechaGuardar = fecha || null
    if (fechaGuardar !== item.fecha)      updates.fecha       = fechaGuardar
    if (Object.keys(updates).length > 0) onSave(item.id, updates)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">✏️ Editar item</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Tipo</label>
        <div className="modal-tipo-grid">
          {TIPOS.map(t => (
            <button key={t} className={`modal-tipo-btn ${tipo === t ? 'selected' : ''}`} onClick={() => setTipo(t)}>
              {EMOJIS[t]} {t}
            </button>
          ))}
        </div>

        <label className="modal-label">Descripción</label>
        <textarea className="modal-textarea" value={desc} onChange={e => setDesc(e.target.value)} rows={3} autoFocus />

        <label className="modal-label">
          Fecha y hora
          {fechaOriginal && <span className="modal-fecha-hint"> — texto original: "{fechaOriginal}"</span>}
        </label>
        <input type="datetime-local" className="modal-input" value={fecha} onChange={e => setFecha(e.target.value)} />
        {fecha && <button className="modal-clear-fecha" onClick={() => setFecha('')}>× Quitar fecha</button>}

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn save" onClick={handleSave} disabled={!desc.trim()}>Guardar cambios</button>
        </div>
      </div>
    </div>
  )
}

export default function ListView({ items, onToggle, onUpdate, onDelete }) {
  const [editItem, setEditItem] = useState(null)
  const [lightbox, setLightbox] = useState(null)

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
      <div className={`item-check ${item.completado ? 'checked' : ''}`} onClick={() => onToggle(item)} />
      <div className="item-body">
        <div className="item-top">
          <span className={`item-tipo tipo-${item.tipo}`}>{EMOJIS[item.tipo]} {item.tipo}</span>
          <span className="item-desc">{item.descripcion}</span>
        </div>
        {item.imagen_url && (
          <div className="item-image-wrap" onClick={() => setLightbox(item.imagen_url)}>
            <img src={item.imagen_url} alt="adjunto" className="item-thumbnail" loading="lazy" />
          </div>
        )}
        <div className="item-meta">
          {item.fecha && <span className="item-fecha">⏰ {formatFecha(item.fecha)}</span>}
          {item.responsable && <span className="item-persona">👤 {item.responsable}</span>}
          {item.creado_por && item.creado_por !== item.responsable && (
            <span className="item-persona" style={{ background: '#ede9fe', color: '#5b21b6' }}>✏️ {item.creado_por}</span>
          )}
        </div>
      </div>
      <div className="item-actions">
        <button className="btn-action" onClick={() => setEditItem(item)} title="Editar">✏️</button>
        <button className="btn-action danger" onClick={() => onDelete(item.id)} title="Eliminar">🗑️</button>
      </div>
    </div>
  )

  return (
    <div className="list-view">
      {pendientes.length > 0 && (
        <>{<div className="section-label">PENDIENTES ({pendientes.length})</div>}{pendientes.map(renderItem)}</>
      )}
      {completados.length > 0 && (
        <>{<div className="section-label completed-label">COMPLETADOS ({completados.length})</div>}{completados.map(renderItem)}</>
      )}
      {editItem && <EditModal item={editItem} onSave={onUpdate} onClose={() => setEditItem(null)} />}
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
