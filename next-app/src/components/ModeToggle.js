'use client'
import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant='outline'
      size=''
      onClick={() => {
        theme == 'dark' ? setTheme('light') : setTheme('dark')
      }}
    >
      {theme == 'dark' ? (
        <div className=' flex flex-row gap-2 items-center'>
          <Moon className='h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <p>Ciemny Motyw</p>
        </div>
      ) : (
        <div className=' flex flex-row gap-2 items-center'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <p>Jasny Motyw</p>
        </div>
      )}

      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
