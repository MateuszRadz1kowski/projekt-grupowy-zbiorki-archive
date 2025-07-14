'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { pocketbase } from '@/lib/pocketbase'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

export default function ResetHaslo() {
  const { user, logout } = useUser()

  const passwordResetMutation = useMutation({
    mutationFn: async () => await resetHaslo(user),
    onError: (error) => {
      // console.log(error);
    },
    onSuccess: () => {
      // console.log("suces");
      logout()
    },
  })
  return (
    <div className='w-2/3 flex flex-col gap-2 justify-start items-start '>
      <PageTitle
        title='Hasło'
        description={`Częsta zmiana hasła jest zalecana, jeśli zależy ci na bezpieczeństwie swojego konta.`}
      />
      <div className='mt-2'>
        <ConfirmationAlert
          message={`Czy napewno chcesz zmienić swoje hasło?`}
          description={`Wyślemy link do zmiany hasła na twój email: ${user?.email}. Zmiana hasła wymaga ponownego zalogowania.`}
          cancelText={'Powrót'}
          triggerElement={<Button>Zresetuj swoje hasło</Button>}
          mutationFn={async () => await passwordResetMutation.mutateAsync()}
          toastError={{
            variant: 'destructive',
            title: 'Nie udało się wykonać polecenia.',
            description: 'Spróbuj ponownie później.',
          }}
          toastSucces={{
            title: `Sprawdź swoją skrzynkę email, aby zresetować hasło.`,
            description: '',
          }}
        />
      </div>
    </div>
  )
}
async function resetHaslo(user) {
  console.log(user.email)
  try {
    await pocketbase.collection('users').requestPasswordReset(user.email)
  } catch (error) {
    throw new Error(error)
  }
}
