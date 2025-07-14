'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/hooks/useUser'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import InputWithLabel from '@/lib/basicComponents/InputWithLabel'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { pocketbase } from '@/lib/pocketbase'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'

export default function ResetEmail() {
  const [newEmail, setNewEmail] = useState('')
  const { user, logout } = useUser()

  const emailChange = useMutation({
    mutationFn: async () => await zmienEmail(newEmail),
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      // console.log("suces");
      logout()
    },
  })

  return (
    <div className='w-2/3 flex flex-col gap-2 justify-start items-start '>
      <PageTitle title='Email' description={`Zmień swój aktualny adres email (${user?.email})`} />
      <div className='w-1/3 flex flex-col gap-4 mt-4'>
        <Label htmlFor='email'>Nowy Email</Label>
        <Input id='email' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
      </div>
      <div className='mt-2'>
        <ConfirmationAlert
          message={`Czy napewno chcesz zmienić swój adres email?`}
          description={`Wyślemy link do zmiany adresu email na twój aktualny adres: ${newEmail}. Zmiana adresu email wymaga ponownego zalogowania.`}
          cancelText={'Powrót'}
          triggerElement={<Button>Zmień email</Button>}
          mutationFn={async () => await emailChange.mutateAsync()}
          toastError={{
            variant: 'destructive',
            title: 'Nie udało się wykonać polecenia.',
            description: 'Spróbuj ponownie później.',
          }}
          toastSucces={{
            title: `Potwierdź zmianę adresu email.`,
            description: '',
          }}
        />
      </div>
    </div>
  )
}
async function zmienEmail(newEmail) {
  console.log(newEmail)

  try {
    await await pocketbase.collection('users').requestEmailChange(newEmail)
  } catch (error) {
    throw new Error(error)
  }
}
