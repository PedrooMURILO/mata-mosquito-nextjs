import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const username = sessionStorage.getItem('username')
    if (!username) router.push('/login')
  }, [])

  return {
    username: typeof window !== 'undefined' ? sessionStorage.getItem('username') : null,
  }
}
