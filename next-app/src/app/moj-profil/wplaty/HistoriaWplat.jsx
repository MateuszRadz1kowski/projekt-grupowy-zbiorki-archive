import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Wplata from './Wplata'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { renderContent } from '@/lib/utils'
import { pocketbase } from '@/lib/pocketbase'

export default function HistoriaWplat() {
  const {
    data: wplaty,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listaWplat'],
    queryFn: () => getWplaty(),
  })

  return renderContent({
    isLoading,
    loadingMess: null,
    isError,
    errorMess: null,
    data: wplaty,
    renderData: (wplaty) => (
      <div className='flex flex-col w-2/3'>
        <h1 className='text-2xl'>Historia wpłat</h1>
        <Table>
          <TableCaption className='mb-8'>Lista dokonanych wpłat.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tytuł zbiórki</TableHead>
              <TableHead>Wpłata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wplaty?.map((wplata) => (
              <Wplata key={wplata.id} wplata={wplata} />
            ))}
          </TableBody>
        </Table>
      </div>
    ),
  })
}
export async function getWplaty() {
  try {
    const records = await pocketbase.collection('wplaty').getFullList({
      sort: '-data_utworzenia',
    })
    return records
  } catch (error) {
    throw new Error(error)
  }
}
