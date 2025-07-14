import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { UserRoundPen } from 'lucide-react'
import React from 'react'

export default function AdminButton({ user, uprawnieniaMutation, disabled }) {
  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz nadać uprawnienia administratora?'}
      description={'Administrator może zarządzać zbiórkami, użytkownikami, komentarzami i problemami.'}
      cancelText={'Powrót'}
      triggerElement={
        <Button className='w-full  flex flex-row justify-center' disabled={disabled}>
          Administrator
          <UserRoundPen />
        </Button>
      }
      mutationFn={() => uprawnieniaMutation.mutateAsync('admin')}
      toastError={{
        variant: 'destructive',
        title: 'Coś poszło nie tak.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: `${user.imie} ${user.nazwisko} otrzymał uprawnienia administratora.`,
      }}
    />
  )
}
