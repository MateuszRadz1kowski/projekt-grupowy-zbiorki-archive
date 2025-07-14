import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/ui/table'
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading'
import { pocketbase } from '@/lib/pocketbase'

export default function Wplata({ wplata }) {
  const {
    data: zbiorkaWplaty,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tytulZbiorki', `${wplata.id_zbiorki}`],
    queryFn: () => getTitleFromWplata(wplata.id_zbiorki),

    refetchOnWindowFocus: false, // Disable refetching when window is refocused
  })

  return (
    <>
      <TableRow>
        <TableCell className='text-xl'>
          {isLoading ? <SpinnerLoading /> : isError ? 'Błąd' : wplata !== null && formatDate(wplata.data_utworzenia)}
        </TableCell>
        <TableCell className='text-xl'>
          {isLoading ? <SpinnerLoading /> : isError ? 'Błąd' : zbiorkaWplaty !== undefined && zbiorkaWplaty[0].Tytul}
        </TableCell>
        <TableCell className='text-xl'>{isError ? 'Błąd' : wplata !== null && `${wplata.kwota} PLN`} </TableCell>
      </TableRow>
    </>
  )
}
export async function getTitleFromWplata(idZbiorki) {
  // console.log(idZbiorki);

  try {
    const records = await pocketbase.collection('Zbiorki').getFullList({
      filter: pocketbase.filter(`id ~ {:idZbiorki}`, {
        idZbiorki: idZbiorki,
      }),
    })

    // console.log(records);

    return records
  } catch (error) {
    throw new Error(error)
  }
}
