import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [login, setLogin] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full h-auto">
      <Header
        login={login}
        setLogin={setLogin}
        isShowCart={false}
        isBg={true}
      />
      <div className="pt-[9.5rem] w-[50%] mx-auto">
        <h2 className="text-[3.4rem] font-bold text-center text-green-800 mb-[1rem]">
          Liên Hệ
        </h2>
        <p className="text-gray-600 text-center">
          Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào.
        </p>

        <div className="mt-6">
          <h2 className=" font-semibold text-gray-800">Thông Tin Liên Hệ</h2>
          <p className="text-gray-600 mt-2">
            📍 Địa chỉ: Đường số 5, nhà trọ Kiến Văn, khu dân cư Thạnh Mỹ, Cái
            Răng, TP.Cần Thơ
          </p>
          <p className="text-gray-600">📞 Số điện thoại: 035 7124 853</p>
          <p className="text-gray-600">
            📧 Email: nguyentrungkien040921@gmail.com
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Nội dung tin nhắn"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-all"
          >
            Gửi Tin Nhắn
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
