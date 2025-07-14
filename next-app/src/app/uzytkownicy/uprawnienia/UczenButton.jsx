import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { UserRoundPen } from 'lucide-react'
import React from 'react'

export default function UczenButton({ user, uprawnieniaMutation, disabled }) {
  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz nadać uprawnienia ucznia?'}
      description={'Uczeń może przeglądać zbiórki oraz uczestniczyć w nich, dodawać komentarze i zgłaszać problemy.'}
      cancelText={'Powrót'}
      triggerElement={
        <Button variant={'secondary'} className='w-full  flex flex-row justify-center' disabled={disabled}>
          Uczeń <UserRoundPen />
        </Button>
      }
      mutationFn={() => uprawnieniaMutation.mutateAsync('uczen')}
      toastError={{
        variant: 'destructive',
        title: 'Coś poszło nie tak.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: `${user.imie} ${user.nazwisko} otrzymał uprawnienia ucznia.`,
      }}
    />
  )
}
