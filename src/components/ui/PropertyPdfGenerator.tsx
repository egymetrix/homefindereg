/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Property } from "@/types";
import { useLocale } from "next-intl";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";

interface PropertyPdfGeneratorProps {
  property: Property;
  children: React.ReactNode;
}

const PropertyPdfGenerator = ({
  property,
  children,
}: PropertyPdfGeneratorProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const generatePDF = async () => {
    if (!property) {
      toast.error(
        locale === "en"
          ? "Property data not available"
          : "بيانات العقار غير متوفرة"
      );
      return;
    }

    if (!isClient) {
      toast.error(
        locale === "en"
          ? "PDF generation not available"
          : "إنشاء PDF غير متاح"
      );
      return;
    }

    setIsGenerating(true);
    toast.success(
      locale === "en"
        ? "Generating PDF, please wait..."
        : "جاري إنشاء ملف PDF، يرجى الانتظار..."
    );

    try {
      // Dynamic imports for client-side only libraries
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      // Get the first property image
      const firstImage = property.media && property.media.length > 0
        ? property.media.find(m => m.collection_name === "Home-main" || m.collection_name === "Home-Gallery" || !m.collection_name)?.original_url
        : null;

      // Create HTML content
      const htmlContent = `
        <div style="
          font-family: ${locale === 'ar' ? "'Noto Sans Arabic', 'Arial Unicode MS', Arial, sans-serif" : "'Inter', Arial, sans-serif"};
          line-height: 1.4;
          color: #333;
          direction: ${locale === 'ar' ? 'rtl' : 'ltr'};
          padding: 20px;
          background: white;
          font-size: 14px;
          width: 600px;
          min-height: 850px;
          box-sizing: border-box;
        ">
          <div style="
            max-width: 560px;
            margin: 0 auto;
            background: white;
            display: flex;
            flex-direction: column;
            min-height: 810px;
          ">
            <div style="
              display: flex;
              flex-direction: column;
              border-bottom: 2px solid #2e7d32;
              padding-bottom: 20px;
              margin-bottom: 25px;
            ">
              <div style="
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 20px;
              ">
                <div style="flex: 1;">
                  <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://homefindereg.com'}/images/logo.png" alt="Logo" style="
                    width: 120px;
                    height: auto;
                    margin-bottom: 15px;
                  " />
                  <div style="
                    color: #2e7d32;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                  ">${locale === "en" ? "$" : "EGP"}${property.home_price || "-"}</div>
                  <div style="
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #333;
                    word-wrap: break-word;
                  ">${decodeURIComponent(property.home_name || "-")}</div>
                  <div style="
                    color: #666;
                    font-size: 12px;
                    margin-bottom: 15px;
                    word-wrap: break-word;
                  ">${property.address || ""}</div>
                </div>
              </div>
              ${firstImage ? `
                <img src="${firstImage}" alt="Property Image" style="
                  width: 100%;
                  max-width: 350px;
                  height: 200px;
                  object-fit: cover;
                  border-radius: 8px;
                  border: 2px solid #e0e0e0;
                  margin: 0 auto;
                  display: block;
                " />
              ` : ''}
            </div>
            
            <div style="
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 18px;
            ">
              ${property.home_description ? `
                <div>
                  <div style="
                    color: #2e7d32;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 4px;
                  ">${locale === "en" ? "Description" : "الوصف"}</div>
                  <div style="
                    font-size: 11px;
                    line-height: 1.5;
                    text-align: justify;
                    margin-bottom: 12px;
                    word-wrap: break-word;
                  ">${property.home_description.replace(/<[^>]*>/g, "").trim()}</div>
                </div>
              ` : ""}
              
              <div>
                <div style="
                  color: #2e7d32;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  border-bottom: 1px solid #e0e0e0;
                  padding-bottom: 4px;
                ">${locale === "en" ? "Property Features" : "مميزات العقار"}</div>
                <div style="
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 8px;
                  margin-bottom: 15px;
                ">
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Bedrooms" : "غرف النوم"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${property.home_bedrooms || "-"}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Bathrooms" : "الحمامات"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${property.home_bathrooms || "-"}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Area" : "المساحة"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${property.home_area || "-"}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Price" : "السعر"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${locale === "en" ? "$" : "EGP"}${property.home_price || "-"}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Reference" : "المرجع"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${property.id || "-"}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    border-left: ${locale === 'ar' ? 'none' : '3px solid #2e7d32'};
                    border-right: ${locale === 'ar' ? '3px solid #2e7d32' : 'none'};
                  ">
                    <span style="
                      font-weight: 600;
                      color: #555;
                      font-size: 10px;
                    ">${locale === "en" ? "Type" : "النوع"}</span>
                    <span style="
                      color: #2e7d32;
                      font-weight: 700;
                      font-size: 10px;
                    ">${property.home_type || "-"}</span>
                  </div>
                </div>
              </div>
              
              <div id="website-link" style="
                color: #2e7d32;
                font-size: 11px;
                font-weight: 500;
                margin-bottom: 15px;
                text-decoration: underline;
                cursor: pointer;
                padding: 8px;
                background-color: #f0f8f0;
                border-radius: 4px;
                border: 1px solid #2e7d32;
                text-align: center;
                direction: ltr;
              ">${process.env.NEXT_PUBLIC_APP_URL || 'https://homefindereg.com'}/${locale}${decodeURIComponent(pathname)}</div>
            </div>
            
            <div style="
              margin-top: auto;
              padding-top: 15px;
              border-top: 1px solid #e0e0e0;
              font-size: 9px;
              color: #666;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 10px;
            ">
              <span style="flex: 1;">${locale === "en"
          ? "This document is for information purposes only."
          : "هذه الوثيقة لأغراض المعلومات فقط."}</span>
              <span style="font-weight: 600;">Ref: ${property.id || "-"} - ${new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      `;

      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '600px';
      tempContainer.style.height = 'auto';

      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = tempContainer.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            // Fallback timeout
            setTimeout(() => resolve(true), 3000);
          }
        });
      }));

      // Generate canvas from HTML
      const canvas = await html2canvas(tempContainer.firstElementChild as HTMLElement, {
        width: 600,
        height: 850,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [600, 850]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 600, 850);

      // Add clickable link annotation
      const websiteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://homefindereg.com'}/${locale}${decodeURIComponent(pathname)}`;

      // Calculate link position (approximate based on layout)
      const linkX = 50; // Left margin
      const linkY = 650; // Approximate Y position of the link
      const linkWidth = 500; // Width of the link area
      const linkHeight = 30; // Height of the link area

      pdf.link(linkX, linkY, linkWidth, linkHeight, { url: websiteUrl });

      // Generate filename
      const propertyName = property.home_name
        ? decodeURIComponent(property.home_name).replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').substring(0, 30)
        : 'Property';
      const filename = `${propertyName}-${property.id || 'PDF'}.pdf`;

      // Download PDF
      pdf.save(filename);

      // Clean up
      document.body.removeChild(tempContainer);

      toast.success(
        locale === "en"
          ? "PDF downloaded successfully!"
          : "تم تحميل ملف PDF بنجاح!"
      );

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        locale === "en"
          ? "Error generating PDF"
          : "خطأ في إنشاء ملف PDF"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClick = () => {
    if (!isGenerating && isClient) {
      generatePDF();
    }
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div style={{ cursor: "pointer", opacity: 0.7 }}>
        {children}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: isGenerating ? "wait" : "pointer",
        opacity: isGenerating ? 0.7 : 1
      }}
    >
      {children}
    </div>
  );
};

export default PropertyPdfGenerator;
