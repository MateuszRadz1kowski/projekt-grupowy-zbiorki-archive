'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SearchTable from './SearchTable'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { renderContent } from '@/lib/utils'
import { pocketbase } from '@/lib/pocketbase'
import useAuth from '@/hooks/useAuth'

export default function page() {
  const { isAuthorized } = useAuth({ userRolesWithAccess: ['admin'] })

  const {
    data: users,
    isLoading: usersLoading,
    isError,
  } = useQuery({
    queryKey: ['listOfUsers'],
    queryFn: () => getUsers(),
    enabled: isAuthorized,
  })

  return renderContent({
    isLoading: usersLoading,
    isError,
    data: users,
    renderData: (users) => (
      <div className='w-full h-[100vh] flex flex-col justify-start items-center pt-14'>
        <PageTitle title='Użytkownicy' description='Użyj tabeli poniżej aby zarządzaj uprawnieniami użytkowników.' />
        <SearchTable users={users} />
      </div>
    ),
  })
}
async function getUsers() {
  try {
    const records = await pocketbase.collection('users').getFullList({
      sort: '-created',
    })
    return records
  } catch (error) {
    throw new Error(error)
  }
}
