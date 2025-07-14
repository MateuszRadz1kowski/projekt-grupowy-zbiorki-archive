import React from 'react'

export default function PageTitle({ title, description }) {
  return (
    <div className='w-2/3'>
      <div className='flex flex-row justify-start items-center'>
        <h1 className='text-4xl'>{title}</h1>
      </div>
      <div className='mt-4 text-muted-foreground'>
        <p>{description}</p>
      </div>
    </div>
  )
}
