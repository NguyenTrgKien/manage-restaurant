import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import imgTable from "../../assets/image/imageTable.png";
import WarnLogin from "../WarnLogin";

function Tables({ setShowViewTable, handleSelectTable, infoOrder }) {
  const [tables, setTables] = useState([]);
  const [showWarnLogin, setShowWarnLogin] = useState(false);
  useEffect(() => {
    const getTable = async () => {
      try {
        const dataTable = await getAllTable(infoOrder);
        if (dataTable.errCode === 0) {
          setTables(dataTable.message);
          // const res = await getOrderTableDate(infoOrder.orderDate);
          // if(res.errCode === 0) {
          //     const updatedTables = dataTable.message.map(table => {
          //         // Kiểm tra xem bàn có trong danh sách đặt cho ngày này không
          //         const reservation = res.data.find(r => r.tableId === table.id);
          //         // console.log(reservation)
          //         // if(reservation?.status !== 'COMPLETED' && reservation?.status !== 'PAID') {
          //         //     return {
          //         //         ...table,
          //         //         status: reservation ? 'Đã được đặt' : 'Còn trống'
          //         //     };
          //         // }
          //         // Xử lý tất cả các trường hợp
          //     if (!reservation) {
          //         return {
          //             ...table,
          //             status: 'Còn trống'
          //         };
          //     }

          //     // Nếu đơn hàng đã hoàn thành hoặc đã thanh toán
          //     if (reservation.status === 'COMPLETED' || reservation.status === 'PAID') {
          //         return {
          //             ...table,
          //             status: 'Còn trống' // Trả bàn về trạng thái trống
          //         };
          //     }

          //     if (reservation.status === 'CHECKED_IN') {
          //         return {
          //             ...table,
          //             status: 'Đang sử dụng' // Trả bàn về trạng thái trống
          //         };
          //     }

          //     // Các trường hợp khác
          //     return {
          //         ...table,
          //         status: 'Đã được đặt'
          //     };
          //     });
          //     setTables(updatedTables);
          // }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTable();
  }, []);
  console.log(tables);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#6060606c] z-[999]">
      <div className="relative md:w-[90%] lg:w-[80%] xl:w-[70%] h-auto p-[2rem] lg:p-[4rem] bg-[#fff] rounded-[1rem] shadow-2xl shadow-[#4a4a4a]">
        <div
          className="absolute md:top-[2rem] top-0 right-0 md:right-[2rem] w-[3rem] h-[3rem] flex justify-center items-center bg-[#eaeaea] rounded-[.3rem] hover:bg-[red] group transition-all duration-[.25s]"
          onClick={() => setShowViewTable(false)}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-[2rem] text-[#5e5e5e] group-hover:text-[#fff] transition-all duration-[.25s]"
          />
        </div>
        <h2 className="text-[2.5rem] lg:text-[3rem] text-[#00a000] text-center font-bold ">
          Sơ đồ bàn cùa nhà hàng
        </h2>
        <div className="flex md:flex-row flex-col items-start justify-between mt-[1rem] md:text-[1.6rem] text-[1.2rem]">
          <div className="text-gray-600  text-center">
            Bấm vào bàn để đặt bàn ( Màu xanh là còn bàn )
          </div>
        </div>
        <div className="w-full h-auto mt-[2rem] grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[1rem] lg:gap-[2rem] xl:gap-[3rem]">
          {tables.length > 0 &&
            tables.map((table) => {
              return (
                <div
                  key={table.id}
                  className={`relative w-full h-[8rem] md:h-[10rem] xl:h-[14rem] rounded-[.5rem] flex flex-col justify-center items-center border-[.3rem] p-[1rem]  ${table.status === "Còn trống" ? "bg-[#e9ffe9] border-[#00ba00]" : table.status === "Đã được đặt" ? "bg-[#fff4cb] border-[#bdc700]" : "bg-[#ffcfcf] border-[#ef0000]"} ${table.status !== "Còn trống" ? "" : "hover:scale-[1.1]"} transition-all duration-[.25s] cursor-pointer group`}
                >
                  <img src={imgTable} alt="table" className="w-[4rem]" />
                  <h3 className="text-[1.4rem] md:text-[2.2rem] text-green-800 text-center font-bold">
                    {table.tableName}
                  </h3>
                  <div className="mt-[.5rem] xl:text-[1.6rem] text-[.8rem] md:text-[1.4rem]">
                    {table.status}
                  </div>
                  {table.status !== "Còn trống" ? (
                    <div
                      className={` opacity-0 absolute inset-0 group-hover:bg-[#c3c3c3] group-hover:opacity-[1] flex justify-center items-center text-[#fff] text-[1.8rem] transition-all duration-[.25s] select-none cursor-not-allowed`}
                    >
                      {table.status}
                    </div>
                  ) : (
                    <div
                      className={` absolute inset-0 opacity-0 group-hover:bg-[#c3c3c3] hover:opacity-[1] flex justify-center items-center text-[#fff] text-[1.8rem] transition-all duration-[.25s]`}
                      onClick={() => {
                        handleSelectTable(table);
                        setShowViewTable(false);
                      }}
                    >
                      Chọn
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {showWarnLogin && (
        <WarnLogin
          setShowWarnLogin={setShowWarnLogin}
          pathRedirect={`/order-table/${showWarnLogin}`}
        />
      )}
    </div>
  );
}

export default Tables;
