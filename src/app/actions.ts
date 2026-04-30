'use server'

import { supabase } from '@/lib/supabase'

export async function loginUser(username: string, senha: string) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .eq('password', senha)
    .single()

  if (error || !data) {
    return { error: 'Usuário ou senha incorretos' }
  }

  return { success: true, data }
}

export async function registerUser(username: string, senha: string) {
  const { error } = await supabase
    .from('users')
    .insert({ username, password: senha })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Nome de usuário já existe' }
    }
    return { error: 'Erro ao cadastrar' }
  }

  return { success: true }
}

export async function saveScore(username: string, score: number, kills: number, nivel: string, resultado: string) {
  const { data: usuario } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  const { error } = await supabase.from('scores').insert({
    user_id: usuario?.id ?? null,
    username,
    score,
    kills,
    nivel,
    resultado,
  })

  if (error) {
    return { error: 'Erro ao salvar score' }
  }

  return { success: true }
}

export async function getRanking(niveis: string[]) {
  const resultados: Record<string, any[]> = {}

  await Promise.all(
    niveis.map(async (key) => {
      const { data } = await supabase
        .from('scores')
        .select('*')
        .eq('nivel', key)
        .order('score', { ascending: false })
        .limit(5)

      resultados[key] = data ?? []
    })
  )

  return resultados
}
