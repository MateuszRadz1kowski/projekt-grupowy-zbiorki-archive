import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useUser } from '@/hooks/useUser'
import ZmienUprawnienia from './uprawnienia/ZmienUprawnienia'
import UsunUsera from './UsunUsera'

export default function UsersTable({ results }) {
  const { user } = useUser()
  return (
    <Table>
      <TableCaption>Lista wszystkich zalogowanych użytkowników.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className=''>Imię</TableHead>
          <TableHead>Nazwisko</TableHead>
          <TableHead>Uprawnienia</TableHead>

          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results?.map((result) => {
          if (result.id === user?.id) {
            return null
          }
          return (
            <TableRow key={result.id}>
              <TableCell className='text-xl'>{result.imie}</TableCell>
              <TableCell className='text-xl'>{result.nazwisko}</TableCell>
              <TableCell className='text-xl'>{result.rola}</TableCell>
              <TableCell className='text-xl flex flex-row'>
                <ZmienUprawnienia user={result} />
              </TableCell>
              <TableCell className='text-xl'>
                <UsunUsera user={result} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
