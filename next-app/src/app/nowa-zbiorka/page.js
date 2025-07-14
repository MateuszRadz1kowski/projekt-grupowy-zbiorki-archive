'use client'
import InputWithLabel from '@/lib/basicComponents/InputWithLabel'
import { useState, useCallback } from 'react'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { Plus } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { pocketbase } from '@/lib/pocketbase'
import PageTitle from '@/lib/basicComponents/PageTitle'
import TrybZbiorkiRadios from './TrybZbiorkiRadios'
import useAuth from '@/hooks/useAuth'

const INITIAL_STATE = {
  tytul: '',
  opis: '',
  cel: 0,
  tryb: 'prywatna',
  dataZakonczenia: '',
  cena_na_ucznia: 0,
}

export default function Page() {
  const { user } = useUser()
  // console.log(user?.rola)

  const { isAuthorized } = useAuth({ userRolesWithAccess: ['admin'] })

  const [nowaZbiorkaInput, setNowaZbiorkaInput] = useState(INITIAL_STATE)

  // zamiast tworzyc funckje od nowa po kazdym renderze, react ja zapamietuje, przez co radio group nie rerenderuje sie za kazdym razem
  const handleTrybChange = useCallback((value) => {
    setNowaZbiorkaInput((prevState) => ({
      ...prevState,
      tryb: value,
    }))
  }, [])

  const nowaZbiorkaMutation = useMutation({
    mutationFn: async () => insertNowaZbiorka(nowaZbiorkaInput, user),
    onError: (error) => {
      console.error('Failed to create collection:', error)
    },
    onSuccess: () => {
      setNowaZbiorkaInput(INITIAL_STATE)
    },
  })

  if (!isAuthorized) {
    return <h1>Brak dostępu do strony.</h1>
  }

  return (
    <div className='w-full flex flex-col justify-center items-center pt-14 pb-14'>
      <PageTitle title='Nowa Zbiórka' description='Wypełnij wymagane informacje aby rozpocząć nową zbiórkę.' />

      <div className='w-full flex flex-col justify-center items-center mt-8 gap-8'>
        <div className='w-1/3 flex flex-col gap-4'>
          <InputWithLabel
            inputType='text'
            labelText='Tytuł zbiórki'
            datafield='tytul'
            inputValue={nowaZbiorkaInput}
            dataSetter={setNowaZbiorkaInput}
          />
          <InputWithLabel
            inputType='textarea'
            labelText='Opis'
            datafield='opis'
            inputValue={nowaZbiorkaInput}
            dataSetter={setNowaZbiorkaInput}
          />
          <InputWithLabel
            inputType='number'
            labelText='Cel'
            datafield='cel'
            inputValue={nowaZbiorkaInput}
            dataSetter={setNowaZbiorkaInput}
          />
          <InputWithLabel
            inputType='number'
            labelText='cena na ucznia'
            datafield='cena_na_ucznia'
            inputValue={nowaZbiorkaInput}
            dataSetter={setNowaZbiorkaInput}
          />
          <Label className='text-sm font-medium'>Tryb Zbiórki</Label>
          <RadioGroup defaultValue={nowaZbiorkaInput.tryb} onValueChange={handleTrybChange}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='prywatna' id='prywatna' />
              <Label htmlFor='prywatna'>prywatna</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='publiczna' id='publiczna' />
              <Label htmlFor='publiczna'>publiczna</Label>
            </div>
          </RadioGroup>

          <InputWithLabel
            inputType='date'
            labelText='Data zakończenia'
            datafield='dataZakonczenia'
            inputValue={nowaZbiorkaInput}
            dataSetter={setNowaZbiorkaInput}
          />

          <div className='w-full mt-4 flex justify-end items-center'>
            <ConfirmationAlert
              message='Czy napewno chcesz utworzyć nową zbiórkę?'
              description=''
              cancelText='Powrót'
              triggerElement={
                <Button>
                  Dodaj zbiórke <Plus />
                </Button>
              }
              mutationFn={() => nowaZbiorkaMutation.mutateAsync()}
              toastError={{
                variant: 'destructive',
                title: 'Nie udało się utworzyć zbiórki.',
                description: 'Upewnij się, że wszystkie pola są wypełnione.',
              }}
              toastSucces={{
                title: 'Utworzono nową zbiórkę.',
                description: '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

async function insertNowaZbiorka(nowaZbiorkaInput, user) {
  if (!user?.id) throw new Error('User not authenticated')

  const pocketbaseZbiorka = {
    Tytul: nowaZbiorkaInput.tytul,
    opis: nowaZbiorkaInput.opis,
    cel: parseInt(nowaZbiorkaInput.cel),
    tryb: nowaZbiorkaInput.tryb,
    data_zakonczenia: nowaZbiorkaInput.dataZakonczenia,
    id_autora: user.id,
    status: true,
    cena_na_ucznia: nowaZbiorkaInput.cena_na_ucznia,
  }

  try {
    return await pocketbase.collection('Zbiorki').create(pocketbaseZbiorka)
  } catch (error) {
    console.error('Pocketbase error:', error)
    throw error
  }
}
