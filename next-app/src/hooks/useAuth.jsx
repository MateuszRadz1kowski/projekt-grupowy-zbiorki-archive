import { useUser } from './useUser'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from './use-toast'

export default function useAuth({ userRolesWithAccess }) {
  const { user, logout } = useUser()
  const router = useRouter()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // console.log(user)
        // Reset auth state when checking
        setIsAuthorized(false)

        // Wait for user data to load
        if (user === undefined) {
          return
        }

        // If user exists and has a role, check permissions
        if (user && user.rola) {
          const hasAccess = userRolesWithAccess.includes(user.rola)

          if (!hasAccess) {
            toast({ title: 'Nie masz dostępu do tej strony', variant: 'destructive' })
            await logout()

            setIsLoading(false)

            return
          }

          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // If we get here, user is either null or missing role
        setIsLoading(false)
        setIsAuthorized(false)

        // Only show toast if user is definitely not logged in
        if (user === null) {
          toast({ title: 'Nie masz dostępu do tej strony', variant: 'destructive' })
          await logout()
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthorized(false)
        setIsLoading(false)
        toast({
          title: 'Wystąpił błąd podczas sprawdzania uprawnień',
          variant: 'destructive',
        })
      }
    }

    checkAuth()
  }, [user])

  return { isAuthorized, isLoading }
}
