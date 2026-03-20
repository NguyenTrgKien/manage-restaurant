// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import monan1 from '../../assets/image/imgcircle.png';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import king from '../../assets/image/king.png';
import vegetable from '../../assets/image/vegetable.png';
import BtnLeft from '../BtnTurnPage/BtnLeft';
import BtnRight from '../BtnTurnPage/BtnRight';
import { useEffect } from 'react';

function DishPopular() {

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const type = entry.target.dataset.animate; 
                if(entry.isIntersecting){
                    if(type === "titleDishPopular"){
                        entry.target.classList.add('translate-y-[0]', 'opacity-[1]');
                        entry.target.classList.remove('translate-y-[15rem]','opacity-0');
                    }else if(type === "imgTitleLeft"){
                        entry.target.classList.add('translate-x-[0]', 'opacity-[1]');
                        entry.target.classList.remove('translate-x-[20rem]','opacity-0');
                    }else if(type === "imgTitleRight"){
                        entry.target.classList.add('translate-x-[0]', 'opacity-[1]');
                        entry.target.classList.remove('translate-x-[-20rem]','opacity-0');
                    }else if(type === 'listDish') {
                        entry.target.classList.add('translate-y-[0]', 'opacity-[1]');
                        entry.target.classList.remove('translate-y-[20rem]','opacity-0');
                    }
                }else{
                    if(type === "imgTitleLeft"){
                        entry.target.classList.remove('translate-x-[0]', 'opacity-[1]');
                        entry.target.classList.add('translate-x-[20rem]','opacity-0');
                    }else if(type === "imgTitleRight"){
                        entry.target.classList.remove('translate-x-[0]', 'opacity-[1]');
                        entry.target.classList.add('translate-x-[-20rem]','opacity-0');
                    }
                }
            })
        }, options);
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((element) => {
            observer.observe(element);
        })
    }, []);

    return (  
        <div className="relative mt-auto w-full h-auto px-[8rem] font-semibold py-[2rem] bg-[#c1c1c145]">
            <h3 data-animate="titleDishPopular" className="text-[#000] text-[4rem] pl-[2rem] mt-[3rem] text-center translate-y-[15rem] opacity-0 animationAll ">
                Thực đơn nổi bật của chúng tôi
            </h3>
            <p data-animate="titleDishPopular" className='text-center w-[66rem] font-medium mx-auto mt-[1rem] text-[1.8rem] translate-y-[15rem] opacity-0 animationAll'>
                Những món ăn tinh túy nhất của chúng tôi - sự kết hợp hoàn hảo giữa nghệ thuật ẩm thực và hương vị độc đáo, sẵn sàng chinh phục vị giác của bạn
            </p> 
            <div data-animate="imgTitleLeft" className='absolute top-0 right-[10rem] translate-x-[20rem] opacity-0 animationAll'>
                <img src={king} alt="king" className='w-[16rem] rotate-[30deg]'/>
            </div>
            <div data-animate="imgTitleRight" className='absolute top-0 left-[10rem] translate-x-[-20rem] opacity-0 animationAll'>
                <img src={vegetable} alt="king" className='w-[16rem] rotate-[60deg]'/>
            </div>

            <div data-animate="listDish" className='relative translate-y-[20rem] opacity-0 animationAll'>
                <BtnLeft left={'-5rem'}/>
                <div className="grid auto-cols-[calc((100%-6.6rem)/4)] px-[2rem] grid-flow-col overflow-auto pb-[8rem] pt-[14rem] items-center gap-[2.2rem] mt-[1.8rem] removeScrollbar">
                    <div className="w-full h-auto p-[2rem] group rounded-[1.4rem] shadow-2xl hover:shadow-2xl hover:shadow-[#064e00] hover:cursor-pointer transition-all duration-[.3s]">
                        
                        <div className="relative w-full h-[36rem] flex justify-center items-center">
                            <img src={monan1} alt="" className="absolute top-[-8rem] w-[20rem] h-[20rem] object-cover group-hover:scale-[1.15] group-hover:rotate-[20deg] rounded-[50%] transition-transform duration-[.3s] shadow-2xl shadow-[#000]"/>

                            <div className="flex flex-col gap-[.5rem] pt-[15rem] w-full h-full">
                                <div className="text-[2.2rem] text-center font-semibold maxlineThre text-primary-bold">
                                    Cánh Gà Chiên Tỏi Ớt Trộn Xà Lách
                                </div>
                                <p className='text-[#444444] maxlineThree'>
                                    Cánh gà chiên trộn với gỏi xà lách cho hương vị thêm đậm đàđ ưeqed dddd ddd ddddd wfdwe dfew ddddd
                                </p>
                                <div className='flex item-center gap-[.2rem] mt-[1rem]'>
                                    <span>Giá: </span>
                                    <span className='text-[red]'>45.000đ</span>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <button className="px-[2rem] flex items-center gap-[.2rem] py-[.8rem] bg-[#ff4a4a] hover:opacity-[.8] hv-linear cursor-pointer rounded-[.4rem] text-[#fff]">
                                        Thêm vào
                                    <FontAwesomeIcon icon={faCartPlus} className='text-[1.8rem] text-[#ffffff]'/>
                                    </button>
                                    <button className="px-[2rem] py-[.8rem] bg-primary hover:opacity-[.8] hv-linear cursor-pointer rounded-[.4rem] text-[#fff]">
                                        Đặt ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-auto p-[2rem] group rounded-[1.4rem] shadow-2xl hover:shadow-2xl hover:shadow-[#064e00] hover:cursor-pointer transition-all duration-[.3s]">
                        
                        <div className="relative w-full h-[36rem] flex justify-center items-center">
                            <img src={monan1} alt="" className="absolute top-[-8rem] w-[20rem] h-[20rem] object-cover group-hover:scale-[1.15] group-hover:rotate-[20deg] rounded-[50%] transition-transform duration-[.3s] shadow-2xl shadow-[#000]"/>

                            <div className="flex flex-col gap-[.5rem] pt-[15rem] w-full h-full">
                                <div className="text-[2.2rem] text-center font-semibold maxlineThre text-primary-bold">
                                    Cánh Gà Chiên Tỏi Ớt Trộn Xà Lách
                                </div>
                                <p className='text-[#444444] maxlineThree'>
                                    Cánh gà chiên trộn với gỏi xà lách cho hương vị thêm đậm đàđ ưeqed dddd ddd ddddd wfdwe dfew ddddd
                                </p>
                                <div className='flex item-center gap-[.2rem] mt-[1rem]'>
                                    <span>Giá: </span>
                                    <span className='text-[red]'>45.000đ</span>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <button className="px-[2rem] flex items-center gap-[.2rem] py-[.8rem] bg-[#ff4a4a] hover:opacity-[.8] hv-linear cursor-pointer rounded-[.4rem] text-[#fff]">
                                        Thêm vào
                                    <FontAwesomeIcon icon={faCartPlus} className='text-[1.8rem] text-[#ffffff]'/>
                                    </button>
                                    <button className="px-[2rem] py-[.8rem] bg-primary hover:opacity-[.8] hv-linear cursor-pointer rounded-[.4rem] text-[#fff]">
                                        Đặt ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BtnRight right={'-5rem'}/>
            </div>
            
        </div>
    );
}

export default DishPopular;