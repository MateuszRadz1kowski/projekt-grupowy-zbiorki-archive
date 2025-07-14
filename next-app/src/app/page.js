'use client'
import useAuth from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { pocketbase } from '@/lib/pocketbase'
import { renderContent } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  // console.log(pocketbase);
  const { user } = useUser()

  const {
    data: adminList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['adminList'],
    queryFn: () => getAdminList(),
    initialData: [],
    enabled: user !== 'admin',
  })

  // console.log(adminList);
  return renderContent({
    isLoading,
    isError,
    errorMess: 'Wystąpił błąd przy wyświetlaniu administatorów.',
    data: { user, adminList },
    renderData: ({ user, adminList }) => (
      <div className='w-full h-[100vh] flex flex-col justify-start items-center pt-14'>
        <div className='w-2/3'>
          <h1 className='text-4xl'>{user !== null ? `Witamy, ${user?.imie} ${user?.nazwisko}.` : 'Witamy.'}</h1>
          <p className='mt-4 text-muted-foreground'>Użyj panelu po lewej stronie do nawigacji.</p>
          <div>
            <p className='mt-4 text-muted-foreground'>
              {user?.rola === 'admin' &&
                'Aktualnie posiadasz uprawnienia administratora, ktore pozwalają ci zarządzać zbiórkami i użytkownikami.'}

              {user?.rola === 'uczen' &&
                'Aktualnie posiadasz uprawnienia ucznia, pozwala ci to jedynie na interakcje ze zbiórkami.'}

              {user?.rola === 'obserwator' &&
                'Aktualnie posiadasz uprawnienia obserwatora, pozwala ci to jedynie wyświetlanie informacji.'}

              {user === null && 'Zachęcamy do zalogowania się, aby wpełni korzystać z aplikacji.'}
            </p>
            {user?.rola !== 'admin' && (
              <div>
                <p className='mt-4 text-muted-foreground'>Skontaktuj się z administratorami aby poznać szczegóły.</p>
                <ul className='mt-2 text-muted-foreground'>
                  {adminList?.map((admin) => {
                    return (
                      <li key={admin.id}>
                        - {admin.imie} {admin.nazwisko}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
  })
}
async function getAdminList() {
  try {
    const record = await pocketbase.collection('users').getFullList({
      sort: 'created',
      filter: pocketbase.filter(`rola ~ {:rola}`, {
        rola: 'admin',
      }),
    })
    return record
  } catch (error) {
    throw new Error(error)
  }
}
