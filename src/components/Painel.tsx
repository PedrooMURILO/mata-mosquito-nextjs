interface PainelProps {
  vidas: number
  kills: number
  score: number
  faseBonus: boolean
  killsAlvo: number
}

export function Painel({ vidas, kills, score, faseBonus, killsAlvo }: PainelProps) {
  return (
    <div className="painel">
      <div className="vidas">
        {[1, 2, 3].map(i => (
          <img
            key={i}
            src={i <= vidas ? '/imagens/coracao_cheio.png' : '/imagens/coracao_vazio.png'}
            alt=""
          />
        ))}
      </div>
      <div className="cronometro">
        {faseBonus ? (
          <span style={{ color: '#f1c40f' }}>🎯 BÔNUS!</span>
        ) : (
          <span>
            {kills} / {killsAlvo} mosquitos
          </span>
        )}
      </div>
      <div className="cronometro">
        Score: <strong>{score}</strong>
      </div>
    </div>
  )
}
