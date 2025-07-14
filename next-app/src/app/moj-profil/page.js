'use client'
import HistoriaWplat from './wplaty/HistoriaWplat'
import EdytujDane from './CredentialsReset/EdytujDane'
import ResetHaslo from './CredentialsReset/ResetHaslo'
import ResetEmail from './CredentialsReset/ResetEmail'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { useUser } from '@/hooks/useUser'
import useAuth from '@/hooks/useAuth'

export default function Page() {
  const { user } = useUser()
  const { isAuthorized } = useAuth({ userRolesWithAccess: ['admin', 'uczen', 'obserwator'] })
  if (!isAuthorized) {
    return <h1>Brak dostępu do strony.</h1>
  }
  return (
    <div className='w-full h-[100vh] flex flex-col justify-start items-center pt-14 gap-10'>
      <PageTitle title='Ustawienia' description='Znajdziesz tutaj wszystkie dostępne ustawienia.' />

      <div className='w-full flex gap-4 justify-center items-center'>
        <EdytujDane />
      </div>
      <ResetHaslo />
      <ResetEmail />
      {user?.rola === 'uczen' && <HistoriaWplat />}
    </div>
  )
}
