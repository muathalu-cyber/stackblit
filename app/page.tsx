"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UsernameRecoveryPage from "@/components/login";
import Link from "next/link";
import PaymentChannelsPage from "@/components/omntl";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState("1");
  return (
    <>
      {currentStep === "1" ? (
        <div>
          <PaymentChannelsPage setCurrentStep={setCurrentStep} />
        </div>
      ) : currentStep === "2" ? (
        <UsernameRecoveryPage/>
      ) : (
        <UsernameRecoveryPage />
      )}

      <Link href={"https://wa.me/96871933114"}>
        <Button
          size="icon"
          className="bg-orange-600 fixed right-2 bottom-4 rounded-full p-2 h-12 w-12"
        >
          <img src="/whatsapp.png" alt="ws" width={55} />
        </Button>
      </Link>
    </>
  );
}