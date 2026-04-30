'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MosquitoDecorativo {
  id: number
  size: number
  x: number
  y: number
}

function gerarMosquitos(): MosquitoDecorativo[] {
  return Array.from({ length: 3 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))
}

export default function MenuPage() {
  const DICAS = [
    'Elimine água parada em vasos de plantas, pneus e calhas — são os principais criadouros do mosquito.',
    "Mantenha caixas d'água sempre tampadas e vedadas corretamente.",
    'Coloque areia nos pratinhos de vasos de plantas em vez de água.',
    'Limpe calhas e ralos regularmente para evitar acúmulo de água.',
    'Descarte corretamente garrafas, latas e embalagens que possam acumular água.',
    'Use repelente regularmente, especialmente em crianças e idosos.',
    'Instale telas em janelas e portas para impedir a entrada do mosquito.',
    'O mosquito da dengue pica principalmente durante o dia — fique atento!',
    'Ao viajar, verifique se o destino tem registro de dengue e tome precauções.',
    'Febre alta, dor de cabeça e manchas na pele? Procure um médico imediatamente.',
  ]

  const router = useRouter()
  const [nivel, setNivel] = useState('')
  const [username, setUsername] = useState<string | null>(null)
  const [mosquitos, setMosquitos] = useState<MosquitoDecorativo[]>([])
  const [dica, setDica] = useState('')
  const [toast, setToast] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setUsername(sessionStorage.getItem('username'))
    setMosquitos(gerarMosquitos())

    // Define a primeira dica
    setDica(DICAS[Math.floor(Math.random() * DICAS.length)])

    // Troca a dica a cada 5 segundos
    const intervalo = setInterval(() => {
      setDica(DICAS[Math.floor(Math.random() * DICAS.length)])
    }, 5000)

    return () => clearInterval(intervalo)
  }, [])

  function iniciarJogo() {
    if (!nivel) {
      setToast(true)
      setShake(true)
      setTimeout(() => setToast(false), 3000)
      setTimeout(() => setShake(false), 500)
      return
    }
    if (!username) return router.push('/login')
    sessionStorage.setItem('nivel', nivel)
    router.push('/jogo')
  }

  function sair() {
    sessionStorage.clear()
    document.cookie = 'username=; path=/; max-age=0'
    setUsername(null)
  }

  return (
    <>
      {/* Mosquitos de fundo */}
      {mosquitos.map(m => (
        <img
          key={m.id}
          src="/imagens/mosquito.png"
          className="bg-mosquito"
          style={{ width: m.size, height: m.size, left: `${m.x}%`, top: `${m.y}%` }}
        />
      ))}

      {/* Toast */}
      <div className={`custom-toast${toast ? ' show' : ''}`}>
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        Selecione um nível de dificuldade!
      </div>

      {/* Card central */}
      <div className="custom-card" style={{ width: 700, minWidth: 700 }}>
        <div className="game-title">
          MATA <br />
          <span style={{ color: '#fff' }}>MOSQUITO</span>
        </div>

        <div className="mission-box">
          <h5>Dica contra a Dengue</h5>
          <p>{dica}</p>
        </div>

        <div className={`difficulty-container${shake ? ' shake' : ''}`}>
          {['normal', 'dificil', 'chucknorris'].map(n => (
            <button
              key={n}
              className={`btn-difficulty${nivel === n ? ' active' : ''}`}
              onClick={() => setNivel(n)}
            >
              {n === 'normal' ? 'Normal' : n === 'dificil' ? 'Difícil' : 'Impossível'}
            </button>
          ))}
        </div>

        <button className="btn-game" onClick={iniciarJogo}>
          INICIAR JOGO
        </button>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {username ? (
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Olá, <strong style={{ color: '#f1c40f' }}>{username}</strong>
            </span>
          ) : null}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {username ? (
              <button className="btn-secondary" onClick={sair}>
                Sair
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => router.push('/login')}>
                Entrar / Cadastrar
              </button>
            )}
            <button className="btn-secondary" onClick={() => router.push('/ranking')}>
              Ranking
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
