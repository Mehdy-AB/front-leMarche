
export const OtpForm=()=>{

    return(<>
    <div id="otp-form" className="flex flex-col w-full items-center justify-center gap-2">
          <span className="text-xs mt-10">Saisissez le code reçu à l’adresse e‑mail </span>
          <div className="flex gap-2">
            {[0, 1, 2, 3,4,5].map((_, idx) => (
          <input
            type="text"
            maxLength={1}
            inputMode="numeric"
            className="shadow-xs flex w-[44px] focus:border-orange-200 items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
          />))}
          </div>
          <span className="text-xs underline cursor-pointer hover:text-orange-400">Resend code</span>
        </div>
        </>);
}