import React from 'react'
import {RegisterForm} from '@components/auth/register-form'
import {Providers} from '@components/pub/providers'




const RegsiterPage = async() => {

  return (
    <main className='flex flex-col items-center justify-items-center p-24 w-screen'>
      <RegisterForm />
    </main>
  )
}

export default RegsiterPage