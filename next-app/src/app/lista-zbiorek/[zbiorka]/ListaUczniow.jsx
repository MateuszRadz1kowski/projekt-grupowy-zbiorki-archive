import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addNewWplata, deleteUserFromZbiorka, deleteUserFromZbiorkaFinal, editZbiorkaAktZebr, fetchWplaty, potwierdzWplate } from '../data-acces';
import { Button } from '@/components/ui/button';
import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert';
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ListaUczniow({ daneUczen,refetchUczniowie, daneZbiorka, daneUzytkownik, userInfo }) {
  const { data: daneWplaty, isLoading, isError } = useQuery({
    queryKey: ['wplaty'],
    queryFn: fetchWplaty,
  });

  const [paymentStatus, setPaymentStatus] = useState({});
  const [metodaPlatnosci, setMetodaPlatnosci] = useState(null);
  const [disabledUseState, setDisabledUseState] = useState(true);
  const [buttonToRegisterWplata, setButtonToRegisterWplata] = useState(false);

  const handleMetodaPlatnosci = (value) => {
    try {
      setMetodaPlatnosci(value);
      setDisabledUseState(false);
    } catch (error) {
      return <h1 className='text-destructive'>ERROR {error}</h1>

    }
  };

  useEffect(() => {
    try {
      if (userInfo?.user) {
        const userPaymentExists = daneWplaty?.some(
          (payment) => payment.id_ucznia === userInfo.user.id && payment.id_zbiorki === daneZbiorka.id
        );
        setButtonToRegisterWplata(!userPaymentExists);
      }
    } catch (error) {
      return <h1 className='text-destructive'>ERROR {error}</h1>
    }
  }, [userInfo, daneWplaty]);

  const handleConfirmPayment = (wplata) => {
    try {
      potwierdzWplate(wplata.id, metodaPlatnosci);
      const updatedValue = daneZbiorka.aktualnie_zebrano + daneZbiorka.cena_na_ucznia
      editZbiorkaAktZebr(daneZbiorka.id,updatedValue)
      setPaymentStatus((prevStatus) => ({
        ...prevStatus,
        [wplata.id]: true,
      }));
    } catch (error) {
      return <h1 className='text-destructive'>ERROR podczas potwierdzania wpłaty: {error}</h1>
    }
  };

  const deleteUserFromZbiorka = async (id) => {
      try {
        await deleteUserFromZbiorkaFinal(id)
        refetchUczniowie()
      } catch (error) {
        return <h1 className='text-destructive'>ERROR przy usuwaniu komentarza: {error}</h1>
      }
    }

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError) {
    return <h1 className='text-destructive'>ERROR {isError}</h1>
  }

  return (
    <div className="bg-background text-foreground p-6">
      <h1 className="text-3xl font-semibold text-primary mb-6">Uczniowie</h1>
      {daneUczen[0] != null ? (
        
        daneUczen?.map((tenUczen) => {
          if (tenUczen?.id_zbiorki === daneZbiorka?.id) {
            const user = daneUzytkownik?.find((u) => u.id === tenUczen.id_ucznia);
            const wplata = daneWplaty?.find(
              (payment) =>
                payment.id_ucznia === tenUczen.id_ucznia &&
                payment.id_zbiorki === daneZbiorka.id
            );

            const isCurrentUser = tenUczen.id_ucznia === userInfo?.user?.id;
            const borderColor = paymentStatus[wplata?.id] || wplata?.wplacono 
              ? 'border-green-500'
              : isCurrentUser
              ? 'border-yellow-500'
              : 'border-red-500';

            return (
              <Card key={tenUczen.id} className={`mb-6 bg-card rounded-lg shadow-md border-4-${borderColor}`}>
                <CardHeader className="bg-input text-ring-foreground p-4 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold">
                    {user ? `${user.imie} ${user.nazwisko}` : 'Nieznany Użytkownik'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
  {wplata ? (
    <div className="space-y-4">
      <p className="text-lg">
        Data Zapłaty: {new Date(wplata.data_utworzenia)
          .toISOString()
          .slice(0, 16)
          .replace('T', ' ')}
      </p>
      {paymentStatus[wplata.id] || wplata.wplacono ? (
        <p className="text-green-500">Status Płatności: Zapłacono</p>
      ) : userInfo?.user?.rola === 'admin' ? (
        <div className="space-y-4">
          <Select onValueChange={handleMetodaPlatnosci}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz metodę płatności" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gotowka">Gotówka</SelectItem>
              <SelectItem value="karta">Karta</SelectItem>
            </SelectContent>
          </Select>
          <ConfirmationAlert
            message="Czy na pewno chcesz potwierdzić tę płatność?"
            cancelText="Powrót"
            triggerElement={(
              <Button disabled={disabledUseState} className="w-full bg-secondary text-ring hover:bg-primary-500">
                Potwierdź zapłatę
              </Button>
            )}
            mutationFn={() => handleConfirmPayment(wplata)}
            toastError={{
              variant: 'destructive',
              title: 'Błąd',
              description: 'Nie udało się potwierdzić wpłaty.',
            }}
            toastSucces={{
              title: 'Sukces',
              description: 'Wpłata potwierdzona.',
            }}
          />
        </div>
      ) : (
        <p className="text-yellow-500">Status Płatności: Nie Potwierdzono Zapłaty</p>
      )}
    </div>
  ) : isCurrentUser ? (
    buttonToRegisterWplata ? (
      <ConfirmationAlert
        message="Czy na pewno chcesz zarejestrować wpłatę?"
        cancelText="Powrót"
        triggerElement={(
          <Button className="w-full bg-secondary text-ring hover:bg-primary-500">Zarejestruj zapłatę</Button>
        )}
        mutationFn={() => addNewWplata(daneZbiorka.id, userInfo.user.id, daneZbiorka.cena_na_ucznia)}
        toastError={{
          variant: 'destructive',
          title: 'Błąd',
          description: 'Nie udało się zarejestrować wpłaty.',
        }}
        toastSucces={{
          title: 'Sukces',
          description: 'Wpłata zarejestrowana.',
        }}
        onSuccesCustomFunc={() => setButtonToRegisterWplata(false)}
      />
    ) : (
      <p className="text-yellow-500">Status Płatności: Nie Potwierdzono Zapłaty</p>
    )
  ) : (
    <p className="text-red-500">Status Płatności: Nie zapłacono</p>
  )}
                       {(userInfo?.user?.rola === 'admin') && (
                        <ConfirmationAlert
                          message='Czy na pewno chcesz usunąć tego użytkownika?'
                          description={'Tej akcji nie da się cofnąć'}
                          cancelText='Powrót'
                          triggerElement={
                            <Button className='bg-destructive hover:bg-danger-600 text-white'>Usuń Użytkownika</Button>
                          }
                          mutationFn={() => console.log('')}
                          toastError={{
                            variant: 'destructive',
                            title: 'Błąd',
                            description: 'Nie udało się wykonać polecenia.',
                          }}
                          toastSucces={{
                            title: 'Użytkownik usunięty',
                            description: 'Użytkownik został pomyślnie usunięty.',
                          }}
                          onSuccesCustomFunc={() => deleteUserFromZbiorka(tenUczen.id)}
                        />
                      )}
</CardContent>

              </Card>
            );
          }
        })
      ) : (
        <h1 className="text-xl text-muted-foreground">Brak Uczniów w zbiórce</h1>
      )}
    </div>
  );
}
