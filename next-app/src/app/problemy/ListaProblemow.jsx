import Problem from './Problem'

export default function ListaProblemow({ problems, isRefetching }) {
  return (
    <div className='w-2/3 flex flex-col justify-center items-center mt-8 gap-8'>
      {problems?.length === 0 ? (
        <h1>Brak problemów.</h1>
      ) : (
        problems?.map((problem) => <Problem key={problem.id} problem={problem} isRefetching={isRefetching} />)
      )}
    </div>
  )
}
