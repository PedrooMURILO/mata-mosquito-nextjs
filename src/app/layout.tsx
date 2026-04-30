import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mata Mosquito',
  description: 'Ajude a combater a dengue!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>
        <div className="mobile-block">
          <img src="/imagens/mosquito.png" style={{ width: 80, opacity: 0.8 }} />
          <h2
            style={{
              color: '#f1c40f',
              fontWeight: 900,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: 3,
              margin: 0,
            }}
          >
            Oops!
          </h2>
          <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            O Mata Mosquito não está disponível em dispositivos móveis.
            <br />
            Acesse pelo computador para jogar!
          </p>
        </div>
        {children}
      </body>
    </html>
  )
}
