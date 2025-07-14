'use client'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchUczen, fetchUsers, fetchZbiorkaByTitle, zakonczZbiorkeFinal } from '../data-acces'
import { useUser } from '@/hooks/useUser'
import ListaUczniow from './ListaUczniow'
import ListaKomentarzy from './ListaKomentarzy'
import ActionButtons from './ActionButtons'
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

export default function Page({ params }) {
  const zbiorkaParamsBeforeDecode = React.use(params)
  const zbiorkaParamsDecoded =  decodeURIComponent(zbiorkaParamsBeforeDecode.zbiorka)
  const userInfo = useUser()
 
  const { data: daneZbiorka, isLoading: isLoadingZbiorka, error: errorZbiorka, refetch: refetchEdycja } = useQuery({
    queryKey: ['zbiorka', zbiorkaParamsDecoded],
    queryFn: () => fetchZbiorkaByTitle(zbiorkaParamsDecoded),
  });

  const { data: daneUczen, isLoading: isLoadingUczniowie, error: errorUczniowie, refetch: refetchUczniowie } = useQuery({
    queryKey: ['uczniowie'],
    queryFn: fetchUczen,
  });

  const { data: daneUzytkownik, isLoading: isLoadingUzytkownik, error: errorUzytkownik } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const zakonczZbiorke = async () => {
    try {
      await zakonczZbiorkeFinal(daneZbiorka.id, daneZbiorka.Tytul);
      refetchEdycja();
    } catch (error) {
      return <h1 className='text-destructive'>ERROR: przy zakończeniu zbiórki</h1>
    }
  };

  const przypomnijZbiorka = async () => {
  };

  const dodajUcznia = async () => {
  };

  const mutationFn = async (action) => {
    switch (action) {
      case 'zakonczZbiorke':
        return zakonczZbiorke();
      case 'przypomnijZbiorka':
        return przypomnijZbiorka();
      case 'dodajUcznia':
        return dodajUcznia();
      default:
        return <h1 className='text-destructive'>ERROR</h1>
    }
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
    },
    onError: (error) => {
      return <h1 className='text-destructive'>ERROR {error}</h1>
    },
  });

  if (isLoadingZbiorka || isLoadingUczniowie || isLoadingUzytkownik) {
    return <SpinnerLoading />;
  }

  if (errorZbiorka || errorUczniowie || errorUzytkownik) {
    return <h1 className='text-destructive'>ERROR podczas pobierania danych</h1>
  }

  return (
    <div className="bg-background text-foreground p-6 min-h-screen">
      {daneZbiorka ? (
        <Card className="mb-6 bg-card rounded-lg shadow-md">
          <CardHeader className="bg-input text-primary-foreground p-4 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold text-primary">{daneZbiorka?.Tytul}</CardTitle>
            <CardDescription className="text-primary text-sm">Data Utworzenia: {new Date(daneZbiorka?.data_utworzenia)
          .toISOString()
          .slice(0, 16)
          .replace('T', ' ')}</CardDescription>
            <CardDescription className="text-primary text-sm">Data Zakończenia: {new Date(daneZbiorka?.data_zakonczenia)
          .toISOString()
          .slice(0, 16)
          .replace('T', ' ')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <h1 className="text-xl font-medium text-muted-foreground">{daneZbiorka?.opis}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  <span className="font-semibold">Cena na ucznia:</span> {daneZbiorka?.cena_na_ucznia} PLN
                </p>
                <p className="text-lg text-muted-foreground">
                  <span className="font-semibold">Cel:</span> {daneZbiorka?.cel} PLN
                </p>
                <p className="text-lg text-muted-foreground">
                  <span className="font-semibold">Tryb:</span> {daneZbiorka?.tryb}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  <span className="font-semibold">Akutalnie zebrano:</span> {((daneZbiorka.aktualnie_zebrano / daneZbiorka.cel) * 100).toFixed(2)}%
                </p>
                <div className="mt-2">
                  <Progress value={(daneZbiorka.aktualnie_zebrano / daneZbiorka.cel) * 100} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <h1 className="text-xl text-muted-foreground">Nie ma danych o zbiórce</h1>
      )}

      <ActionButtons mutation={mutation} userInfo={userInfo} daneZbiorka={daneZbiorka} refetchEdycja={refetchEdycja} />

      <ListaUczniow daneUczen={daneUczen} refetchUczniowie={refetchUczniowie} daneZbiorka={daneZbiorka} daneUzytkownik={daneUzytkownik} userInfo={userInfo} />

      <ListaKomentarzy daneZbiorka={daneZbiorka} daneUzytkownik={daneUzytkownik} userInfo={userInfo} />
    </div>
  )
}
