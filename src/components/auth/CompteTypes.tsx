
export const CompteTypes=({etape,setEtape,setCompteType}:{
  etape:number,
  setEtape:React.Dispatch<React.SetStateAction<number>>
  setCompteType:React.Dispatch<React.SetStateAction<"INDIVIDUAL"|"PROFESSIONAL">>
})=>{

    return(<>
    <span className=" mt-10 text-center mb-2 text-lg font-semibold">Choisissez votre type de compte</span>
        <div className="grid gap-20 px-5 grid-cols-2">
          <button onClick={()=>{setCompteType('INDIVIDUAL');setEtape(etape+1)}}
          className="w-full grid grid-cols-5 items-center px-6 gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-300"
        >
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 col-span-1">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col text-start col-span-4">
            <span className="font-bold">INDIVIDUAL</span>
            <span className="text-xs">une petite description pour cet type</span>
          </div>
          
        </button>
        <button onClick={()=>{setCompteType('PROFESSIONAL');setEtape(etape+1)}}
          className="w-full grid grid-cols-6 items-center px-6 gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-300"
        >
          <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            className="size-5" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" >
          <g>
            <rect x="14" y="36" fill="#231F20" width="4" height="10"/>
            <path fill="currentColor" d="M52,47c0,0.553-0.447,1-1,1h-6c-0.553,0-1-0.447-1-1v-5H20v5c0,0.553-0.447,1-1,1h-6c-0.553,0-1-0.447-1-1
              v-5H0v18c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V42H52V47z"/>
            <rect x="46" y="36" fill="#231F20" width="4" height="10"/>
            <path fill="currentColor" d="M60,13H48V4c0-2.211-1.789-4-4-4H20c-2.211,0-4,1.789-4,4v9H4c-2.211,0-4,1.789-4,4v23h12v-5
              c0-0.553,0.447-1,1-1h6c0.553,0,1,0.447,1,1v5h24v-5c0-0.553,0.447-1,1-1h6c0.553,0,1,0.447,1,1v5h12V17C64,14.789,62.211,13,60,13
              z M42,13H22V6h20V13z"/>
          </g>
          </svg>
          
          <div className="flex flex-col text-start col-span-4">
            <span className="font-bold">PROFESSIONAL</span>
            <span className="text-xs">une petite description pour cet type</span>
          </div>
        </button>
        </div>
        </>);
}