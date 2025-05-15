'use client'

import { useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OtpSchema, otpSchema } from '@/lib/validation/all.schema'
import axiosGhost from '@/lib/req/axiosGhost'
import { Loader } from 'lucide-react'

export const OtpForm = ({
  etape,
  setEtape,
  email,
  setToken
}: {
  etape: number
  email:string
  setToken:React.Dispatch<React.SetStateAction<string>>
  setEtape: React.Dispatch<React.SetStateAction<number>>
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors,isSubmitting },
  } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: new Array(6).fill(''),
      email:email
    },
  })

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return
    const otpArray = getValues('otp')
    otpArray[idx] = value
    setValue('otp', otpArray, { shouldValidate: true })

    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const otpArray = getValues('otp')
    if (e.key === 'Backspace' && !otpArray[idx] && idx > 0) {
      otpArray[idx - 1] = ''
      setValue('otp', otpArray, { shouldValidate: true })
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return

    const otpArray = pasted.slice(0, 6).split('')
    for (let i = 0; i < otpArray.length; i++) {
      setValue(`otp.${i}` as const, otpArray[i], { shouldValidate: true })
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = otpArray[i]
      }
    }

    const nextIdx = Math.min(otpArray.length, 5)
    inputRefs.current[nextIdx]?.focus()
  }

  const onSubmit = (data: OtpSchema) => {
    axiosGhost.post('/auth/register/emailToken',data).then(res=>{
      if(res.data.error){
        setError('otp', { message: res.data.message })
        return;
      }
      console.log(res.data)
      setToken(res.data.token)
      setEtape(etape + 1)
    }).catch(e=>{
      setError('otp', { message: e.response.data.error || 'code is invalide' })
    })

  }

  useEffect(()=>{
    if(errors.email)
      setEtape(0)
  },[errors.email])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
      <div id="otp-form" className="flex flex-col w-full items-center gap-2">
        <span className="mt-10 text-lg font-semibold">
          Saisissez le code reçu à l’adresse e‑mail
        </span>
        <div className="flex gap-2">
          {[...Array(6)].map((_, idx) => (
            <Controller
              key={idx}
              name={`otp.${idx}` as const}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  ref={(el) => {(inputRefs.current[idx] = el)}}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  className="shadow-xs flex w-[44px] focus:border-orange-200 items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
                />
              )}
            />
          ))}
        </div>
        {errors.otp && (
          <span className="text-xs text-red-500 mt-1">{errors.otp.message}</span>
        )}

        <span className="text-xs underline cursor-pointer hover:text-orange-400">
          Resend code
        </span>
      </div>
      <button disabled={isSubmitting} type="submit" className="bg-orange-400 w-full disabled:bg-gray-200 rounded-4xl py-3 rounded-full mt-6 font-semibold text-white">
      {isSubmitting?
      <Loader/>
      :'Next'}
      </button>
    </form>
  )
}
