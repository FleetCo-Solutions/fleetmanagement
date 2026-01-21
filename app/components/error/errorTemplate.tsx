export default function ErrorTemplate({error}: {error: Error}) {
    return (
             <div className='mx-auto w-fit flex flex-col items-center gap-4 text-black'>
               <div className='w-56'>
                 <img src="/error1.png" alt="Error" className='w-fill h-fill object-cover'/>
                 </div>
               <h2 className='font-bold text-4xl'>Unexpected Error Occurred</h2>
               <p className='text-lg text-black/70'>We sincerely apologize for this happening. Working on making this rare as possible</p>
               <p className='text-md text-red-500 font-bold'>{error.message}</p>
               {/* <button 
                 onClick={() => setShowAddModal(true)}
                 className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors"
               >
                 Add User
               </button> */}
             </div>
    )
}