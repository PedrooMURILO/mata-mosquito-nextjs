'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VitoriaPage() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [kills, setKills] = useState(0)
  const [salvando, setSalvando] = useState(true)

  useEffect(() => {
    const s = Number(sessionStorage.getItem('score') ?? 0)
    const k = Number(sessionStorage.getItem('kills') ?? 0)
    const nivel = sessionStorage.getItem('nivel') ?? 'normal'
    const username = sessionStorage.getItem('username') ?? 'Anônimo'

    setScore(s)
    setKills(k)

    async function salvarScore() {
      const { data: usuario } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      await supabase.from('scores').insert({
        user_id: usuario?.id ?? null,
        username,
        score: s,
        kills: k,
        nivel,
        resultado: 'vitoria',
      })

      setSalvando(false)
    }

    salvarScore()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="custom-card" style={{ minWidth: 380, textAlign: 'center' }}>
        <div className="vitoria-texto">VITÓRIA!</div>

        <div style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>Mosquitos mortos: <strong style={{ color: '#f1c40f' }}>{kills}</strong></span>
          <span>Score final: <strong style={{ color: '#f1c40f' }}>{score}</strong></span>
          {salvando && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Salvando score...</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn-game" onClick={() => router.push('/')}>
            Jogar Novamente
          </button>
          <button className="btn-secondary" onClick={() => router.push('/ranking')}>
            Ranking
          </button>
        </div>
      </div>
    </div>
  )
}