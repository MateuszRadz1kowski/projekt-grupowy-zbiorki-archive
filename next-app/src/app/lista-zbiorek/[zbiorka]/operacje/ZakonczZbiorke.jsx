import { Button } from '@/components/ui/button'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import React from 'react'

export default function ZakonczZbiorke({ mutation }) {
  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz zakończyć zbiórkę?'}
      description={'Tej akcji nie da się cofnąć'}
      cancelText={'Powrót'}
      triggerElement={
        <Button className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
          Zakończ zbiórke
        </Button>
      }
      mutationFn={() => mutation.mutate('zakonczZbiorke')}
      toastError={{
        variant: 'destructive',
        title: 'Nie udało się wykonać polecenia.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: 'Zbiórka została zakończona',
        description: '',
      }}
    />
  )
}
