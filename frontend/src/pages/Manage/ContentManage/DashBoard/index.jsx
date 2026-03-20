import { faCartPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import {
  getRevenue,
  getYearRevenue,
} from "../../../../services/revenueService";

ChartJS.register(
  LineElement,
  BarElement, // Đường trong biểu đồ Line
  PointElement, // Điểm trong biểu đồ Line
  ArcElement, // Thành phần của biểu đồ Doughnut
  CategoryScale, // Thang đo trên trục X
  LinearScale, // Thang đo trên trục Y
  Title,
  Tooltip,
  Legend,
);

function DashBoard() {
  const [listRevenue, setListRevenue] = useState([]);
  const [numCustomer, setNumCustomer] = useState(0);
  const [numOrder, setNumOrder] = useState(0);
  const [yearRevenue, setYearRevenue] = useState([]);
  const [valueYearRevenue, setValueYearRevenue] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: Math.ceil(new Date().getDate() / 7),
  });

  useEffect(() => {
    const fetchDateRevenue = async () => {
      try {
        const response = await getYearRevenue();
        if (response.errCode === 0) {
          setYearRevenue(response.years);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDateRevenue();
  }, []);

  const fetch = async () => {
    try {
      const message = await getRevenue(valueYearRevenue);
      if (message.errCode === 0) {
        setListRevenue(message.revenueData);
        setNumCustomer(message.numCustomer);
        setNumOrder(message.numOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch();
  }, [valueYearRevenue]);

  const handleChangeDateRevenue = ({ target }) => {
    const { name, value } = target;
    setValueYearRevenue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTotalRevenue = useMemo(() => {
    return listRevenue.reduce((acc, curr) => {
      return acc + Number(curr.revenue);
    }, 0);
  }, [listRevenue]);

  return (
    <div className="w-full pt-[3rem] px-[2rem] md:px-[5rem] pb-[4rem]">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1rem] lg:gap-[2rem]">
        <div className="w-full h-[15rem] p-[2rem] flex flex-col justify-center items-start rounded-[1rem] shadow-2xl hover:shadow-gray-400 transition-all duration-[.3s]">
          <span className="mb-[1rem] ">Hóa đơn</span>
          <div className="flex items-center gap-[1rem]">
            <span className="w-[5rem] h-[5rem] flex justify-center items-center rounded-[50%] border-[.1rem] border-[#22b9cd]">
              <FontAwesomeIcon icon={faCartPlus} className="text-[#22b9cd]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[1.8rem] font-bold">{numOrder}</span>
              <span className="text-[1.4rem]">%</span>
            </div>
          </div>
        </div>
        <div className="w-full h-[15rem] p-[2rem] flex flex-col justify-center items-start rounded-[1rem] shadow-2xl hover:shadow-gray-400 transition-all duration-[.3s]">
          <span className="mb-[1rem] ">Doanh thu</span>
          <div className="flex items-center gap-[1rem]">
            <span className="w-[5rem] h-[5rem] text-[2rem] flex justify-center items-center font-bold rounded-[50%] border-[.1rem] border-[#15d818] text-[#15d818]">
              $
            </span>
            <div className="flex flex-col">
              <span className="text-[1.8rem] font-bold">
                {handleTotalRevenue.toLocaleString("vi-VN", {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}
                đ
              </span>
              <span className="text-[1.4rem]">%</span>
            </div>
          </div>
        </div>
        <div className="w-full h-[15rem] p-[2rem] flex flex-col justify-center items-start rounded-[1rem] shadow-2xl hover:shadow-gray-400 transition-all duration-[.3s]">
          <span className="mb-[1rem] ">Khách hàng</span>
          <div className="flex items-center gap-[1rem]">
            <span className="w-[5rem] h-[5rem] text-[2rem] flex justify-center items-center font-bold rounded-[50%] border-[.1rem] border-[#edb313]">
              <FontAwesomeIcon icon={faUsers} className="text-[#edb313]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[1.8rem] font-bold">{numCustomer}</span>
              <span className="text-[1.4rem]">%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[3rem] flex items-center gap-[1rem]">
        <select
          className="w-[20rem] h-[4.4rem] rounded-[.5rem] px-[1rem] focus:ring-2 focus:ring-cyan-400 outline-none border border-gray-300"
          name="year"
          value={valueYearRevenue.year}
          onChange={(e) => {
            handleChangeDateRevenue(e);
          }}
        >
          <option value="" hidden>
            Chọn năm
          </option>
          {yearRevenue?.map((year) => {
            return (
              <option key={year} value={`${year.year}`}>
                {year.year}
              </option>
            );
          })}
        </select>
        <select
          className="w-[20rem] h-[4.4rem] rounded-[.5rem] px-[1rem] focus:ring-2 focus:ring-cyan-400 outline-none border border-gray-300"
          name="month"
          value={valueYearRevenue.month}
          onChange={(e) => {
            handleChangeDateRevenue(e);
          }}
        >
          <option value="" hidden>
            Chọn tháng
          </option>
          {yearRevenue?.map((item) =>
            item.months.map((month) => {
              return (
                <option key={month} value={`${month}`}>
                  Tháng {month}
                </option>
              );
            }),
          )}
        </select>
        <select
          className="w-[20rem] h-[4.4rem] rounded-[.5rem] px-[1rem] focus:ring-2 focus:ring-cyan-400 outline-none border border-gray-300"
          name={`week`}
          value={valueYearRevenue.week}
          onChange={(e) => handleChangeDateRevenue(e)}
        >
          <option value="" hidden>
            Chọn tuần
          </option>
          {[1, 2, 3, 4].map((week) => {
            return (
              <option key={week} value={`${week}`}>
                Tuần {week}
              </option>
            );
          })}
        </select>
        <div
          className="w-[12rem] h-[4.4rem] bg-blue-500 text-white flex items-center justify-center rounded-[.5rem] border border-gray-300 cursor-pointer"
          onClick={() =>
            setValueYearRevenue((prev) => ({
              ...prev,
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              week: Math.ceil(new Date().getDate() / 7),
            }))
          }
        >
          Hiện tại
        </div>
      </div>
      <div className="w-full h-[40rem] mt-[2rem]">
        {listRevenue.length > 0 && (
          <div className="w-full h-full">
            <Line
              data={{
                labels: listRevenue.map((it) => it.day),
                datasets: [
                  {
                    label: "Doanh thu",
                    data: listRevenue.map((item) => item.revenue),
                    backgroundColor: ["#e67e22"],
                    borderColor: "#3498db",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                scales: {
                  x: { type: "category" }, // Đảm bảo sử dụng 'category' ở trục x
                  y: { beginAtZero: true },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
