'use client';

import React from 'react';
import { fetchUczen, fetchZbiorki } from './date-acces';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Page() {
  const userInfo = useUser();
  const { data: dataZbiorki } = useQuery({
    queryKey: ['mojeZbiorki'],
    queryFn: fetchZbiorki,
  });

  const { data: dataUzytkownik } = useQuery({
    queryKey: ['mzUsers'],
    queryFn: fetchUczen,
  });

  const userId = userInfo?.user?.id;

  const filteredZbiorki = dataZbiorki?.filter((zbiorka) => {
    return dataUzytkownik?.some(uzytkownik => uzytkownik?.id_ucznia === userId && uzytkownik?.id_zbiorki === zbiorka?.id);
  });

  let zbiorkiToDisplay = [];

  if (userInfo?.user?.rola === "uczen") {
    zbiorkiToDisplay = filteredZbiorki;
  } else if (userInfo?.user?.rola === "admin") {
    zbiorkiToDisplay = dataZbiorki?.filter(zbiorka => zbiorka?.id_autora === userId);
  }

  return (
    <div className="bg-background text-foreground p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">MOJE ZBIÓRKI</h1>
      {zbiorkiToDisplay?.length > 0 ? (
        zbiorkiToDisplay.map((zbiorka) => (
          <Link key={`${zbiorka.id}-${zbiorka.Tytul}`} href={`lista-zbiorek/${zbiorka.Tytul}`}>
             <div
              className={`border-2 rounded-lg mb-6 transition-all ${
                zbiorka.status === false
                  ? 'border-destructive hover:border-destructive/70'
                  : 'border-muted hover:border-primary'
              }`}
            >
              <Card className="bg-card hover:bg-card-hover transition-all rounded-lg">
                <CardHeader className="bg-input text-primary-foreground rounded-t-lg p-4">
                  <CardTitle className="text-2xl font-semibold text-destructive-foreground">{zbiorka.Tytul}</CardTitle>
                  <CardDescription className="text-destructive-foreground text-sm">{new Date(zbiorka.data_utworzenia)
                            .toISOString()
                            .slice(0, 16)
                            .replace('T', ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Progress
                    value={(zbiorka.aktualnie_zebrano / zbiorka.cel) * 100}
                  />
                </CardContent>
              </Card>
            </div>
          </Link>
        ))
      ) : (
        <h2 className="text-xl text-muted-foreground">Brak zbiórek do których należysz</h2>
      )}
    </div>
  );
}
