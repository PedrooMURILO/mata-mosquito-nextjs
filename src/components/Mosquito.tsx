import { TamanhoMosquito, LadoMosquito } from '@/hooks/useJogo'

interface MosquitoProps {
  id: number
  tamanho: TamanhoMosquito
  lado: LadoMosquito
  x: number
  y: number
  onClicar: (id: number, tamanho: TamanhoMosquito) => void
}

export function Mosquito({ id, tamanho, lado, x, y, onClicar }: MosquitoProps) {
  return (
    <img
      src="/imagens/mosquito.png"
      className={`${tamanho} ${lado}`}
      style={{ position: 'absolute', left: x, top: y }}
      onClick={() => onClicar(id, tamanho)}
    />
  )
}