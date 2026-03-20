import {
  faCheck,
  faEdit,
  faFilter,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AddDish from "../../../components/AddDish";
import EditFood from "../ContentManage/EditFood";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllFood } from "../../../apis/menu.api";
import { deleteFood } from "../../../apis/menu.api";

export function FoodCardSkeleton() {
  return (
    <div className="w-full h-[32rem] md:h-[35rem] flex flex-col rounded-[2rem] px-[1rem] md:px-[2rem] pb-[2rem] bg-[#ffffff] shadow-xl animate-pulse">
      <div className="w-full h-[14rem] flex justify-center items-center">
        <div className="w-[12rem] h-[12rem] rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col items-center gap-[.8rem] px-[1rem]">
        <div className="h-[1.8rem] w-[70%] rounded-[.5rem] bg-gray-200" />
        <div className="h-[1.4rem] w-[90%] rounded-[.5rem] bg-gray-200" />
        <div className="h-[1.4rem] w-[75%] rounded-[.5rem] bg-gray-200" />
      </div>
      <div className="mt-auto gap-[.5rem]">
        <div className="flex justify-between items-center mb-[.5rem] gap-[.5rem]">
          <div className="h-[1.6rem] w-[40%] rounded-[.5rem] bg-gray-200" />
          <div className="h-[1.6rem] w-[25%] rounded-[.5rem] bg-gray-200" />
        </div>
        <div className="flex items-center gap-[1rem]">
          <div className="w-[60%] h-[3rem] md:h-[4rem] rounded-[.6rem] bg-gray-200" />
          <div className="w-[40%] h-[3rem] md:h-[4rem] rounded-[.6rem] bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function MainDish({ titleAdd }) {
  const queryClient = useQueryClient();
  const [showAddDish, setShowAddDish] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [valueSearch, setValueSearch] = useState("");

  const { data: dataRes, isLoading } = useQuery({
    queryKey: ["allFood"],
    queryFn: getAllFood,
  });
  const allFood = dataRes?.data?.data ?? [];

  const filtered = allFood.filter((item) =>
    item.name.toLowerCase().includes(valueSearch.toLowerCase()),
  );

  const deleteMutation = useMutation({
    mutationFn: (foodId) => deleteFood(foodId),
    onSuccess: (res) => {
      if (res.errCode === 0) {
        setShowDelete(null);
        setIsDeleteSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["allFood"] });
        setTimeout(() => setIsDeleteSuccess(false), 1500);
      }
    },
  });

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[2.2rem] text-gray-800 font-medium">
            Quản lý thực đơn
          </h3>
          <p className="text-gray-500">
            Quản lý toàn bộ thực đơn của nhà hàng.
          </p>
        </div>
        <div
          className="px-8 py-4 flex gap-[1rem] justify-center items-center rounded-[1rem] bg-[#1fc5c5] cursor-pointer hover:bg-[#0cb7b7] transition-all duration-[.25s]"
          onClick={() => setShowAddDish(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="text-[#fff]" />
          <span className="text-[#fff]">Thêm {titleAdd}</span>
        </div>
      </div>

      <div className="relative flex items-center gap-5">
        <input
          type="text"
          className="w-[16rem] sm:w-[22rem] md:w-[28rem] h-[4rem] md:h-[4.2rem] px-[1rem] pr-[3rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all"
          value={valueSearch}
          placeholder="Tìm tên món ăn..."
          onChange={(e) => setValueSearch(e.target.value)}
        />
        <button className="px-8 h-[4rem] md:h-[4.2rem] space-x-2 rounded-[0.75rem] bg-blue-500 text-white transition-all hover:bg-blue-600">
          <FontAwesomeIcon icon={faFilter} />
          <span className="ml-2">Lọc</span>
        </button>
      </div>

      {isLoading ? (
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-[2rem] gap-[1rem] pt-[2rem] pb-[4rem] mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-[2rem] gap-[1rem] pt-[2rem] pb-[4rem] mt-8">
          {filtered.map((value) => (
            <div
              key={value.id}
              className="w-full h-[32rem] md:h-[32rem] flex flex-col rounded-[2rem] px-[1rem] md:px-[2rem] pb-[2rem] bg-[#ffffff] shadow-xl"
            >
              <div className="w-full h-[14rem] flex justify-center items-center">
                <div className="w-[12rem] h-[12rem] rounded-[50%] overflow-hidden">
                  <img
                    src={`${value.image}`}
                    alt={value.name}
                    className="w-full h-full rounded-[50%] object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="md:text-[2rem] text-green-800 text-center font-bold line-clamp-1">
                  {value.name}
                </h3>
                <p className="md:text-[1.5rem] text-gray-600 text-[1.3rem] text-center line-clamp-2">
                  {value.description ?? "—"}
                </p>
              </div>

              <div className="mt-auto gap-[.5rem]">
                <div className="flex justify-between text-[1.4rem] gap-[.5rem] items-center mb-[.5rem]">
                  <div>
                    <span>Giá: </span>
                    <span className="text-red-500 font-medium">
                      {Number(value.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <span className="md:px-[1rem] md:py-[.5rem] px-[.5rem] bg-[#d2ffff] rounded-[.5rem]">
                    Kho: {value.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-[1rem]">
                  <button
                    className="w-[60%] h-[3rem] md:h-[4rem] flex items-center justify-center gap-[.5rem] bg-[#ffc107] text-[1.2rem] md:text-[1.6rem] text-[#fff] rounded-[.6rem] cursor-pointer hover:bg-[#d3a10a] transition-all duration-[.25s]"
                    onClick={() => setShowEdit(value)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Chỉnh sửa
                  </button>
                  <button
                    className="w-[40%] h-[3rem] md:h-[4rem] flex items-center justify-center gap-[.5rem] bg-[#f50019] text-[1.2rem] md:text-[1.6rem] text-[#fff] rounded-[.6rem] cursor-pointer hover:bg-[#c40014] transition-all duration-[.25s]"
                    onClick={() => setShowDelete(value.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center mt-8 border border-cyan-200 bg-gray-50 rounded-xl p-20 text-gray-400 text-[1.6rem]">
          Không có dữ liệu
        </div>
      )}

      {showAddDish && (
        <AddDish
          title={`Thêm ${titleAdd}`}
          handeSetShowAddDish={() => setShowAddDish(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["allFood"] })
          }
        />
      )}

      {showDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
          <div className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[6rem]">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem] cursor-pointer"
              onClick={() => setShowDelete(null)}
            />
            <div className="text-[2rem] font-bold text-blue-700">
              Bạn có chắc muốn xóa món ăn này?
            </div>
            <div className="flex items-center gap-[1.5rem] justify-center mt-[2rem]">
              <button
                className="px-[2rem] py-[1rem] bg-[#e7e7e7] rounded-[.8rem] hover:opacity-80 cursor-pointer disabled:opacity-50"
                onClick={() => deleteMutation.mutate(showDelete)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Đang xóa..." : "Có"}
              </button>
              <button
                className="px-[2rem] py-[1rem] bg-green-600 text-[#fff] rounded-[.8rem] hover:opacity-80 cursor-pointer"
                onClick={() => setShowDelete(null)}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteSuccess && (
        <div className="fixed flex justify-center items-center inset-0 z-[400] bg-[#50505052]">
          <div className="w-[40rem] h-auto py-[3rem] flex flex-col items-center gap-[1.5rem] bg-[#fff] rounded-[1rem] text-[2rem] font-bold">
            <FontAwesomeIcon
              icon={faCheck}
              className="p-[2rem] rounded-[50%] border-[.2rem] text-[#00be00] border-[#00be00]"
            />
            Xóa món ăn thành công!
          </div>
        </div>
      )}

      {showEdit && (
        <EditFood
          title="Chỉnh sửa món ăn"
          food={showEdit}
          handleShowEdit={() => setShowEdit(null)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["allFood"] })
          }
        />
      )}
    </div>
  );
}

export default MainDish;
