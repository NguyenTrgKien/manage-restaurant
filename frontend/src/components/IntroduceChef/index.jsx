import { useEffect, useState } from "react";

function IntroduceChef() {
  const [listStaff, setListStaff] = useState([]);

  const getStaff = async () => {
    try {
      const response = await getAllStaff();
      if (response.errCode === 0) {
        setListStaff(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStaff();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const type = entry.target.dataset.animate;
        if (entry.isIntersecting) {
          if (type === "chefTitle") {
            entry.target.classList.add("translate-y-[0]", "opacity-[1]");
            entry.target.classList.remove("translate-y-[15rem]", "opacity-0");
          }
        }
      });
    }, options);
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((element) => {
      observer.observe(element);
    });
  }, []);

  return (
    <div className="w-full h-auto py-[2rem] md:py-[4rem] px-[2rem] md:px-[5rem] lg:px-[10rem]">
      <h2
        data-animate="chefTitle"
        className="text-center text-[2.5rem] md:text-[3rem] xl:text-[4rem] font-bold text-green-800 translate-y-[15rem] opacity-0 animationAll"
      >
        Giới thiệu về đầu bếp của chúng tôi
      </h2>
      <p
        data-animate="chefTitle"
        className="text-[1.8rem] text-center text-gray-600 md:text-[1.5rem] xl:text-[1.8rem] lg:w-[60%] mx-auto mt-[1rem] translate-y-[15rem] opacity-0 animationAll"
      >
        Đội ngủ đầu bếp chuyên nghiệp, với nhiều năm kinh nghiệm và sáng tạo sẽ
        mang đến những món ăn ngon miệng và tốt nhât
      </p>
      <div
        data-animate="chefTitle"
        className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] py-[6rem] translate-y-[15rem] opacity-0 animationAll"
      >
        {listStaff?.map((staff) => {
          return (
            <div
              key={staff.id}
              className="relative w-full h-[40rem] md:h-[55rem] group shadow-xl"
            >
              <img
                src={`http://localhost:3000/${staff.image}`}
                alt=""
                className="w-full h-full object-cover rounded-[1rem]"
              />
              <div className="absolute flex flex-col px-[4rem] justify-center items-center top-0 left-0 w-full h-full opacity-0 group-hover:opacity-[1] bg-[#494949ae] hv-linear rounded-[1rem]">
                <div className="text-[#fff] text-[3rem] text-center">
                  Bếp Trưởng: {staff.fullName}
                </div>
                <div className="text-[#fff] text-[2rem] text-center">
                  Tuổi: 21
                </div>
                <p className="text-[#fff] text-center mt-[1rem]">
                  Có 40 năm kinh nghiệm trong nghề đầu bếp với nhiều ý tưởng chế
                  biến món ăn ngon đẹp mắt
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IntroduceChef;
