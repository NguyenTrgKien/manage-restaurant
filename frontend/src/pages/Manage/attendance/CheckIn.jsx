import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getQrToken } from "../../../apis/attendance.api";
import { QRCodeCanvas } from "qrcode.react";

const DAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

function CheckIn() {
  const [timeLeft, setTimeLeft] = useState(300);
  const {
    data: qrToken,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["qrToken"],
    queryFn: getQrToken,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 300;
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const now = new Date();
  const today = DAYS[now.getDay()];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <div className="w-full h-full flex items-center justify-center bg-white p-[2rem] rounded-md min-h-[100vh]">
      <div className="flex items-center justify-between flex-col gap-8">
        <div className="text-center">
          <h3 className="text-[2.2rem] font-semibold text-gray-800">
            Mã QR chấm công hôm nay
          </h3>
          <p className="text-gray-500">
            {today}, {dayjs(now).format("DD/MM/YYYY")}
          </p>
        </div>

        {isLoading ? (
          <div className="w-[30rem] h-[30rem] mx-auto border border-gray-300 bg-gray-100 animate-pulse rounded-xl"></div>
        ) : (
          <div className="w-[30rem] h-[30rem] mx-auto border border-gray-300 rounded-xl">
            {
              <QRCodeCanvas
                value={qrToken}
                size={300}
                style={{
                  border: "2px solid #ccc",
                  padding: "2rem",
                  borderRadius: "1rem",
                }}
              />
            }
          </div>
        )}
        <div className="text-center text-gray-600">
          <p>
            Mã hết hạn sau{" "}
            <span className="font-semibold text-cyan-600">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </p>
          <p>
            Mở web trên điện thoại {"->"} vào trang "Chấm công" để quét mã này
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
