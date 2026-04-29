import { TamanhoMosquito, LadoMosquito } from '@/hooks/useJogo'

interface BorboletaProps {
  id: number
  tamanho: TamanhoMosquito
  lado: LadoMosquito
  x: number
  y: number
  onClicar: (id: number) => void
}

export function Borboleta({ id, tamanho, lado, x, y, onClicar }: BorboletaProps) {
  return (
    <img
      src="/imagens/borboleta.png"
      className={`${tamanho} ${lado}`}
      style={{ position: 'absolute', left: x, top: y, cursor: 'pointer' }}
      onClick={() => onClicar(id)}
    />
  )
}