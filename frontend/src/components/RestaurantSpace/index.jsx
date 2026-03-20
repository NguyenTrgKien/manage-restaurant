import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnLeft from '../BtnTurnPage/BtnLeft';
import BtnRight from '../BtnTurnPage/BtnRight';


function RestaurantSpace() {
    return (  
        <div className='px-[8rem] py-[4rem] mb-[4rem]'>
            <div className="text-[4rem] text-center font-bold text-primary-bold">
                Không Gian Độc Đáo - Nơi Hội Tụ Cảm Hứng Ẩm Thực
            </div>
            <p className="w-[80rem] text-center mx-auto mt-[1rem]">
                Khám phá không gian sang trọng và ấm cúng tại DeliFood. Chúng tôi mang đến những khu vực ăn uống đa dạng, từ phòng VIP riêng tư đến không gian mở với tầm nhìn tuyệt đẹp
            </p>


            <div className='relative w-full h-[32rem] mt-[4rem]'>
                <BtnLeft left={'-4rem'}/>
                <div className='w-full h-full grid auto-cols-[calc((100%-4rem)/3)] grid-flow-col gap-[2rem] items-center overflow-x-scroll overflow-y-hidden removeScrollbar scrollSnapType px-[2rem]'>
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>
                    
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>
                    
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>
                    
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>
                    
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>
                    
                    <div className='relative group w-full h-[29rem] rounded-[1rem] transition-transform duration-300 hover:scale-[1.03] hv-linear transform origin-center scrollSnapItem'>
                        <div className='w-full h-full'>    
                            <img src="https://img.freepik.com/photos-premium/interieur-du-restaurant-confortable-design-contemporain-style-loft-salle-manger-moderne-comptoir-bar-espace-copie_116547-5926.jpg" alt="" className='w-full h-full object-cover rounded-[1rem]'/>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-[1] hv-linear w-full h-full top-0 px-[2rem] rounded-[1rem] left-0 flex flex-col justify-center items-center py-[1rem] bg-[#222222c0]'>
                            <h5 className='text-[2.5rem] font-bold text-primary'>Phòng VIP</h5>
                            <p className='maxlineThree text-[#fff]'>Không gian sang trọng, riêng tư, phù hợp cho tiệc hoặc hợp mặt quan trọng</p>
                        </div>
                    </div>

                </div>
                <BtnRight right={'-4rem'}/>
            </div>
        </div>
    );
}

export default RestaurantSpace;
