import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkAttendance, scanQr } from "../../../apis/attendance.api";
import { DAYS } from ".";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function MyCheckIn() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannerRef = useRef(null);
  const queryClient = useQueryClient();
  const isRunningRef = useRef(false);

  const { data: resCheckAttendance, isLoading } = useQuery({
    queryKey: ["checkAttendance"],
    queryFn: checkAttendance,
  });

  const todayStatus = resCheckAttendance?.data?.status;
  const todayData = resCheckAttendance?.data?.data;
  const isDone = todayStatus === "completed";
  const canScan =
    todayStatus === "not_checked_in" || todayStatus === "checked_in";

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
        async (decodedText) => {
          try {
            await scanner.stop();
            isRunningRef.current = false;
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
              queryClient.invalidateQueries({ queryKey: ["checkAttendance"] });
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
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((error) => {
        setIsScanning(false);
      });
    return () => {
      if (isRunningRef.current) {
        isRunningRef.current = false;
        scanner.stop().catch(() => {});
      }
    };
  }, [isScanning]);

  const stopScan = async () => {
    if (scannerRef.current && isRunningRef.current) {
      try {
        isRunningRef.current = false;
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const now = new Date();
  const today = DAYS[now.getDay()];

  return (
    <div className="w-full h-full bg-white p-[2rem] rounded-md space-y-8 min-h-[calc(100vh-10rem)]">
      <div>
        <h3 className="text-[1.8rem] md:text-[2.2rem]  text-gray-800">
          Quét mã chấm công
        </h3>
        <p className="text-[1.4rem] md:text-[1.6rem]">
          {today}, {dayjs(now).format("DD/MM/YYYY")}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="w-full max-w-[40rem] mx-auto p-[1.6rem] rounded-xl bg-white shadow-md border border-gray-200 text-[1.4rem] md:text-[1.6rem] space-y-2">
            <p className="font-medium text-gray-700">Trạng thái hôm nay:</p>
            <p>
              Check-in:{" "}
              {todayData?.checkIn ? (
                <span className="text-green-600 font-medium">
                  {dayjs(todayData.checkIn).format("HH:mm")}
                </span>
              ) : (
                <span className="text-gray-400">Chưa chấm công</span>
              )}
            </p>
            <p>
              Check-out:{" "}
              {todayData?.checkOut ? (
                <span className="text-green-600 font-medium">
                  ✓ {dayjs(todayData.checkOut).format("HH:mm")}
                </span>
              ) : (
                <span className="text-gray-400">Chưa chấm công</span>
              )}
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
                  onClick={() => {
                    stopScan();
                  }}
                  className="w-full mt-4 py-[1.2rem] rounded-[.8rem] border border-gray-300 text-[1.4rem] md:text-[1.8rem] text-gray-600"
                >
                  Huỷ
                </button>
              </div>
            )}

            {!isScanning && (
              <button
                onClick={() => setIsScanning(true)}
                disabled={isSubmitting || isDone || !canScan}
                className="w-full max-w-[40rem] py-[1.6rem] rounded-[1rem] bg-cyan-500 hover:bg-cyan-600 text-white text-[1.4rem] md:text-[1.8rem]  transition-colors disabled:opacity-60 mb-6"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : isDone
                    ? "Đã hoàn thành chấm công"
                    : todayStatus === "checked_in"
                      ? "Quét mã để checkout"
                      : "Quét mã QR"}
              </button>
            )}

            {result?.success && !isDone && (
              <button
                onClick={() => setResult(null)}
                className="text-[1.4rem] md:text-[1.6rem] text-gray-400 underline mb-6"
              >
                Quét lại
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyCheckIn;
