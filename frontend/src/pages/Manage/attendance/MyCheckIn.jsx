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
    if (isScanning) {
      setResult(null);
      scannerRef.current = new Html5Qrcode("qr-reader");
      scannerRef.current
        .start(
          {
            facingMode: "environment",
          },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await scannerRef.current.stop();
            setIsScanning(false);
            await handleScan(decodedText);
          },
        )
        .catch(() => setIsScanning(false));
    }
  }, [isScanning]);

  const stopScan = async () => {
    if (scannerRef && scannerRef.current) await scannerRef.current.stop();
    setIsScanning(false);
  };

  const handleScan = async (qrToken) => {
    try {
      setIsSubmitting(true);
      const res = await scanQr(qrToken);

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
        message: err.response?.data?.message || "Có lỗi xãy ra!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  const today = DAYS[now.getDay()];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div>
        <h3 className="text-[2.2rem] font-semibold text-gray-800">
          Quét mã chấm công
        </h3>
        <p>
          {today}, {dayjs(now).format("DD/MM/YYYY")}
        </p>
      </div>
      <div className="text-center">
        {result && (
          <div
            className={`w-full max-w-[40rem] mx-auto p-[2rem] rounded-[1.2rem] text-center text-[1.8rem] font-medium ${
              result.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {result.success ? "✓" : "✗"} {result.message}
          </div>
        )}

        {isScanning && (
          <div className="w-full max-w-[40rem] mx-auto">
            <div
              id="qr-reader"
              className="w-full rounded-[1.2rem] overflow-hidden"
            />
            <button
              onClick={stopScan}
              className="w-full mt-4 py-[1.2rem] rounded-[.8rem] border border-gray-300 text-[1.6rem] text-gray-600"
            >
              Huỷ
            </button>
          </div>
        )}

        {!isScanning && (
          <button
            onClick={() => setIsScanning(true)}
            disabled={isSubmitting}
            className="w-full max-w-[40rem] py-[1.6rem] rounded-[1rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.8rem] font-semibold transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Đang xử lý..." : "Quét mã QR"}
          </button>
        )}

        {result?.success && (
          <button
            onClick={() => setResult(null)}
            className="text-[1.5rem] text-gray-400 underline"
          >
            Quét lại
          </button>
        )}
      </div>
    </div>
  );
}

export default MyCheckIn;
