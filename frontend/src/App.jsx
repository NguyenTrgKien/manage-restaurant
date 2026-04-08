import { Routes, Route, Outlet } from "react-router-dom";
import Manage from "./pages/Manage";
import CategoryPage from "./pages/customer/CategoryPage";
import LoginUser from "./pages/customer/LoginUser";
import HomePage from "./pages/customer/HomePage";
import DetailFood from "./pages/customer/DetailFood";
import CartView from "./pages/customer/CartView";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import DetailOrder from "./pages/customer/DetailOrder";
import PaymentFail from "./pages/customer/PaymentFail";
import PaymentDishTable from "./pages/customer/PaymentDishTable";
import InfoUserOrder from "./pages/customer/InfoUserOrder";
import Introduce from "./pages/customer/Introduce";
import Contact from "./pages/customer/Contact";
import RedirectIfPayment from "./components/PaymentRedirect";
import PrivateRoute from "./components/PrivateRoute";
import ADMIN from "./pages/Manage/auth";
import Category from "./pages/Manage/category";
import OrderDish from "./pages/Manage/Order";
import OrderTable from "./pages/Manage/OrderTable";
import CreateOrderDish from "./pages/Manage/Order/CreateOrderDish";
import CreateOrderTable from "./pages/Manage/OrderTable/CreateOrderTable";
import Timeframe from "./pages/Manage/timeframes";
import Table from "./pages/Manage/Table";
import DetailOrderTable from "./pages/Manage/OrderTable/DetailOrderTable";
import Staff from "./pages/Manage/Staff";
import ActionStaff from "./pages/Manage/Staff/ActionStaff";
import Attendance from "./pages/Manage/attendance";
import CheckIn from "./pages/Manage/attendance/CheckIn";
import MyCheckIn from "./pages/Manage/attendance/MyCheckIn";
import LoginAdmin from "./pages/Manage/auth";
import CustomerPage from "./pages/Manage/CustomerPage";
import Inventory from "./pages/Manage/inventory";
import Supplier from "./pages/Manage/inventory/suppiler";
import Food from "./pages/Manage/food";
import Ingredient from "./pages/Manage/ingredient";
import IngredientCategory from "./pages/Manage/ingredient/ingredientCategory";
import Receipt from "./pages/Manage/inventory/receipt";
import Detail from "./pages/Manage/inventory/receipt/Detail";
import HistoryTransaction from "./pages/Manage/inventory/historyTransaction";
import StockInForm from "./pages/Manage/inventory/receipt/StockInForm";

function App() {
  return (
    <Routes>
      {/* <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginUser />} />

        <Route path="/category-dish" element={<CategoryPage />} />
        <Route path="/detail-food" element={<DetailFood />} />
        <Route path="/cart-view" element={<CartView />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/detail-order" element={<DetailOrder />} />
        <Route path="/payment-fail" element={<PaymentFail />} />
        <Route path="/order-table" element={<OrderTable />} />
        <Route path="/payment-dish-table" element={<PaymentDishTable />} />
        <Route path="/payment-result" element={<PaymentRequest />} />
        <Route path="/infor-user-order" element={<InfoUserOrder />} />
        <Route path="/about" element={<Introduce />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<RedirectIfPayment />} />
      </Route> */}

      <Route path="/attendance/checkin" element={<CheckIn />} />

      <Route
        path="/manage"
        element={
          <PrivateRoute>
            <Manage />
          </PrivateRoute>
        }
      >
        <Route
          element={
            <PrivateRoute allowedRoles={["admin", "staff"]}>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="dish" element={<Food />} />
          <Route path="category" element={<Category />} />
          <Route path="table" element={<Table />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="order-dish" element={<OrderDish />} />
          <Route path="order-dish/create" element={<CreateOrderDish />} />
          <Route path="order-table" element={<OrderTable />} />
          <Route path="order-table/detail/:id" element={<DetailOrderTable />} />
          <Route path="order-table/create" element={<CreateOrderTable />} />

          <Route path="inventory" element={<Inventory />} />

          <Route path="inventory-receipts" element={<Receipt />} />
          <Route
            path="inventory-receipts/create"
            element={<StockInForm mode="create" />}
          />
          <Route
            path="inventory-receipts/edit/:id"
            element={<StockInForm mode="edit" />}
          />
          <Route path="inventory-receipts/:id" element={<Detail />} />
          <Route
            path="inventory-transactions"
            element={<HistoryTransaction />}
          />

          <Route path="inventory/suppliers" element={<Supplier />} />

          <Route path="ingredient" element={<Ingredient />} />
          <Route path="ingredient-category" element={<IngredientCategory />} />
        </Route>

        <Route
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="staff" element={<Staff />} />
          <Route path="staff/action" element={<ActionStaff />} />
          <Route path="staff/action/:id" element={<ActionStaff />} />
          <Route path="timeframe" element={<Timeframe />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route
          element={
            <PrivateRoute allowedRoles={["staff"]}>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="my-attendance" element={<MyCheckIn />} />
        </Route>
      </Route>

      <Route path="manage/login" element={<LoginAdmin />} />
      <Route path="/403" element={<div>Bạn không có quyền truy cập</div>} />
    </Routes>
  );
}

export default App;
