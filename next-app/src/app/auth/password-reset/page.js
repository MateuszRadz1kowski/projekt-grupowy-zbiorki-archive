'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { pocketbase } from '@/lib/pocketbase'
import { Label } from '@radix-ui/react-label'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function page() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const passwordResetMutation = useMutation({
    mutationFn: async () => await resetHaslo(email),
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      router.push('/auth/login')
      // console.log("suces");
    },
  })

  return (
    <div className='w-full h-[100vh] flex flex-col justify-center items-center pt-14 gap-10'>
      <div className='w-1/5'>
        <PageTitle title='Zresetuj hasło' description='' />
      </div>
      <div className='flex flex-col gap-4 w-1/5'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' value={email} onChange={(e) => setEmail(e.target.value)} />

        <ConfirmationAlert
          message={`Czy napewno chcesz zmienić swoje hasło?`}
          description={`Wyślemy link do zmiany hasła na twój email: ${email}. Zmiana hasła wymaga ponownego zalogowania.`}
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
async function resetHaslo(email) {
  try {
    await pocketbase.collection('users').requestPasswordReset(email)
  } catch (error) {
    throw new Error(error)
  }
}
