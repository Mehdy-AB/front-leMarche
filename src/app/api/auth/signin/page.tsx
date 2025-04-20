"use client"
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, LoginDto, loginSchema, phoneSchema, usernameSchema } from "@/app/lib/validation/all.schema";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SignupPage = () => {
  const {
     register,
     handleSubmit,
     setError,
     formState: { errors,isSubmitting },
   } = useForm<LoginDto>({resolver:zodResolver(loginSchema)})

  const route = useRouter();
  const [showPassword,setShowPassword]=useState(false);
  const onSubmit = async (data: LoginDto) => {
    const { identifier } = data

    const isEmail = emailSchema.safeParse(identifier).success
    const isPhone = phoneSchema.safeParse(identifier).success
    const isUsername = usernameSchema.safeParse(identifier).success
  
    let type: 'email' | 'phone' | 'username' = 'username' // default
  
    if (isEmail) type = 'email'
    else if (isPhone) type = 'phone'
    else if (isUsername) type = 'username'
    console.log(type)
    // axiosGhost.post('/auth/register/sendCode',data).then(res=>{
    //   if(res.data.error){
    //     setError('email', { message: res.data.message })
    //     return;
    //   }
    //   setEmail(data.email)
    //   setEtape(etape + 1)
    // }).catch(e=>{
    //   setError('email', { message: e.response.data.error || 'Email is invalide' })
    // })
    // await signIn("credentials", {
    //   username: data.credentials,
    //   password: data.password,
    //   redirect: true,
    //   callbackUrl: "/dashboard",
    // }).then((result) => {
    //   if (result?.error) console.error(result.error);
    // });
  }

  return (<>
    <section className=" flex bg-white w-full text-gray-600 h-screen justify-center items-center">
      <div className="flex flex-col w-[40rem] items-center">
      <h1 className="text-4xl font-semibold text-gray-700">Sign in account</h1>
      <h4 className="text-sm text-gray-500">Don't have an account? 
        <a className="underline cursor-pointer" onClick={()=>{route.push('/api/auth/signup')}}> SignUp</a>
      </h4>
        
      
      <div className="flex flex-col w-full">
      <div className="relative w-full h-[32rem] overflow-hidden" >
      <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full flex  flex-col gap-1"
          >
                  <form className="flex flex-col gap-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <span className="mt-10 font-semibold">Connect with 
                      <span className="text-sm font-sans"> ( Email, UserName, number )</span>
                    </span>
                    <input
                        type="text"
                        {...register("identifier")}
                        placeholder="Enter your email address"
                        className="rounded-lg border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
                      />
                      {errors.identifier && (
                        <span className="text-red-500 text-xs">
                          {errors.identifier.message}
                        </span>
                      )}
                      <span className="mt-2 font-semibold">Enter your password</span>
                      <div className=" relative w-full">
                      <input
                        type={showPassword?'text':"password"}
                        {...register("password")}
                        placeholder="Enter your password"
                        className="rounded-lg w-full border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
                      />
                      <button type="button" onClick={()=>setShowPassword(!showPassword)}  className={`absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointerrounded-e-md outline-hidden ${showPassword?'text-blue-600':'text-gray-400 '}`}>
                        <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                          <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      </div>
                      {errors.password && (
                        <span className="text-red-500 text-xs">
                          {errors.password.message}
                        </span>
                      )}
                      <span className="mt-1  text-xs underline cursor-pointer"  onClick={()=>{route.push('/api/auth/forget-password')}}>Mot de passe oublié</span>
                    <button type="submit" className="bg-orange-400 rounded-4xl py-3 rounded-full mt-6 font-semibold text-white">Sign in</button>
                  </form>
                  <div className="grid grid-cols-11 items-center mt-16">
                    <span className="w-full col-span-5 rounded bg-gray-200 h-[2px]"></span>
                    <span className="w-full col-span-1 text-center text-xl font-semibold">OR</span>
                    <span className="w-full col-span-5 rounded bg-gray-200 h-[2px]"></span>
                  </div>
                  <div className="grid gap-20 px-5 grid-cols-2">
                    <button
                    className="w-full flex items-center justify-center gap-x-3 py-2.5 border rou</div>nded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
                  >
                    <svg className="size-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4</div>536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z" fill="#4285F4"/>
                    <path d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 </button>26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z" fill="#34A853"/>
                    <path d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z" fill="#FBBC05"/>
                    <path d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z" fill="#EB4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
                  >
                    <svg className="size-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)"/>
                    <path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white"/>
                    <defs>
                    <linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#18ACFE"/>
                    <stop offset="1" stopColor="#0163E0"/>
                    </linearGradient>
                    </defs>
                    </svg>
                    Continue with Facebook
                  </button>
                  </div>
          </motion.div>
        </AnimatePresence>

        
      </div>  
      
      </div>
      </div>
      </section>
    </>
  );
};

export default SignupPage;
