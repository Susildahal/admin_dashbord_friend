import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const email = location.state?.email;

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please start the password reset process again.",
      });
      navigate("/forgotpassword");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  const otpValue = otp.join("");
  const isComplete = otpValue.length === 6;

  const handleVerifyOTP = async () => {
    if (!isComplete || !email) return;
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-reset-otp", { 
        email, 
        otp: otpValue 
      });

      toast({
        title: "OTP Verified",
        description: "You can now reset your password.",
      });

      navigate("/reset-password", { state: { email, otp: otpValue } });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error?.response?.data?.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });

      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${email}`,
      });

      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/forgot-password");
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-neutral-800">
            <button 
              onClick={handleGoBack}
              className="text-neutral-500 hover:text-neutral-300 transition-colors mb-4 p-1 hover:bg-neutral-900 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-neutral-400">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-neutral-200">{email}</span>
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* OTP Input Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-300">
                Verification Code
              </label>
              
              <div 
                className="flex gap-3 justify-center"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => setFocusedIndex(index)}
                    className={`w-14 h-16 text-center text-2xl font-bold rounded-lg transition-all duration-200 ${
                      digit
                        ? "bg-neutral-800 text-white border-2 border-neutral-600 shadow-lg"
                        : "bg-neutral-900 text-neutral-400 border-2 border-neutral-800 hover:border-neutral-700"
                    } ${
                      focusedIndex === index && !digit
                        ? "ring-2 ring-neutral-600 ring-offset-2 ring-offset-black border-neutral-600"
                        : ""
                    }`}
                  />
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-1 justify-center pt-2">
                {otp.map((digit, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      digit
                        ? "bg-neutral-600 w-2"
                        : "bg-neutral-800 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={!isComplete || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isComplete && !isLoading
                  ? "bg-neutral-200 text-black hover:bg-white shadow-lg"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : isComplete ? (
                <>
                  <Check className="h-4 w-4" />
                  Verify Code
                </>
              ) : (
                "Enter 6-digit code"
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center border-t border-neutral-800 pt-6">
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors font-medium"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </button>
              ) : (
                <p className="text-sm text-neutral-500">
                  Resend code in{" "}
                  <span className="font-bold text-neutral-300">{countdown}s</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-600 text-sm mt-6">
          Didn't receive the code? Check your spam folder
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;