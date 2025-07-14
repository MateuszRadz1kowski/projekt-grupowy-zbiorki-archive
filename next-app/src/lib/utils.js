import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import SpinnerLoading from './basicComponents/SpinnerLoading'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
// formatuje date do formatu dd.mm.yyyy
export function formatDate(dateString) {
  const date = new Date(dateString)

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}.${month}.${year}`
}
// renderuje podana zawartosc, zawartosc uzywa parametrow specyfikowanych w funkcji,
// wyswietla odpowiedni stan danych: ladowanie, error, stan finalny, upraszcza komponenty pobierajace dane, ktore wymagaja wystwielenia loadingu i erroru (czyli wiekszosc)

// prosty przyklad uzycia i syntaxu:
// return renderContent({
//   isLoading, (z react query)
//   isError, (z react query)
//   data: users, (dane, uzywane w jsx)
// (parametry w tym callbacku i obiekt 'data' musza byc identyczne, jsx uzywa jedynie podanych parametrow)
//   renderData: (users) => (
//     <div className='w-full h-[100vh] flex flex-col justify-start items-center pt-14'>
//       <PageTitle title='Użytkownicy' description='Użyj tabeli poniżej aby zarządzaj uprawnieniami użytkowników.' />
//       <SearchTable users={users} />
//     </div>
//   ),
// })
export function renderContent({ isLoading, loadingMess, isError, errorMess, data, renderData }) {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        <SpinnerLoading />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        <h1>{errorMess !== null && errorMess}</h1>
      </div>
    )
  }

  if (data) {
    return renderData(data)
  }
}
