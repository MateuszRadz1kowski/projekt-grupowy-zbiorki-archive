import { pocketbase } from "@/lib/pocketbase";

export const fetchZbiorki = async () => {
  return await pocketbase.collection("Zbiorki").getFullList();
};

export const fetchUczen = async () => {
    return await pocketbase.collection("uczniowe").getFullList();
  };
  
  