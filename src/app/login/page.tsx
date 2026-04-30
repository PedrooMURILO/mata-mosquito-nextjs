'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser } from '@/app/actions'

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

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [mosquitos, setMosquitos] = useState<MosquitoDecorativo[]>([])

  useEffect(() => {
    setMosquitos(gerarMosquitos())
  }, [])

  async function handleSubmit() {
    setErro('')

    if (!username.trim() || !senha.trim()) {
      return setErro('Preencha todos os campos')
    }

    if (modo === 'cadastro') {
      const res = await registerUser(username, senha)
      if (res.error) return setErro(res.error)
    } else {
      const res = await loginUser(username, senha)
      if (res.error) return setErro(res.error)
    }

    document.cookie = `username=${username}; path=/`
    sessionStorage.setItem('username', username)
    router.push('/')
  }

  return (
    <>
      {mosquitos.map(m => (
        <img
          key={m.id}
          src="/imagens/mosquito.png"
          className="bg-mosquito"
          style={{ width: m.size, height: m.size, left: `${m.x}%`, top: `${m.y}%` }}
        />
      ))}

      <div className="custom-card" style={{ minWidth: 380, textAlign: 'center' }}>
        <div className="game-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          MATA <span style={{ color: '#fff' }}>MOSQUITO</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem',
              outline: 'none',
              width: '100%',
            }}
            placeholder="Nome de usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem',
              outline: 'none',
              width: '100%',
            }}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {erro && (
          <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{erro}</p>
        )}

        <button className="btn-game" onClick={handleSubmit}>
          {modo === 'login' ? 'ENTRAR' : 'CADASTRAR'}
        </button>

        <div style={{ marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={() => { setErro(''); setModo(modo === 'login' ? 'cadastro' : 'login') }}>
            {modo === 'login' ? 'Cadastre-se' : 'Entre'}
          </button>
        </div>
      </div>
    </>
  )
}