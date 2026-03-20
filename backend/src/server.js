import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv"; // Import thư viện dotenv
import initRoute from "./routes/init.route.js";
import cookieParser from "cookie-parser";
import swaggerSpec from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";

dotenv.config(); // Nạp tất cả các biến môi trường vào process.env
const corsOption = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Đường dẫn cho phép
  credentials: true, // Cho phép gửi cookie từ frontend
};

// Cấu hình session để có thể làm việc với cookie
// Express-session sẽ gửi session Id này về client
// Session Id này giống như một chìa khóa dùng để lấy dữ liệu từ session được lưu trên server
// Việc kiểm tra session id có hợp lệ hay không là do thư viện express-session tự động thực hiện
// Khi express-session kiểm tra session Id hợp lệ thì nó sẽ tự gán user vào session và chúng ta chỉ cân kiểm tra req.session.user có tồn tại hay không

function configTimeExpired() {
  const now = new Date(); // lấy ngày hiện tại
  const midnight = new Date(now); // Tạo một bản sao để chỉnh sửa mà không làm thay đổi now
  midnight.setDate(now.getDate() + 1); // +1 để chuyển thành ngày mai
  midnight.setHours(0, 0, 0, 0); // Chuyển thời gian cảu ngày mai thành 00:00 (thời gian bắt đầu một ngày mới)
  return midnight - now;
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
initRoute(app);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
