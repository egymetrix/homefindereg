"use client";

import { useLocale } from "next-intl";
import { Property } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { AlignLeft, X } from "lucide-react";

const Description = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();
  const [showDialog, setShowDialog] = useState(false);

  if (!property) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <AlignLeft className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {locale === "ar" ? "الوصف" : "Description"}
        </h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {property.home_name}
        </h3>

        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {property.home_description}
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setShowDialog(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
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
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <AlignLeft className="w-4 h-4 text-blue-600" />
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
              <div className="prose prose-gray max-w-none leading-relaxed">
                {property.home_description}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Description;
