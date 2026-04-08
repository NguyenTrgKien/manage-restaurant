import {
  faAngleDown,
  faAngleUp,
  faCarrot,
  faChartLine,
  faEject,
  faEthernet,
  faLayerGroup,
  faLock,
  faReceipt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router";

export const MENU = {
  DASHBOARD: "dashboard",
  DISH: "dish",
  CATEGORY: "category",
  ORDER_DISH: "order-dish",
  ORDER_TABLE: "order-table",
  STAFF: "staff",
  TABLE: "table",
  CUSTOMER: "customer",
  TIMEFRAME: "timeframe",
  ATTENDANCE: "attendance",
  MYATTENDANCE: "my-attendance",
  INGREDIENT: "ingredient",
  INGREDIENTCATEGORY: "ingredient-category",
};
export const sidebarList = [
  {
    id: 1,
    title: "DashBoard",
    menuKey: MENU.DASHBOARD,
    icon: faChartLine,
    children: [],
  },
  { id: 2, title: "Thực đơn", menuKey: MENU.DISH, icon: faEject, children: [] },
  {
    id: 3,
    title: "Nguyên liệu",
    menuKey: null,
    icon: faCarrot,
    children: [
      {
        id: 31,
        title: "Danh sách",
        menuKey: MENU.INGREDIENT,
      },
      {
        id: 32,
        title: "Danh mục",
        menuKey: MENU.INGREDIENTCATEGORY,
      },
    ],
  },
  {
    id: 4,
    title: "Danh mục",
    menuKey: MENU.CATEGORY,
    icon: faLayerGroup,
    children: [],
  },
  {
    id: 5,
    title: "Đơn hàng",
    menuKey: null,
    icon: faReceipt,
    children: [
      { id: 51, title: "Đơn đặt món", menuKey: MENU.ORDER_DISH },
      { id: 52, title: "Đơn đặt bàn", menuKey: MENU.ORDER_TABLE },
    ],
  },
  {
    id: 6,
    title: "Quản lý kho",
    menuKey: null,
    icon: faLock,
    children: [
      { id: 61, title: "Tồn kho", menuKey: "inventory" },
      { id: 62, title: "Danh sách phiếu nhập", menuKey: "inventory-receipts" },
      { id: 63, title: "Nhập kho", menuKey: "inventory-receipts/create" },
      { id: 64, title: "Nhà cung cấp", menuKey: "inventory/suppliers" },
      {
        id: 65,
        title: "Lịch sử thay đổi kho",
        menuKey: "inventory-transactions",
      },
    ],
  },
  {
    id: 7,
    title: "Nhân viên",
    menuKey: MENU.STAFF,
    icon: faUser,
    children: [],
  },
  { id: 8, title: "Bàn", menuKey: MENU.TABLE, icon: faEthernet, children: [] },
  {
    id: 9,
    title: "Khách hàng",
    menuKey: MENU.CUSTOMER,
    icon: faUsers,
    children: [],
  },
  {
    id: 10,
    title: "Khung giờ",
    menuKey: MENU.TIMEFRAME,
    icon: faLock,
    children: [],
  },
  {
    id: 11,
    title: "Chấm công",
    menuKey: MENU.ATTENDANCE,
    icon: faLock,
    children: [],
  },
  {
    id: 12,
    title: "Chấm công của tôi",
    menuKey: MENU.MYATTENDANCE,
    icon: faLock,
    children: [],
  },
];

const ADMIN_ONLY = [MENU.STAFF, MENU.CUSTOMER, MENU.TIMEFRAME, MENU.ATTENDANCE];

const STAFF_ONLY = [MENU.MYATTENDANCE];

function SidebarAdmin({
  currentContent,
  activeCategoryName,
  listCategory,
  onSelectMenu,
  onSelectCategory,
}) {
  const { user } = useAuth();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) =>
    setOpenDropdownId((prev) => (prev === id ? null : id));

  const getChildren = (item) =>
    item.id === 2 && listCategory?.data?.length > 0
      ? listCategory.data
      : item.children;

  const isItemActive = (item) => currentContent === item.menuKey;
  const isGroupActive = (item) =>
    item.children.some((c) => currentContent === c.menuKey);
  const visibleItems = sidebarList.filter((item) => {
    if (ADMIN_ONLY.includes(item.menuKey)) return user?.role === "admin";
    if (STAFF_ONLY.includes(item.menuKey)) return user?.role === "staff";
    return true;
  });

  return (
    <div className="fixed hidden md:block top-0 left-0 xl:w-[25rem] md:w-[20rem] h-[100vh] bg-white border border-gray-200 ">
      <h2 className="text-[2.5rem] text-green-800 h-[7.2rem] flex justify-center items-center font-bold text-center border-b-[.1rem] border-b-[#ddd]">
        ADMIN
      </h2>

      <div
        className="py-5 pl-12 h-[calc(100%-7.2rem)] overflow-auto flex flex-col items-start"
        style={{ scrollbarWidth: "none" }}
      >
        {visibleItems.map((item) => {
          const children = getChildren(item);
          const hasChildren = children.length > 0;
          const isOpen = openDropdownId === item.id;
          const active = isItemActive(item) || isGroupActive(item);

          return (
            <div key={item.id} className="w-full">
              {hasChildren ? (
                <div
                  className={`flex items-center py-[1.6rem] px-[2rem] rounded-[.5rem] cursor-pointer select-none
                    ${active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  onClick={() => toggleDropdown(item.id)}
                >
                  <div className="w-[3rem] h-auto text-start">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-[1.6rem]"
                    />
                  </div>
                  <span className="flex items-center gap-[.5rem]">
                    {item.title}
                    <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
                  </span>
                </div>
              ) : (
                <Link
                  to={item.menuKey}
                  className={`flex items-center py-[1.6rem] px-[2rem] rounded-[.5rem] cursor-pointer select-none
                    ${active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  onClick={() => {
                    setOpenDropdownId(null);
                    onSelectMenu(item.menuKey);
                  }}
                >
                  <div className="w-[3rem] h-auto text-start">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-inherit text-[1.6rem]"
                    />
                  </div>
                  <span className="flex items-center gap-[.5rem]">
                    {item.title}
                  </span>
                </Link>
              )}

              {hasChildren && (
                <div
                  className={`overflow-hidden pl-[4.8rem] transition-all duration-500
                  ${isOpen ? "opacity-100 max-h-[30rem]" : "max-h-0 opacity-0"}`}
                >
                  {item.id === 2
                    ? children.map((cat) => (
                        <Link
                          to={`${MENU.DISH}?category=${cat.id}`}
                          key={cat.id}
                          className={`block text-[1.4rem] py-[1rem] cursor-pointer select-none
                            ${
                              activeCategoryName === cat.name
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            }`}
                          onClick={() => onSelectCategory(cat.name, cat.id)}
                        >
                          {cat.name}
                        </Link>
                      ))
                    : /* Đơn hàng: sub-items cố định */
                      children.map((child) => (
                        <Link
                          to={child.menuKey}
                          key={child.id}
                          className={`block text-[1.4rem] py-[1rem] cursor-pointer select-none
                            ${
                              currentContent === child.menuKey
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            }`}
                          onClick={() => onSelectMenu(child.menuKey)}
                        >
                          {child.title}
                        </Link>
                      ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarAdmin;
