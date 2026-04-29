'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ScoreEntry {
  id: string
  username: string
  score: number
  kills: number
  resultado: string
  created_at: string
}

const NIVEIS = [
  { key: 'normal', label: 'Normal', cor: '#2ed573' },
  { key: 'dificil', label: 'Difícil', cor: '#f1c40f' },
  { key: 'chucknorris', label: 'Impossível', cor: '#e74c3c' },
]

function posicaoCor(index: number) {
  if (index === 0) return '#f1c40f'
  if (index === 1) return '#ccc'
  if (index === 2) return '#cd7f32'
  return 'rgba(255,255,255,0.4)'
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

interface CardRankingProps {
  label: string
  cor: string
  scores: ScoreEntry[]
  carregando: boolean
}

function CardRanking({ label, cor, scores, carregando }: CardRankingProps) {
  return (
    <div className="custom-card" style={{ flex: 1, minWidth: 380 }}>
      <h2 style={{
        color: cor,
        fontWeight: 900,
        fontSize: '1.3rem',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: '1.25rem',
        textAlign: 'center',
        borderBottom: `1px solid ${cor}33`,
        paddingBottom: '0.75rem',
      }}>
        {label}
      </h2>

      {carregando ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.9rem' }}>Carregando...</p>
      ) : scores.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontSize: '0.9rem' }}>Nenhum score ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scores.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 10,
                background: index === 0 ? `${cor}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${index === 0 ? `${cor}33` : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <span style={{ fontWeight: 900, fontSize: '1rem', color: posicaoCor(index), width: 20, textAlign: 'center' }}>
                {index + 1}
              </span>
              <span style={{ flex: 1, fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                {entry.username}
              </span>
              <span style={{ color: cor, fontWeight: 700, fontSize: '0.95rem' }}>
                {entry.score} pts
              </span>
              <span style={{
                background: entry.resultado === 'vitoria' ? 'rgba(46,213,115,0.15)' : 'rgba(231,76,60,0.15)',
                color: entry.resultado === 'vitoria' ? '#2ed573' : '#e74c3c',
                padding: '1px 8px',
                borderRadius: 50,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}>
                {entry.resultado === 'vitoria' ? 'V' : 'D'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                {formatarData(entry.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RankingPage() {
  const router = useRouter()
  const [dados, setDados] = useState<Record<string, ScoreEntry[]>>({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarScores() {
      const resultados: Record<string, ScoreEntry[]> = {}

      await Promise.all(
        NIVEIS.map(async ({ key }) => {
          const { data } = await supabase
            .from('scores')
            .select('*')
            .eq('nivel', key)
            .order('score', { ascending: false })
            .limit(5)

          resultados[key] = data ?? []
        })
      )

      setDados(resultados)
      setCarregando(false)
    }

    buscarScores()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#f1c40f', fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: 5, marginBottom: '2rem', textShadow: '0 0 20px rgba(241,196,15,0.3)' }}>
        Ranking
      </h1>

      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: 1400, flexWrap: 'wrap', justifyContent: 'center' }}>
        {NIVEIS.map(({ key, label, cor }) => (
          <CardRanking
            key={key}
            label={label}
            cor={cor}
            scores={dados[key] ?? []}
            carregando={carregando}
          />
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button className="btn-secondary" onClick={() => router.push('/')}>
          Menu
        </button>
      </div>
    </div>
  )
}