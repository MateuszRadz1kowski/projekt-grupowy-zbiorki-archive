import { pocketbase } from "@/lib/pocketbase";

export const fetchZbiorki = async () => {
  return await pocketbase.collection("Zbiorki").getFullList({});
};

export const fetchZbiorkaByTitle = async (title) => {
  return await pocketbase.collection("Zbiorki").getFirstListItem(
    `Tytul="${title}"`,
    { expand: "relField1,relField2.subRelField" }
  );
};

export const fetchUczen = async () => {
  return await pocketbase.collection("uczniowe").getFullList({ sort: "-id" });
};

export const fetchKomentarze = async () => {
  return await pocketbase.collection("komentarze").getFullList({ sort: "-tresc" });
};

export const fetchWplaty = async () => {
  return await pocketbase.collection("wplaty").getFullList({ sort: "-id" });
};

export const fetchUsers = async () => {
  return await pocketbase.collection("users").getFullList({ sort: "-id" });
};

export async function zakonczZbiorkeFinal(zbiorkaID) {
  try {
    const data = { status: false };
    await pocketbase.collection("Zbiorki").update(zbiorkaID, data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function editZbiorkaFinal(zbiorkaID,editData) {
   try {
    const data = {
      Tytul: editData.tytul,
      opis: editData.opis,
      cel: editData.cel,
      tryb: [
          editData.typZbiorki
      ],
      cena_na_ucznia: editData.cena_na_ucznia,
  };
  
    await pocketbase.collection('Zbiorki').update(zbiorkaID, data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function addUczenToZbiorkaFinal(zbiorkaId,uczenId) {
  try {
    const data = {
      id_ucznia: uczenId,
      id_zbiorki: zbiorkaId
  };
  
  await pocketbase.collection('uczniowe').create(data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function addNewProblem(zbiorkaId,uczenId,trescProblemu) {
  try {
    const data = {
      tresc: trescProblemu,
      id_zbiorki: zbiorkaId,
      id_ucznia: uczenId,
      wykonano: false
  };
  await pocketbase.collection('problemy').create(data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function addNewKomentarz(zbiorkaId,autorId,trescKomentarza) {
  try {
    const data = {
      tresc: trescKomentarza,
      id_zbiorki: zbiorkaId,
      id_autora: autorId,
      };
  await pocketbase.collection('komentarze').create(data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteKomentarzFinal(komentarzId) {
  try {
  await pocketbase.collection('komentarze').delete(komentarzId)
  } catch (error) {
    throw new Error(error);
  }
}

export async function potwierdzWplate(wplatyId,typPlatnosci) {
  try {
   const data = {
    wplacono: true,
    typ_platnosci: typPlatnosci
 };
   await pocketbase.collection('wplaty').update(wplatyId,data);
 } catch (error) {
   throw new Error(error);
 }
}

export async function addNewWplata(zbiorkaId, autorId, zbiorkaKwota) {
  try {
    const data = {
      wplacono: false,
      id_zbiorki: zbiorkaId,
      id_ucznia: autorId,
      kwota: zbiorkaKwota,
    };
    await pocketbase.collection('wplaty').create(data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function editZbiorkaAktZebr(zbiorkaID,zebranoUpdated) {
  try {
    const data = { aktualnie_zebrano: zebranoUpdated };
    await pocketbase.collection('Zbiorki').update(zbiorkaID, data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteUserFromZbiorkaFinal(userId) {
  try {
  await pocketbase.collection('uczniowe').delete(userId)
  } catch (error) {
    throw new Error(error);
  }
}