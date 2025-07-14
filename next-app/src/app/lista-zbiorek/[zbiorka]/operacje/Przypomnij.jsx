import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import React from 'react'

export default function Przypomnij({ mutation }) {
  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz wysłać powiadomienie o zbiórce?'}
      cancelText={'Powrót'}
      triggerElement={
        <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          Przypomnij o zbiórce
        </Button>
      }
      mutationFn={() => mutation.mutate('przypomnijZbiorka')}
      toastError={{
        variant: 'destructive',
        title: 'Nie udało się wykonać polecenia.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: 'Przypomnienie zostało wysłane',
        description: '',
      }}
    />
  )
}
