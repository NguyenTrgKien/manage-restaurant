import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { scanQr } from "../../../apis/attendance.api";
import { DAYS } from ".";
import dayjs from "dayjs";

function MyCheckIn() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;
    setResult(null);
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner
      .start(
        {
          facingMode: "environment",
        },
        { fps: 30, qrbox: 250 },
        async (decodedText, decodedResult) => {
          console.log("Đọc được qr:", decodedText);
          console.log("Đọc được qr:", decodedResult);

          try {
            await scanner.stop();
          } catch (error) {}
          setIsScanning(false);

          try {
            setIsSubmitting(true);
            const res = await scanQr(decodedText);

            if (res.status === 200) {
              setResult({
                success: true,
                type: res.data.type,
                message: res.data.message,
              });
            }
          } catch (error) {
            setResult({
              success: false,
              message: error.response?.data?.message || "Có lỗi xãy ra!",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      )
      .then(() => console.log("Camera started"))
      .catch((error) => {
        console.error("Không thể mở camera:", error);
        setIsScanning(false);
      });
    // return () => {
    //   scanner.stop().catch(() => {});
    // };
  }, [isScanning]);

  const stopScan = async () => {
    if (scannerRef.current) await scannerRef.current.stop();
    setIsScanning(false);
  };

  const now = new Date();
  const today = DAYS[now.getDay()];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div>
        <h3 className="text-[1.8rem] md:text-[2.2rem] font-semibold text-gray-800">
          Quét mã chấm công
        </h3>
        <p className="text-[1.4rem] md:text-[1.6rem]">
          {today}, {dayjs(now).format("DD/MM/YYYY")}
        </p>
      </div>
      <div className="text-center mb-6">
        {result && (
          <div
            className={`w-full max-w-[40rem] mx-auto p-[2rem] rounded-[1.2rem] text-center text-[1.4rem] md:text-[1.8rem] font-medium ${
              result.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {result.success ? "✓" : "✗"} {result.message}
          </div>
        )}

        {isScanning && (
          <div className="w-full max-w-[40rem] mx-auto mb-6">
            <div
              id="qr-reader"
              className="w-full rounded-[1.2rem] overflow-hidden"
            />
            <button
              onClick={stopScan}
              className="w-full mt-4 py-[1.2rem] rounded-[.8rem] border border-gray-300 text-[1.4rem] md:text-[1.8rem] text-gray-600"
            >
              Huỷ
            </button>
          </div>
        )}

        {!isScanning && (
          <button
            onClick={() => setIsScanning(true)}
            disabled={isSubmitting}
            className="w-full max-w-[40rem] py-[1.6rem] rounded-[1rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.4rem] md:text-[1.8rem] font-semibold transition-colors disabled:opacity-60 mb-6"
          >
            {isSubmitting ? "Đang xử lý..." : "Quét mã QR"}
          </button>
        )}

        {result?.success && (
          <button
            onClick={() => setResult(null)}
            className="text-[1.4rem] md:text-[1.6rem] text-gray-400 underline mb-6"
          >
            Quét lại
          </button>
        )}
      </div>
    </div>
  );
}

export default MyCheckIn;
