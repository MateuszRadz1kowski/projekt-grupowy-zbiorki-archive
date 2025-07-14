import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function FilterProblems({ filterProblems, sortProblems }) {
  const [filter, setFilter] = useState('Wszystkie')
  const [sort, setSort] = useState('desc')
  //przechowuje czy renderuje sie po raz pierwszy, jesli tak to nie sortuj ani nie filtruj
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    filterProblems(filter)
    updateSorting(sort)
  }, [filter])

  function updateSorting(sort) {
    setSort((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'))
    sortProblems(sort)
  }

  return (
    <div className='pt-14 w-2/3 flex flex-row justify-between items-center'>
      <Select value='filter' onValueChange={setFilter}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue>{filter}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Wszystkie'>Wszystkie</SelectItem>
          <SelectItem value='Wykonano'>Wykonano</SelectItem>
          <SelectItem value='Do zrobienia'>Do zrobienia</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => {
          updateSorting(sort)
        }}
      >
        {sort === 'desc' ? <ArrowDown /> : <ArrowUp />}Data utworzenia
      </Button>
    </div>
  )
}
