import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addUczenToZbiorkaFinal, fetchUczen, fetchUsers } from "../data-acces";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationAlert from "@/lib/basicComponents/ConfirmationAlert";
import SpinnerLoading from "@/lib/basicComponents/SpinnerLoading";

export default function DodajUczniaLista({ daneZbiorka, onStudentAdded }) {
  const queryClient = useQueryClient();
  const [usersNotInZbiorka, setUsersNotInZbiorka] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingAddStudent, setIsLoadingAddStudent] = useState(false);

  const { data: users, refetch, isLoading: isLoadingUsers, error: errorUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: relacjeZbiorka, isLoading: isLoadingRelacje, error: errorRelacje } = useQuery({
    queryKey: ["uzytkownicyRelacje"],
    queryFn: fetchUczen,
  });

  useEffect(() => {
    if (!users || !relacjeZbiorka || !daneZbiorka) return;

    try {
      const allUsersIds = users.map((user) => user.id);

      const allIdInZbiorka = relacjeZbiorka
        .filter((item) => item.id_zbiorki === daneZbiorka.id)
        .map((item) => item.id_ucznia);

      const allUsersNotInZbiorka = allUsersIds.filter(
        (id) => !allIdInZbiorka.includes(id)
      );

      const filteredUsers = users.filter((user) =>
        allUsersNotInZbiorka.includes(user.id)
      );

      const finalUsers = filteredUsers.filter((user) => user.rola === "uczen");

      setUsersNotInZbiorka(finalUsers);
    } catch (error) {
      console.error("Error filtering users:", error);
    }
  }, [users, relacjeZbiorka, daneZbiorka]);

  if (isLoadingUsers || isLoadingRelacje) {
    return <SpinnerLoading />;
  }

  if (errorRelacje || errorUsers) {
    return <h1 className="text-destructive">ERROR</h1>;
  }

  const handleSelect = (user) => {
    setSelectedUser(user);
    console.log("User selected:", user);
  };

  const handleAddStudent = async () => {
    if (selectedUser && daneZbiorka) {
      try {
        setIsLoadingAddStudent(true);
        await addUczenToZbiorkaFinal(daneZbiorka.id, selectedUser.id);

        onStudentAdded();
        setOpen(false);
        setSelectedUser(null);
        await queryClient.invalidateQueries("uzytkownicyRelacje");
        await refetch();
      } catch (error) {
        console.error("Error adding student:", error);
      } finally {
        setIsLoadingAddStudent(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between py-2 px-4 rounded-md text-primary bg-background border border-gray-300 hover:bg-secondary-100 focus:ring-2 focus:ring-primary"
          >
            {selectedUser
              ? `${selectedUser.imie} ${selectedUser.nazwisko}`
              : "Wybierz Ucznia"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 bg-white border rounded-lg shadow-md">
          <Command>
            <CommandInput
              placeholder="Wyszukaj ucznia..."
              className="p-2 border-b border-gray-300"
            />
            <CommandList>
              <CommandEmpty>Nie znaleziono ucznia</CommandEmpty>
              <CommandGroup>
                {usersNotInZbiorka?.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.imie}`}
                    onSelect={() => handleSelect(user)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {`${user.imie} ${user.nazwisko}`}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ConfirmationAlert
        message="Czy na pewno chcesz dodać tego ucznia do zbiórki?"
        description="Tej akcji nie da się cofnąć"
        cancelText="Powrót"
        triggerElement={
          <Button
            className="bg-secondary hover:bg-secondary-600 text-white py-2 px-4 rounded-md"
            disabled={isLoadingAddStudent || !selectedUser}
          >
            {isLoadingAddStudent ? <SpinnerLoading /> : "Dodaj Ucznia"}
          </Button>
        }
        mutationFn={() => console.log("")}
        toastError={{
          variant: "destructive",
          title: "Nie udało się wykonać polecenia.",
          description: "Spróbuj ponownie później.",
        }}
        toastSucces={{
          title: "Uczeń został dodany do zbiórki",
          description: "",
        }}
        onSuccesCustomFunc={handleAddStudent}
      />
    </div>
  );
}
