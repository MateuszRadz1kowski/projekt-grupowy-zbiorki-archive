import ConfirmationAlert from '@/lib/basicComponents/ConfirmationAlert'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Button } from '@/components/ui/button'
import { pocketbase } from '@/lib/pocketbase'

export default function UsunProblem({ problem }) {
  const queryClient = useQueryClient()

  const usunProblemMutation = useMutation({
    mutationFn: async () => usunProblem(problem.id),
    onSuccess: async () => {
      // console.log('succes')
      await queryClient.invalidateQueries({ queryKey: ['problemList'] })
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return (
    <ConfirmationAlert
      message={'Czy napewno chcesz usunąć problem?'}
      description={'Tej operacji nie można cofnąć.'}
      cancelText={'Powrót'}
      triggerElement={<Button variant='destructive'>Usuń problem</Button>}
      mutationFn={() => usunProblemMutation.mutateAsync()}
      toastError={{
        variant: 'destructive',
        title: 'Nie udało się usunąć problemu.',
        description: 'Spróbuj ponownie później.',
      }}
      toastSucces={{
        title: `Usunięto problem.`,
        description: '',
      }}
    />
  )
}
async function usunProblem(problemId) {
  try {
    const record = await pocketbase.collection('problemy').delete(problemId)
  } catch (error) {
    throw new Error(error)
  }
}
