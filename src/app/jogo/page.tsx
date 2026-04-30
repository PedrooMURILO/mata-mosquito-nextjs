'use client'
import { useJogo } from '@/hooks/useJogo'
import { Mosquito } from '@/components/Mosquito'
import { Borboleta } from '@/components/Borboleta'
import { Painel } from '@/components/Painel'
import { useAuth } from '@/lib/useAuth'

export default function JogoPage() {
  useAuth()
  const { vidas, kills, score, faseBonus, insetos, killsAlvo, clicarMosquito, clicarBorboleta } =
    useJogo()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div id="game-stage" style={{ cursor: 'url(/imagens/mata_mosquito.png) 30 30, auto' }}>
        {insetos.map(inseto =>
          inseto.tipo === 'mosquito' ? (
            <Mosquito
              key={inseto.id}
              id={inseto.id}
              tamanho={inseto.tamanho}
              lado={inseto.lado}
              x={inseto.x}
              y={inseto.y}
              onClicar={clicarMosquito}
            />
          ) : (
            <Borboleta
              key={inseto.id}
              id={inseto.id}
              tamanho={inseto.tamanho}
              lado={inseto.lado}
              x={inseto.x}
              y={inseto.y}
              onClicar={clicarBorboleta}
            />
          )
        )}
      </div>

      <Painel
        vidas={vidas}
        kills={kills}
        score={score}
        faseBonus={faseBonus}
        killsAlvo={killsAlvo}
      />
    </div>
  )
}
