'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { fetchZbiorki } from './data-acces'
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading'

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['zbiorki'],
    queryFn: fetchZbiorki,
  })

  if (isLoading) return <SpinnerLoading />
  if (error) return <h1 className='text-destructive'>ERROR</h1>

  const publiczneZbiorki = data?.filter((zbiorka) => zbiorka?.tryb === 'publiczna')

  return (
    <div className='bg-background text-foreground p-6 min-h-screen'>
      <h1 className='text-3xl font-bold text-primary mb-6'>Lista Zbiórek</h1>
      {publiczneZbiorki && publiczneZbiorki.length > 0 ? (
        publiczneZbiorki.map((zbiorka) => (
          <Link key={zbiorka.id} href={`lista-zbiorek/${zbiorka.Tytul}`}>
            <div
              className={`border-2 rounded-lg mb-6 transition-all ${
                zbiorka.status === false
                  ? 'border-destructive hover:border-destructive/70'
                  : 'border-muted hover:border-primary'
              }`}
            >
              <Card className='bg-card hover:bg-card-hover transition-all rounded-lg'>
                <CardHeader className='bg-input text-primary-foreground rounded-t-lg p-4'>
                  <CardTitle className='text-2xl font-semibold text-destructive-foreground'>{zbiorka.Tytul}</CardTitle>
                  <CardDescription className='text-destructive-foreground text-sm'>
                    {new Date(zbiorka.data_utworzenia).toISOString().slice(0, 16).replace('T', ' ')}
                  </CardDescription>
                  {/* {zbiorka.status === false && (
                    <h1 className='text-white border-destructive border-2  text-lg font-semibold p-2 rounded-md mt-2'>
                      Zbiórka jest zakończona
                    </h1>
                  )} */}
                </CardHeader>
                <CardContent className='p-4'>
                  <Progress value={(zbiorka.aktualnie_zebrano / zbiorka.cel) * 100} />
                </CardContent>
              </Card>
            </div>
          </Link>
        ))
      ) : (
        <h2 className='text-xl text-muted-foreground'>Brak Zbiórek możliwych do wyświetlenia</h2>
      )}
    </div>
  )
}
