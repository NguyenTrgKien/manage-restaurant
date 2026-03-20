import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Loading({isLoading}) {
    if (!isLoading) return null;
    return (  
        // <div className="fixed flex justify-center items-center inset-0 perspective-distant bg-[#000000] z-[999]">
        //     <div className="relative w-[8rem] h-[8rem] transform-3d rotateInfinite ">
        //         <div className="absolute bg-[#fff] translate-z-[4rem] flex justify-center items-center w-[8rem] h-[8rem]">
        //             <span className="absolute w-[1.5rem] h-[1.5rem] rounded-full bg-[red]"></span>
        //         </div>
        //         <div className="absolute bg-[#fff] translate-x-[4rem] rotate-y-[90deg] flex justify-center items-center w-[8rem] h-[8rem]">
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //         </div>
        //         <div className="absolute bg-[#fff] translate-z-[-4rem] flex justify-center items-center w-[8rem] h-[8rem]">
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //         </div>
        //         <div className="absolute bg-[#fff] translate-x-[-4rem] rotate-y-[90deg] flex flex-col justify-center items-center gap-[1rem] w-[8rem] h-[8rem]">
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //         </div>
        //         <div className="absolute bg-[#fff] translate-y-[-4rem] rotate-x-[90deg] flex flex-col justify-center items-center gap-[.5rem] w-[8rem] h-[8rem]">
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //             <div className="flex">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //             <div className="flex justify-center items-center gap-[1rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //         </div>
        //         <div className="absolute bg-[#fff] translate-y-[4rem] rotate-x-[90deg] flex flex-col justify-center items-center gap-[.5rem] w-[8rem] h-[8rem]">
        //             <div className="flex justify-center items-center gap-[2rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //             <div className="flex justify-center items-center gap-[2rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //             <div className="flex justify-center items-center gap-[2rem]">
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //                 <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff0000]"></span>
        //             </div>
        //         </div>
                
        //     </div>
        // </div>
        // <div className={`fixed ${isLoading ? "block" : "hidden"} inset-0 flex justify-center items-center bg-[#ffffff] z-[999] `}>
        //     <div className="relative w-[8rem] h-[8rem]">
        //         {
        //             [1,2,3,4,5,6,7,8,9,10].map((item) => {
        //                 return (
        //                     <div key={item} className={`absolute w-full h-full`} style={{rotate: `${36 * item}deg`}}>
        //                         <span className="absolute w-[2rem] h-[2rem] bg-amber-600 rounded-full loadingCircle opacity-0"
        //                             style={{
        //                                 animationDelay: `${item * 0.2}s`
        //                             }}
        //                         ></span>
        //                     </div>
        //                 )
        //             })
        //         }
        //     </div>
        // </div>
        // <div className="fixed inset-0 flex justify-center items-center bg-[#ffffff] z-[999] ">
        //     <div className="relative w-[8rem] h-[8rem] flex justify-center gap-[3rem] items-center">
        //         {
        //             [1,2,3,4,5].map((item) => {
        //                 return (
        //                     <div key={item} className={` w-full h-full`}>
        //                         <span className="absolute w-[2rem] h-[2rem] bg-green-700 rounded-full loadingCircle"
        //                             style={{
        //                                 animationDelay: `${item * 0.1}s`
        //                             }}
        //                         ></span>
        //                     </div>
        //                 )
        //             })
        //         } 
        //     </div>
        // </div>
        
        <div className="fixed inset-0 flex justify-center items-center bg-[#00000080] z-[1000]">
            <div className="bg-white p-[2rem] rounded-[1rem] shadow-lg flex items-center gap-[1.5rem] animate-fadeIn">
                <FontAwesomeIcon 
                    icon={faSpinner} 
                    className="text-blue-500 text-[2.5rem] animate-spin" 
                />
                <span className="text-[1.8rem] text-gray-700">Đang lấy dữ liệu...</span>
            </div>
        </div>
    );
}

export default Loading;
