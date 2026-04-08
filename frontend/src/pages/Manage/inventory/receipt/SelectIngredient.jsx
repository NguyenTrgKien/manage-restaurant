import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllIngredient } from "../../../../apis/ingredient.api";

function SelectIngredient({
  selectedIngredient,
  setSelectedIngredient,
  onClose,
}) {
  const [searchName, setSearchName] = useState("");
  const [queryIngredientDefault, setQueryIngredientDefault] = useState({
    limit: 10,
    page: 1,
    name: "",
  });
  const [tempSelectedIngredient, setTempSelectedIngredient] =
    useState(selectedIngredient);

  const { data: dataIngredient, isLoading } = useQuery({
    queryKey: ["ingredients", queryIngredientDefault],
    queryFn: () => getAllIngredient(queryIngredientDefault),
  });
  const ingredients = dataIngredient?.data || [];

  const handleFilter = () => {
    setQueryIngredientDefault((prev) => ({
      ...prev,
      name: searchName,
    }));
  };

  const selectedIds = useMemo(() => {
    return new Set(tempSelectedIngredient.map((f) => f.ingredientId));
  }, [tempSelectedIngredient]);

  const handleToggleIngredient = (ingredient) => {
    setTempSelectedIngredient((prev) => {
      const exists = prev.some((f) => f.ingredientId === ingredient.id);

      if (exists) {
        return prev.filter((f) => f.ingredientId !== ingredient.id);
      }

      return [
        ...prev,
        {
          quantity: "",
          unitPrice: "",
          ingredientId: ingredient.id,
          name: ingredient.name,
        },
      ];
    });
  };

  const handleConfirm = () => {
    setSelectedIngredient(tempSelectedIngredient);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-[60rem] h-auto relative bg-[#fff] rounded-[1rem] p-[2rem]"
      >
        <h2 className="text-[2.2rem] font-semibold text-gray-800 mb-10">
          Chọn nguyên liệu nhập kho
        </h2>
        <div className="w-full flex gap-5">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
            />
            <input
              type="text"
              name="searchName"
              placeholder="Tìm tên nguyên liệu..."
              value={searchName || ""}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full h-[4rem] pl-[3.6rem] pr-[1rem] border border-gray-400 rounded-[0.75rem] focus:outline-none focus:border-cyan-500 transition-all text-[1.6rem]"
            />
          </div>
          <div className="col-span-1">
            <button
              className="w-[8rem] h-[4rem] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleFilter}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        <div
          className="mt-10 max-h-[40rem] overflow-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="grid grid-cols-4 gap-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-gray-200 animate-pulse">
                  <div className="w-full h-[10rem] bg-gray-200"></div>
                  <div className="w-full p-2 space-y-2">
                    <p className="w-30 h-4 bg-gray-200"></p>
                    <p className="w-20 h-4 bg-gray-200"></p>
                  </div>
                </div>
              ))
            ) : ingredients.length > 0 ? (
              ingredients.map((ingredient) => {
                const isSelected = selectedIds.has(ingredient.id);
                return (
                  <div
                    key={ingredient.id}
                    className={`relative group border shadow-sm hover:cursor-pointer rounded-md ${isSelected ? "border-green-500" : "border-gray-200"}`}
                    onClick={() => handleToggleIngredient(ingredient)}
                  >
                    <div className="p-5">
                      <p className="p-1">{ingredient.name}</p>
                    </div>
                    <input
                      type="checkbox"
                      style={{ scale: "1.2" }}
                      className="absolute bottom-2 right-2"
                      checked={isSelected}
                      onChange={() => {}}
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center col-span-4 py-10">
                Không có nguyên liệu nào!
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-[1rem] mt-10">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md cursor-pointer transition-all duration-[.25s]"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md cursor-pointer transition-all duration-[.25s]"
              onClick={handleConfirm}
            >
              Chọn
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SelectIngredient;
