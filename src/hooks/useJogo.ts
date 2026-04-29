'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Tipos possíveis de inseto na tela
export type TamanhoMosquito = 'mosquito1' | 'mosquito2' | 'mosquito3'
export type LadoMosquito = 'ladoA' | 'ladoB'
export type TipoInseto = 'mosquito' | 'borboleta'

export interface Inseto {
  id: number
  tipo: TipoInseto
  tamanho: TamanhoMosquito
  lado: LadoMosquito
  x: number
  y: number
}

// Pontuação por tamanho — pequeno é mais difícil, vale mais
const PONTOS: Record<TamanhoMosquito, number> = {
  mosquito1: 3,
  mosquito2: 2,
  mosquito3: 1,
}

// Intervalo inicial por nível (ms)
const INTERVALO_INICIAL: Record<string, number> = {
  normal: 1500,
  dificil: 1000,
  chucknorris: 750,
}

// A cada mosquito morto, reduz o intervalo em 20ms
const REDUCAO_POR_KILL = 20

// Dimensões do palco — usadas para calcular posição aleatória
const LARGURA_PALCO = 800
const ALTURA_PALCO = 600

// Helpers para sortear tamanho e lado aleatórios
function tamanhoAleatorio(): TamanhoMosquito {
  const opcoes: TamanhoMosquito[] = ['mosquito1', 'mosquito2', 'mosquito3']
  return opcoes[Math.floor(Math.random() * 3)]
}

function ladoAleatorio(): LadoMosquito {
  return Math.random() < 0.5 ? 'ladoA' : 'ladoB'
}

// Gera uma posição x/y aleatória dentro do palco
// O tamanho do inseto é subtraído para ele não sair pela borda
const TAMANHO_PX: Record<TamanhoMosquito, number> = {
  mosquito1: 50,
  mosquito2: 70,
  mosquito3: 90,
}

function posicaoAleatoria(tamanho: TamanhoMosquito) {
  const px = TAMANHO_PX[tamanho]
  return {
    x: Math.floor(Math.random() * (LARGURA_PALCO - px)),
    y: Math.floor(Math.random() * (ALTURA_PALCO - px)),
  }
}

export function useJogo() {
  const router = useRouter()

  // --- Estado que vai para a tela ---
  const [vidas, setVidas] = useState(3)
  const [kills, setKills] = useState(0)
  const [score, setScore] = useState(0)
  const [faseBonus, setFaseBonus] = useState(false)
  const [insetos, setInsetos] = useState<Inseto[]>([])

  // --- Refs que o setInterval vai ler ---
  // useRef não causa re-render, e o intervalo sempre lê o valor atual
  const vidasRef = useRef(3)
  const killsRef = useRef(0)
  const scoreRef = useRef(0)
  const faseBonusRef = useRef(false)
  const intervaloAtualRef = useRef(1500) // intervalo de spawn em ms
  const proximoIdRef = useRef(0) // id incremental para cada inseto
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Lê o nível da sessionStorage (definido no menu)
  const nivel =
    typeof window !== 'undefined' ? (sessionStorage.getItem('nivel') ?? 'normal') : 'normal'

  // --- Funções de atualização sincronizada (state + ref juntos) ---
  // Sempre que atualizar um valor, atualiza o state (tela) E o ref (intervalo)
  function atualizarVidas(novasVidas: number) {
    vidasRef.current = novasVidas
    setVidas(novasVidas)
  }

  function atualizarKills(novosKills: number) {
    killsRef.current = novosKills
    setKills(novosKills)

    // Ao atingir 50 kills, entra na fase bônus — sem parar o jogo
    if (novosKills >= 50 && !faseBonusRef.current) {
      faseBonusRef.current = true
      setFaseBonus(true)
    }
  }

  function atualizarScore(novoScore: number) {
    scoreRef.current = novoScore
    setScore(novoScore)
  }

  // --- Spawna um novo inseto ---
  // 20% de chance de ser borboleta, 80% mosquito
  const spawnInseto = useCallback(() => {
    const tipo: TipoInseto = Math.random() < 0.2 ? 'borboleta' : 'mosquito'
    const tamanho = tamanhoAleatorio()
    const lado = ladoAleatorio()
    const { x, y } = posicaoAleatoria(tamanho)

    const novoInseto: Inseto = {
      id: proximoIdRef.current++,
      tipo,
      tamanho,
      lado,
      x,
      y,
    }

    setInsetos(prev => {
      console.log('spawn chamado, insetos na tela:', prev)
      const mosquitoEscapou = prev.some(i => i.tipo === 'mosquito')
      console.log('mosquitoEscapou:', mosquitoEscapou, '| vidas:', vidasRef.current)

      if (mosquitoEscapou) {
        const novasVidas = vidasRef.current - 1
        if (novasVidas <= 0) {
          encerrarJogo()
          return []
        }
        atualizarVidas(novasVidas)
      }

      return [novoInseto]
    })
  }, [])

  // --- Encerra o jogo e redireciona ---
  function encerrarJogo() {
    // Para o intervalo de spawn
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)

    // Salva resultado na sessionStorage para as telas de resultado lerem
    sessionStorage.setItem('score', String(scoreRef.current))
    sessionStorage.setItem('kills', String(killsRef.current))
    sessionStorage.setItem('resultado', faseBonusRef.current ? 'vitoria' : 'derrota')

    router.push(faseBonusRef.current ? '/vitoria' : '/game-over')
  }

  // --- Clique no mosquito ---
  function clicarMosquito(id: number, tamanho: TamanhoMosquito) {
    // Remove o mosquito da tela
    setInsetos(prev => prev.filter(i => i.id !== id))

    // Atualiza score e kills
    atualizarScore(scoreRef.current + PONTOS[tamanho])
    atualizarKills(killsRef.current + 1)

    // Reduz o intervalo de spawn (dificuldade progressiva)
    intervaloAtualRef.current = Math.max(
      100, // nunca abaixo de 100ms para não travar o browser
      intervaloAtualRef.current - REDUCAO_POR_KILL
    )

    // Reinicia o intervalo com a nova velocidade
    reiniciarIntervalo()
  }

  // --- Clique na borboleta ---
  function clicarBorboleta(id: number) {
    // Remove a borboleta da tela
    setInsetos(prev => prev.filter(i => i.id !== id))

    // Penaliza uma vida
    const novasVidas = vidasRef.current - 1

    if (novasVidas <= 0) {
      encerrarJogo()
      return
    }

    atualizarVidas(novasVidas)
  }

  // --- Reinicia o setInterval com o intervalo atual ---
  function reiniciarIntervalo() {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    spawnIntervalRef.current = setInterval(spawnInseto, intervaloAtualRef.current)
  }

  // --- Inicializa o jogo ---
  useEffect(() => {
    intervaloAtualRef.current = INTERVALO_INICIAL[nivel] ?? 1500

    // Aguarda um tick antes de começar para o componente estar montado
    const inicio = setTimeout(() => {
      spawnInseto()
      spawnIntervalRef.current = setInterval(spawnInseto, intervaloAtualRef.current)
    }, 100)

    return () => {
      clearTimeout(inicio)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [])

  return {
    vidas,
    kills,
    score,
    faseBonus,
    insetos,
    nivel,
    clicarMosquito,
    clicarBorboleta,
  }
}
