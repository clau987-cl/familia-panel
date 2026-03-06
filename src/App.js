import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Header from './components/Header'
import ListView from './components/ListView'
import CalendarView from './components/CalendarView'
import PersonView from './components/PersonView'
import './App.css'

export default function App() {
  const [session, setSession]   = useState(null)
  const [items, setItems]       = useState([])
  const [view, setView]         = useState('lista')
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('todos')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const cargarItems = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('creado_en', { ascending: false })
    if (!error) setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) cargarItems()
  }, [session, cargarItems])

  useEffect(() => {
    if (!session) return
    const channel = supabase
      .channel('items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
        cargarItems()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [session, cargarItems])

  const toggleCompletado = async (item) => {
    await supabase
      .from('items')
      .update({ completado: !item.completado })
      .eq('id', item.id)
    cargarItems()
  }

  const actualizarItem = async (id, campos) => {
    await supabase.from('items').update(campos).eq('id', id)
    cargarItems()
  }

  const eliminarItem = async (id) => {
    await supabase.from('items').delete().eq('id', id)
    cargarItems()
  }

  if (!session) return <Login />

  const itemsFiltrados = filter === 'todos'
    ? items
    : items.filter(i => i.tipo === filter)

  const pendientes = items.filter(i => !i.completado).length

  return (
    <div className="app">
      <Header
        session={session}
        view={view}
        setView={setView}
        filter={filter}
        setFilter={setFilter}
        pendientes={pendientes}
      />
      <main className="main-content">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : view === 'lista' ? (
          <ListView
            items={itemsFiltrados}
            onToggle={toggleCompletado}
            onUpdate={actualizarItem}
            onDelete={eliminarItem}
          />
        ) : view === 'calendario' ? (
          <CalendarView items={items} onUpdate={actualizarItem} />
        ) : (
          <PersonView items={items} onToggle={toggleCompletado} />
        )}
      </main>
    </div>
  )
}
