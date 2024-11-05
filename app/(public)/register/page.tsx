import React from 'react'
import {RegisterForm} from '@components/pub/signup-form'
import {Providers} from '@components/pub/providers'




const page = async() => {

  return (
    <main className='flex flex-col items-center justify-items-center p-24 w-screen'>
      <RegisterForm />
      <Providers />
    </main>
  )
}

export default page