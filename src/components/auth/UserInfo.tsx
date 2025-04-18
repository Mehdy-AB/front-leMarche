
export const UserInfo=()=>{

    return(<>
    <span className="text-sm text-center mt-10 mb-5 ">compte information</span>
        <div className="grid text-xs grid-cols-2 gap-x-4 gap-y-2">
        <label className="font-bold text-gray-500">FullName</label>
        <label className="font-bold text-gray-500">UserName</label>
        <input type="text" name="fname" placeholder="Enter your fullName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <input type="text" name="lname" placeholder="Enter your userName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <label className="font-bold col-span-2 text-gray-500">Phone</label>
        <input type="number" min={0} maxLength={9} name="lname" spellCheck prefix="+33" placeholder="234-234-245" className=" col-span-2 rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <label className="font-bold text-gray-500">Password</label>
        <label className="font-bold text-gray-500">Confirmation Password</label>
        <input type="text" name="fname" placeholder="Enter your Password" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <input type="text" name="lname" placeholder="Repete your Password" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <span className="text-tiny text-gray-500 col-span-2">Use 8 or more characters with a mix of letters, numbers & symbols</span>
        <div className="flex gap-1">
          <input id="showPassword" name="showPassword" type="checkbox"/>
          <label htmlFor="showPassword" className=" text-xs font-semibold text-tiny text-gray-500">Agree our 
            <a className="underline cursor-pointer hover:text-blue-500"> rules and condition</a></label>
        </div>
        </div>
        </>);
}