import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { pocketbase } from '@/lib/pocketbase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'

export default function UsunUsera({ user }) {
  const queryClient = useQueryClient()

  const usunUseraMutation = useMutation({
    mutationFn: () => usunUzytkownika(user),
    onSuccess: () => {
      console.log('mutacja')
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return (
    <ConfirmationAlert
      message={`Czy napewno chcesz usunąć użytkownika ${user.imie} ${user.nazwisko}?`}
      description={
        'UWAGA! Usunięcie użytkownika spowoduje usunięcie jego wszystkich dokonań (komentarzy, zbiórek, wpłat, problemów). Tej akcji nie można cofnąć, użytkownik straci dostęp do aplikacji.'
      }
      cancelText={'Powrót'}
      triggerElement={
        <Button variant='destructive'>
          Usuń <Trash />
        </Button>
      }
      mutationFn={() => usunUseraMutation.mutateAsync()}
      toastError={{
        variant: 'destructive',
        title: 'Nie udało się wykonać polecenia.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: `${user.imie} ${user.nazwisko} został usunięty`,
        description: '',
      }}
      onSuccesCustomFunc={() => queryClient.invalidateQueries({ queryKey: ['listOfUsers'] })}
    />
  )
}
async function usunUzytkownika(user) {
  try {
    console.log(user.id)
    await pocketbase.collection('users').delete(user.id)
  } catch (error) {
    throw new Error(error)
  }
}
