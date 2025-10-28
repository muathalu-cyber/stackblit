"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UsernameRecoveryPage from "@/components/login";
import Link from "next/link";
import PaymentChannelsPage from "@/components/omntl";
import AddMoneyPage from "@/components/upload";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState("1");
  return (
    <>
      {currentStep === "1" ? (
        <div>
          <PaymentChannelsPage setCurrentStep={setCurrentStep} />
        </div>
      ) : currentStep === "2" ? (
        <AddMoneyPage/>
      ) : (
        <UsernameRecoveryPage />
      )}

     
    </>
  );
}