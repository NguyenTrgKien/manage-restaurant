import { useEffect } from "react";

function ResLocation() {

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
                    if(type === "resLocation"){
                        entry.target.classList.add('translate-y-[0]', 'opacity-[1]');
                        entry.target.classList.remove('translate-y-[15rem]','opacity-0');
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
        <div className="w-full h-auto md:py-[4rem] px-[2rem] md:px-[5rem] lg:px-[10rem] mb-0 md:mb-[6rem]">
            <h2 data-animate="resLocation" className="text-center text-[2.5rem] md:text-[3rem] xl:text-[4rem] font-bold text-green-800 translate-y-[15rem] opacity-0 animationAll">
                Tìm Đến Nhà Hàng Chúng Tôi
            </h2>
            <div data-animate="resLocation" className="w-full h-auto flex md:flex-row flex-col items-start mt-[4rem] translate-y-[15rem] opacity-0 animationAll">
                <div className="md:w-[50%] w-full h-[40rem]">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.531452505727!2d105.75587947633844!3d10.001137618669672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089a1c2076e0d%3A0xd709fac256ad3c73!2zTmjDoCBUcuG7jSBLaeG6v24gVsSDbg!5e1!3m2!1svi!2s!4v1742538149800!5m2!1svi!2s" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="md:w-[50%] w-full h-auto md:h-[40rem] p-[2rem] md:p-[4rem]" >
                    <p className="mb-[1.5rem]">
                        <strong>
                        Địa chỉ: </strong>
                         Nhà trọ Kiến Văn, đường số 5, khu dân cư Thạnh Mỹ, quận Cái Răng, thành phố Cần Thơ
                    </p>
                    <p className="mb-[1.5rem]">
                        <strong>Số điện thoại: </strong>
                         0357124853
                    </p>
                    <p className="mb-[1.5rem]">
                        <strong>Email: </strong>
                         Nếu có hỗ trợ vui long liên hệ qua email: <span className="text-[#3939ff] ">nguyentrungkien040921@gmail.com</span> 
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResLocation;