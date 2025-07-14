import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import AdminButton from './AdminButton'
import UczenButton from './UczenButton'
import ObserwatorButton from './ObserwatorButton'
import { pocketbase } from '@/lib/pocketbase'

export default function ZmienUprawnienia({ user }) {
  const queryClient = useQueryClient()

  const uprawnieniaMutation = useMutation({
    mutationFn: async (naKogo) => {
      console.log(naKogo)

      switch (naKogo) {
        case 'admin':
          await zmienUprawnienia(user, 'admin')
          break
        case 'uczen':
          await zmienUprawnienia(user, 'uczen')
          break
        case 'obserwator':
          await zmienUprawnienia(user, 'obserwator')
          break
      }
    },
    onSuccess: async () => {
      console.log('mutacjasuccecs')
      await queryClient.invalidateQueries({ queryKey: ['listOfUsers'] })
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return (
    <div className='flex flex-row gap-2'>
      <AdminButton user={user} uprawnieniaMutation={uprawnieniaMutation} disabled={user.rola === 'admin'} />
      <UczenButton user={user} uprawnieniaMutation={uprawnieniaMutation} disabled={user.rola === 'uczen'} />
      <ObserwatorButton user={user} uprawnieniaMutation={uprawnieniaMutation} disabled={user.rola === 'obserwator'} />
    </div>
  )
}
async function zmienUprawnienia(user, naKogo) {
  try {
    // console.log(pocketbase.collection('users'))

    const record = await pocketbase.collection('users').update(user.id, { ...user, rola: naKogo })
  } catch (error) {
    throw new Error(error)
  }
}
