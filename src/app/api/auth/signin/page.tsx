"use client"
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



type FormInput = {
  usernameOrEmail: string;
  password: string;
  loginMod:'email'|'phone'|'username'
};

const SigninPage = () => {
    const{data: session} = useSession();
    const router = useRouter();
  const [formData, setFormData] = useState<FormInput>({
    usernameOrEmail: "",
    password: "",
    loginMod:'username'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      username: formData.usernameOrEmail,
      password: formData.password,
      loginMod:formData.loginMod,
      callbackUrl: '/',
      redirect: false,
    });

    if (!result?.ok) {
      alert(result?.error || 'Sign in failed');
    }
  };
if(!session || !session?.user){
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="md:h-screen">
          <a href="/" type="button" className="mt-10 ml-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg className="w-20 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
            <span className="sr-only">Icon description</span>
          </a>
          <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto lg:py-0">
            <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
              Sheel DZ
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={login}>
                  <div className="flex justify-between">
                    <div className="flex items-center mb-4">
                      <input type="radio" id="username" name="loginMod" value="username" checked={formData.loginMod === 'username'} onChange={() => setFormData({...formData,loginMod:'username'})} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="username" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Username</label>
                    </div>
                    <div className="flex items-center mb-4">
                      <input type="radio" id="email" name="loginMod" value="email" checked={formData.loginMod === 'email'} onChange={() => setFormData({...formData,loginMod:'email'})} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="email" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>
                    </div>
                    <div className="flex items-center mb-4">
                      <input type="radio" id="phone" name="loginMod" value="phone" checked={formData.loginMod === 'phone'} onChange={() => setFormData({...formData,loginMod:'phone'})} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="phone" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone</label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="usernameOrEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username or Email</label>
                    <input type={`${formData.loginMod==='email'?'email':'text'}`} name="usernameOrEmail" id="usernameOrEmail" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="exp: jefry" required onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleChange} />
                  </div>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">LOG IN</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account? <a href="/api/auth/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up here</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );}
else{
    router.push("/dashboard");
}
}

export default SigninPage;
