import React from 'react'
import {RegisterForm} from '@components/auth/register-form'



const RegsiterPage = async() => {

  return (
    <main className='flex flex-col items-center justify-items-center p-10 w-screen'>
      <RegisterForm />
    </main>
  )
}

export default RegsiterPage