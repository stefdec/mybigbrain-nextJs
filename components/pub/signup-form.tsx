'use client'
 
import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/actions/auth'
 
export function SignupForm() {
  const [state, action] = useFormState(signup, undefined)
 
  return (
    <form action={action}>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input id="firstName" name="firstName" placeholder="First Name" />
      </div>
      {state?.errors?.firstName && <p className='text-red-700'>{state.errors.firstName}</p>}

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" placeholder="Last Name" />
      </div>
      {state?.errors?.lastName && <p className='text-red-700'>{state.errors.lastName}</p>}
 
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p className='text-red-700'>{state.errors.email}</p>}
 
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div className='text-red-700'>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <SubmitButton />
    </form>
  )
}
 
function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button disabled={pending} type="submit">
      Sign Up
    </button>
  )
}