import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { UserRoundPen } from 'lucide-react'
import React from 'react'

export default function ObserwatorButton({ user, uprawnieniaMutation, disabled }) {
  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz nadać uprawnienia obserwatora?'}
      description={'Obserwator może jedynie przeglądać zbiórki.'}
      cancelText={'Powrót'}
      triggerElement={
        <Button variant={'outline'} className='w-full  flex flex-row justify-center' disabled={disabled}>
          Obserwator
          <UserRoundPen />
        </Button>
      }
      mutationFn={() => uprawnieniaMutation.mutateAsync('obserwator')}
      toastError={{
        variant: 'destructive',
        title: 'Coś poszło nie tak.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: `${user.imie} ${user.nazwisko} otrzymał uprawnienia obserwatora.`,
      }}
    />
  )
}
