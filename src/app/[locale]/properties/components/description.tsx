"use client";

import { useLocale } from "next-intl";
import { Property } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { AlignLeft, X } from "lucide-react";
import "../../services/[id]/service.css";

// Format description text to preserve bullet points and line breaks
const formatDescription = (text: string) => {
  if (!text) return "";

  // Convert bullet points (• or -) to HTML list items
  const hasBullets = text.includes("•") || text.includes("	•");

  if (hasBullets) {
    // Split by lines
    const lines = text.split("\n");
    let inList = false;
    let formattedText = "";

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check if line is a bullet point
      if (trimmedLine.startsWith("•") || trimmedLine.startsWith("	•")) {
        // Start a list if not already in one
        if (!inList) {
          formattedText += "<ul class='list-disc pl-6 my-3'>";
          inList = true;
        }
        // Add list item
        formattedText += `<li>${trimmedLine.replace(/^•\s*|^\t•\s*/, "")}</li>`;
      } else {
        // Close list if we were in one
        if (inList) {
          formattedText += "</ul>";
          inList = false;
        }

        // Add regular paragraph
        if (trimmedLine) {
          formattedText += `<p>${trimmedLine}</p>`;
        } else if (line === "") {
          // Preserve empty lines
          formattedText += "<br/>";
        }
      }
    });

    // Close list if still open
    if (inList) {
      formattedText += "</ul>";
    }

    return formattedText;
  }

  // If no bullets, just convert line breaks to <br/>
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("<br/>");
};

const Description = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();
  const [showDialog, setShowDialog] = useState(false);

  if (!property) return null;

  const formattedDescription = formatDescription(property.home_description);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
          <AlignLeft className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {locale === "ar" ? "الوصف" : "Description"}
        </h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {property.home_name}
        </h3>

        <div
          className="text-gray-600 line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: formattedDescription,
          }}
        />

        {/* <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {property.home_description}
        </p> */}

        <div className="flex justify-center">
          <button
            onClick={() => setShowDialog(true)}
            className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
          >
            {locale === "ar" ? "عرض المزيد" : "SHOW ALL"}
          </button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 z-[99999]">
          <DialogTitle asChild>
            <VisuallyHidden>
              {locale === "ar" ? "وصف العقار" : "Property Description"}
            </VisuallyHidden>
          </DialogTitle>

          <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <AlignLeft className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {locale === "ar" ? "الوصف" : "Description"}
                </h2>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800">
                {property.home_name}
              </h3>
              <div
                className="prose prose-gray max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formattedDescription,
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Description;
