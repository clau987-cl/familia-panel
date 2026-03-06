import React from 'react'
import { supabase } from '../supabaseClient'

const TIPOS = ['todos', 'PENDIENTE', 'EVENTO', 'COMPRA', 'AGENDA']
const TIPO_LABELS = { todos: 'Todos', PENDIENTE: '📌 Pendientes', EVENTO: '📅 Eventos', COMPRA: '🛒 Compras', AGENDA: '🚗 Agenda' }

export default function Header({ session, view, setView, filter, setFilter, pendientes }) {
  const user = session?.user
  const nombre = user?.user_metadata?.full_name || user?.email || 'Usuario'
  const avatar = user?.user_metadata?.avatar_url

  return (
    <header className="header">
      <span className="header-logo">
        🏠 Familia
        {pendientes > 0 && <span className="header-badge">{pendientes}</span>}
      </span>

      <nav className="nav-tabs">
        <button className={`nav-tab ${view === 'lista' ? 'active' : ''}`} onClick={() => setView('lista')}>
          📋 Lista
        </button>
        <button className={`nav-tab ${view === 'calendario' ? 'active' : ''}`} onClick={() => setView('calendario')}>
          📅 Calendario
        </button>
        <button className={`nav-tab ${view === 'persona' ? 'active' : ''}`} onClick={() => setView('persona')}>
          👤 Por persona
        </button>
      </nav>

      {view === 'lista' && (
        <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          {TIPOS.map(t => <option key={t} value={t}>{TIPO_LABELS[t]}</option>)}
        </select>
      )}

      <div className="user-info" style={{ marginLeft: 'auto' }}>
        {avatar
          ? <img className="user-avatar" src={avatar} alt={nombre} />
          : <div className="user-avatar" style={{ background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              {nombre[0].toUpperCase()}
            </div>
        }
        <span className="user-name">{nombre.split(' ')[0]}</span>
        <button className="btn-logout" onClick={() => supabase.auth.signOut()}>Salir</button>
      </div>
    </header>
  )
          }
