import { Property } from "@/types";
import { useLocale } from "next-intl";
import { Printer } from "lucide-react";
import PropertyPdfGenerator from "@/components/ui/PropertyPdfGenerator";

interface PdfButtonProps {
  property: Property | undefined;
  className?: string;
}

const PdfButton = ({ property, className }: PdfButtonProps) => {
  const locale = useLocale();

  if (!property) return null;

  return (
    <PropertyPdfGenerator property={property}>
      <button
        className={`flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto min-w-[120px] bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base ${className}`}
      >
        <Printer size={16} />
        <span>{locale === "en" ? "Print PDF" : "طباعة PDF"}</span>
      </button>
    </PropertyPdfGenerator>
  );
};

export default PdfButton;
