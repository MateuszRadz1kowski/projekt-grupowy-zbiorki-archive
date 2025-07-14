'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import FilterProblems from './FilterProblems'
import PageTitle from '@/lib/basicComponents/PageTitle'
import { renderContent } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { pocketbase } from '@/lib/pocketbase'
import useAuth from '@/hooks/useAuth'
import ListaProblemow from './ListaProblemow'

export default function page() {
  const { user, logout } = useUser()
  const { isAuthorized } = useAuth({ userRolesWithAccess: ['admin', 'uczen'] })
  const [problems, setProblems] = useState([])
  const {
    data: problemsList,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
  } = useQuery({
    queryKey: ['problemList'],
    queryFn: async () => await getProblems(user),
    enabled: isAuthorized,
  })

  useEffect(() => {
    if (isSuccess) {
      setProblems(problemsList)
    }
  }, [isSuccess, problemsList])

  function filterProblems(filter) {
    setProblems(() => {
      if (filter === 'Wszystkie') {
        return problemsList
      } else if (filter === 'Wykonano') {
        return problemsList.filter((problem) => problem.wykonano === true)
      } else if (filter === 'Do zrobienia') {
        return problemsList.filter((problem) => problem.wykonano === false)
      } else {
        throw new Error('Nieprawidłowy filtr')
      }
    })
  }
  function sortProblems(sort) {
    setProblems((prevProblems) => {
      return [...prevProblems].sort((a, b) => {
        if (sort === 'desc') {
          return new Date(a.data_utworzenia) - new Date(b.data_utworzenia) // Ascending
        } else {
          return new Date(b.data_utworzenia) - new Date(a.data_utworzenia) // Descending
        }
      })
    })
  }
  if (!isAuthorized) {
    return <h1>Brak dostępu do strony.</h1>
  }
  return renderContent({
    isLoading,
    isError,
    errorMess: 'Wystąpił błąd podczas pobierania problemów.',
    data: { problems, filterProblems, sortProblems },
    renderData: ({ problems, filterProblems, sortProblems }) => (
      <div className='w-full flex flex-col justify-center items-center pt-14 pb-14'>
        {user?.rola === 'admin' ? (
          <PageTitle
            title='Problemy'
            description='Zarządzaj i rozwiązuj zgłoszone przez użytkowników problemy dotyczące zbiórek.'
          />
        ) : (
          <PageTitle title='Moje problemy' description='Przeglądaj swoje zgłoszone problemy.' />
        )}
        <FilterProblems filterProblems={filterProblems} sortProblems={sortProblems} />
        <ListaProblemow problems={problems} isRefetching={isRefetching} />
      </div>
    ),
  })
}
async function getProblems(user) {
  if (user === null) {
    throw new Error('Brak danych o użytkowniku, spróbuj zalogować się ponownie')
  }

  pocketbase.autoCancellation(false)

  try {
    let problemsList
    if (user?.rola === 'admin') {
      problemsList = await pocketbase.collection('problemy').getFullList({
        sort: '-data_utworzenia',
      })
    } else if (user?.rola === 'uczen') {
      problemsList = await pocketbase.collection('problemy').getFullList({
        sort: '-data_utworzenia',
        filter: pocketbase.filter(`id_ucznia ~ {:id_usera}`, {
          id_usera: user.id,
        }),
      })
    }

    // Use Promise.all to handle async operations for each problem
    const problemsWithDetails = await Promise.all(
      problemsList.map(async (problem) => {
        const zbiorkaProblemu = await pocketbase.collection('Zbiorki').getOne(problem.id_zbiorki)

        problem.tytulZbiorki = zbiorkaProblemu.Tytul

        const uczenProblemu = await pocketbase.collection('users').getOne(problem.id_ucznia)

        problem.imieUcznia = uczenProblemu.imie
        problem.nazwiskoUcznia = uczenProblemu.nazwisko

        return problem
      })
    )

    pocketbase.autoCancellation(true)

    return problemsWithDetails
  } catch (error) {
    console.log(error)

    throw new Error(error)
  }
}
