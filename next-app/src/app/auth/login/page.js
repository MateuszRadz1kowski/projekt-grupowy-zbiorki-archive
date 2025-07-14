'use client'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { pocketbase } from '@/lib/pocketbase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import InputWithLabel from '@/lib/basicComponents/InputWithLabel'
import SpinnerLoading from '@/lib/basicComponents/SpinnerLoading'
import { toast } from '@/hooks/use-toast'

export default function page() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    pocketbase.authStore?.isValid && router.push('/lista-zbiorek')
  }, [])

  const loginMutation = useMutation({
    mutationFn: async () => {
      await login(loginData)
    },
    onError: (error) => {
      // console.log('Error occurred:', error)
      toast({ title: 'Wystąpił błąd', variant: 'destructive' })
    },
    onSuccess: () => {
      // console.log('mutation worked')
      router.push('/')
    },
  })

  if (loginMutation.isPending) {
    return (
      <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center'>
        <SpinnerLoading />
      </div>
    )
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-4 w-1/5'>
        <div className='flex justify-center items-center'>
          <h1 className='text-3xl'>Zaloguj się</h1>
        </div>
        <div className='flex flex-col gap-4'>
          <InputWithLabel
            inputType={'text'}
            labelText={'Email'}
            datafield={'email'}
            inputValue={loginData}
            dataSetter={setLoginData}
          />
        </div>
        <div className='flex flex-col gap-4 '>
          <InputWithLabel
            inputType={'password'}
            labelText={'Hasło'}
            datafield={'password'}
            inputValue={loginData}
            dataSetter={setLoginData}
          />
          <Link href={'/auth/password-reset'} className='underline'>
            Nie pamiętam hasła
          </Link>
        </div>
        <div className='flex flex-col'>
          <div className='flex justify-center items-center flex-row'>
            {loginMutation.isError && <p className='text-destructive'>Wystąpił błąd podczas logowania.</p>}
          </div>
          <div className='w-full mt-4 flex justify-end items-end'>
            <Button
              onClick={async () => {
                await loginMutation.mutateAsync()
              }}
            >
              Zaloguj się
            </Button>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center '>
          <h2>Nie posiadasz konta?</h2>
          <Link href={'/auth/register'}>
            <h1 className='underline'>Zarejetruj się.</h1>
          </Link>
          <Link href={'/'}>
            <h1 className='underline'>Kontynuuj bez konta.</h1>
          </Link>
        </div>
      </div>
    </div>
  )
}
export async function login(loginData) {
  try {
    const authData = await pocketbase.collection('users').authWithPassword(loginData.email, loginData.password)
  } catch (error) {
    throw new Error(error)
  }
}
