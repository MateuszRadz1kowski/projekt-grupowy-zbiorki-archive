import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { addNewKomentarz, deleteKomentarzFinal, fetchKomentarze, fetchUczen } from '../data-acces'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading'

export default function ListaKomentarzy({ daneZbiorka, daneUzytkownik, userInfo }) {
  const {
    data: daneKomentarz,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['komentarze'],
    queryFn: fetchKomentarze,
  })
  const { data: daneRelacje } = useQuery({
    queryKey: ['kluuczk'],
    queryFn: fetchUczen,
  })
  const [isCurrentUser, setIsCurrentUser] = useState(null)

  useEffect(() => {
    if (daneRelacje && daneZbiorka?.id && userInfo?.user?.id) {
      const isMatched = daneRelacje.some(
        (relacja) =>
          relacja.id_zbiorki === daneZbiorka.id &&
          relacja.id_ucznia === userInfo.user.id
      )
      setIsCurrentUser(isMatched)
    } else {
      setIsCurrentUser(false)
    }
  }, [daneRelacje, daneZbiorka?.id, userInfo?.user?.id])

  const [komentarzInputValue, setKomentarzInputValue] = useState('')

  const handleAddComment = (e) => {
    setKomentarzInputValue(e.target.value)
  }

  const addKomentarzFinalFunction = async () => {
    try {
      await addNewKomentarz(daneZbiorka.id, userInfo.user.id, komentarzInputValue)
      refetch()
      setKomentarzInputValue('')
    } catch (error) {
      return <h1 className='text-destructive'>ERROR przy dodawaniu komentarza: {error}</h1>
    }
  }

  const deleteKomentarz = async (komentarz) => {
    try {
      await deleteKomentarzFinal(komentarz.id)
      refetch()
    } catch (error) {
      return <h1 className='text-destructive'>ERROR przy usuwaniu komentarza: {error}</h1>
    }
  }

  if (isLoading) {
    return <SpinnerLoading />
  }

  if (error) {
    return <h1 className='text-destructive'>ERROR {error}</h1>
  }

  return (
    <div className='max-w-3xl mx-auto p-6 bg-background text-foreground'>
      <h1 className='text-4xl font-bold text-center text-primary mb-8'>Komentarze</h1>

      <div className='mb-6'>
        {isCurrentUser && daneZbiorka?.status && (
          <div className='p-6 bg-card rounded-lg shadow-lg border border-gray-300'>
            <h2 className='text-2xl font-semibold text-primary mb-4'>Dodaj Nowy Komentarz</h2>
            <div className='space-y-4'>
              <div>
              {console.log(isCurrentUser)}
                <Label htmlFor='komentarzInput' className='block text-lg'>
                  Twój Komentarz:
                </Label>
                <Input
                  type='text'
                  className='mt-2 w-full p-3 rounded-lg bg-input text-primary border border-gray-400 focus:ring-2 focus:ring-primary'
                  value={komentarzInputValue}
                  onChange={handleAddComment}
                  id='komentarzInput'
                />
              </div>
              <div className='text-right'>
                <ConfirmationAlert
                  message='Czy na pewno chcesz dodać ten komentarz?'
                  cancelText='Powrót'
                  triggerElement={
                    <Button className='bg-secondary hover:bg-primary-500 text-ring w-full sm:w-auto'>
                      Dodaj Komentarz
                    </Button>
                  }
                  mutationFn={() => console.log('')}
                  toastError={{
                    variant: 'destructive',
                    title: 'Błąd',
                    description: 'Nie udało się dodać komentarza.',
                  }}
                  toastSucces={{
                    title: 'Sukces',
                    description: 'Komentarz dodany pomyślnie.',
                  }}
                  onSuccesCustomFunc={addKomentarzFinalFunction}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {daneKomentarz && daneKomentarz.length > 0 ? (
          daneKomentarz.map((komentarz) => {
            if (komentarz && daneZbiorka && komentarz.id_zbiorki === daneZbiorka.id) {
              const user = daneUzytkownik?.find((user) => user.id === komentarz.id_autora)

              const borderColor = userInfo?.user?.id === komentarz.id_autora ? 'border-yellow-500' : 'border-gray-500'

              return (
                <div key={komentarz.id} className={`mb-6 p-6 border-l-4 ${borderColor} bg-card rounded-lg shadow-lg`}>
                  <div className='space-y-3'>
                    <div>
                      <h2 className='text-xl font-semibold text-primary'>
                        {user ? `${user.imie} ${user.nazwisko}` : 'Brak autora'}
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(komentarz.data_utworzenia).toISOString().slice(0, 16).replace('T', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className='text-lg text-primary mb-4'>{komentarz.tresc}</p>
                    </div>
                    {(userInfo?.user?.rola === 'admin' || user?.id === userInfo?.user?.id) && (
                      <ConfirmationAlert
                        message='Czy na pewno chcesz usunąć ten komentarz?'
                        description={'Tej akcji nie da się cofnąć'}
                        cancelText='Powrót'
                        triggerElement={
                          <Button className='bg-destructive hover:bg-danger-600 text-white'>Usuń Komentarz</Button>
                        }
                        mutationFn={() => console.log('')}
                        toastError={{
                          variant: 'destructive',
                          title: 'Błąd',
                          description: 'Nie udało się wykonać polecenia.',
                        }}
                        toastSucces={{
                          title: 'Komentarz usunięty',
                          description: 'Komentarz został pomyślnie usunięty.',
                        }}
                        onSuccesCustomFunc={() => deleteKomentarz(komentarz)}
                      />
                    )}
                  </div>
                </div>
              )
            }
          })
        ) : (
          <h2 className='text-center text-lg text-muted-foreground'>Brak komentarzy w tej zbiórce</h2>
        )}
      </div>
    </div>
  )
}