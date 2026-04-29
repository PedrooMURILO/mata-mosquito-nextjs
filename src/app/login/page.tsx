'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')

  async function handleSubmit() {
    setErro('')

    if (modo === 'cadastro') {
      const { error } = await supabase.from('users').insert({ username, password })

      if (error) {
        console.log(error)

        if (error.code === '23505') return setErro('Nome de usuário já existe')
        return setErro('Erro ao cadastrar')
      }
    } else {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !data) return setErro('Usuário ou password incorretos')
    }

    // Salva o usuário na sessionStorage
    sessionStorage.setItem('username', username)
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">{modo === 'login' ? 'Entrar' : 'Cadastrar'}</h1>

      <input
        className="border p-2 rounded w-64"
        placeholder="Nome de usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      <button className="bg-red-600 text-white px-6 py-2 rounded font-bold" onClick={handleSubmit}>
        {modo === 'login' ? 'Entrar' : 'Cadastrar'}
      </button>

      <button
        className="text-sm underline"
        onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}
      >
        {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
      </button>
    </div>
  )
}
