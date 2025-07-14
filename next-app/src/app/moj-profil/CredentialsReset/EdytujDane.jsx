"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import ConfirmationAlert from "@/lib/basicComponents/ConfirmationAlert";
import InputWithLabel from "@/lib/basicComponents/InputWithLabel";
import PageTitle from "@/lib/basicComponents/PageTitle";
import { pocketbase } from "@/lib/pocketbase";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export default function EdytujDane() {
  const { user, logout } = useUser();
  const [newCredentials, setNewCredentials] = useState({
    imie: "",
    nazwisko: "",
  });

  useEffect(() => {
    if (user) {
      setDefaultCredentails();
    }
  }, [user]);

  function setDefaultCredentails() {
    setNewCredentials({
      imie: user.imie,
      nazwisko: user.nazwisko,
    });
  }

  const newCredentialsMutation = useMutation({
    mutationFn: async () => changeCredentails(user, newCredentials),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async () => {
      logout();
    },
  });

  return (
    <div className="w-2/3 flex flex-col gap-2 justify-start items-start ">
      <PageTitle title="Edytuj swoje dane" description="Edytuj swoje dane." />

      <div className="w-1/3 flex flex-col gap-4 mt-4">
        <InputWithLabel
          inputType="text"
          labelText="Imię"
          datafield="imie"
          inputValue={newCredentials}
          dataSetter={setNewCredentials}
        />
        <InputWithLabel
          inputType="text"
          labelText="Nazwisko"
          datafield="nazwisko"
          inputValue={newCredentials}
          dataSetter={setNewCredentials}
        />
      </div>
      <div className="w-1/3 flex justify-between items-center">
        <Button variant="outline" onClick={setDefaultCredentails}>
          Wyczyść zmiany
        </Button>
        {(newCredentials?.imie !== user?.imie ||
          newCredentials?.nazwisko !== user?.nazwisko) && (
          <ConfirmationAlert
            message={`Czy napewno chcesz zaktualizować swoje dane?`}
            description={"Spowoduje to wylogowanie z aplikacji."}
            cancelText={"Powrót"}
            triggerElement={<Button>Zaktualizuj dane</Button>}
            mutationFn={() => newCredentialsMutation.mutateAsync()}
            toastError={{
              variant: "destructive",
              title: "Nie udało się zaktualizować danych.",
              description: "Spróbuj ponownie później.",
            }}
            toastSucces={{
              title: `Pomyślnie zaktualizowano dane.`,
              description: "",
            }}
          />
        )}
      </div>
    </div>
  );
}
async function changeCredentails(user, newCredentials) {
  // console.log(newCredentials)

  try {
    const response = await pocketbase.collection("users").update(user.id, {
      imie: newCredentials.imie,
      nazwisko: newCredentials.nazwisko,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
