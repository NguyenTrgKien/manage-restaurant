import { Routes, Route } from "react-router-dom";
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
import MainDish from "./pages/Manage/MainDish";
import LoginAdmin from "./pages/Manage/auth";
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
        <Route path="dish" element={<MainDish />} />
        <Route path="category" element={<Category />} />
        <Route path="order-dish" element={<OrderDish />} />
        <Route path="order-dish/create" element={<CreateOrderDish />} />
        <Route path="order-table" element={<OrderTable />} />
        <Route path="order-table/detail/:id" element={<DetailOrderTable />} />
        <Route path="order-table/create" element={<CreateOrderTable />} />
        <Route path="timeframe" element={<Timeframe />} />
        <Route path="table" element={<Table />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff/action" element={<ActionStaff />} />
        <Route path="staff/action/:id" element={<ActionStaff />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="my-attendance" element={<MyCheckIn />} />
        <Route path="my-checkin" element={<MyCheckIn />} />
      </Route>
      <Route path="manage/login" element={<LoginAdmin />} />
    </Routes>
  );
}

export default App;
