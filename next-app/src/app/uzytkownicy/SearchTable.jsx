import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import UsersTable from './UsersTable'

export default function SearchTable({ users }) {
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState(users)

  useEffect(() => {
    setResults(users)
  }, [users])

  useEffect(() => {
    const search = inputValue.trim().toLowerCase()
    if (search === '') {
      setResults(users) // If input is empty, show all users
    } else {
      setResults(
        users.filter(({ imie, nazwisko }) => {
          const fullName = `${imie} ${nazwisko}`.toLowerCase()
          return fullName.includes(search)
        })
      )
    }
  }, [inputValue, users])

  return (
    <div className='pt-14 w-2/3'>
      <div className='w-1/4'>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          placeholder='Wyszukaj użytkownika'
        />
      </div>

      <div className='pt-4'>
        <UsersTable results={results} />
      </div>
    </div>
  )
}
