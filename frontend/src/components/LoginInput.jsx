import React from 'react'

const LoginInput = React.forwardRef(function LoginInput({
  type,htmlFor,Label,name,value,handleChange,...props},ref) {
  return (
    <div className='flex flex-col w-80 gap-2'>
    <label htmlFor={htmlFor} className='font-semibold text-sm'>{Label}</label>
    <input 
    placeholder={Label} 
    type={type} 
     name={name}
    id={htmlFor} 
    ref={ref}
    {...props}
    className='bg-transparent border-2 rounded-sm font-semibold  text-sm px-2 py-3 border-neutral-700'/>
    </div>
  )
})

export default LoginInput