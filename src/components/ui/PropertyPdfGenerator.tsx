/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Property } from "@/types";
import { useLocale } from "next-intl";
import { toast } from "react-hot-toast";
import { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import { usePathname } from "@/i18n/routing";

interface PropertyPdfGeneratorProps {
  property: Property;
  children: React.ReactNode;
}

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  address: {
    fontSize: 10,
    color: "#666",
    marginBottom: 15,
  },
  propertyImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    marginBottom: 15,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
    marginTop: 10,
  },
  description: {
    fontSize: 10,
    color: "#333",
    marginBottom: 15,
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    alignItems: "center",
    minHeight: 25,
  },
  tableCol: {
    width: "50%",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#333",
  },
  tableCell: {
    fontSize: 10,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 8,
    color: "#666",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Create PDF Document component
const PropertyPDF = ({
  property,
  locale,
  pathname,
}: {
  property: Property;
  locale: string;
  pathname: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo */}
      <View style={styles.header}>
        <Image src="/images/logo.png" style={styles.logo} />
        <Text style={styles.title}>€ {property.home_price || "-"}</Text>
        <Text style={styles.propertyName}>{property.home_name || "-"}</Text>
        <Text style={styles.address}>{property.address || ""}</Text>
      </View>

      {/* Property Image - Reduced height */}
      {property.media && property.media.length > 0 && (
        <Image
          src={property.media[0]?.original_url}
          style={{ ...styles.propertyImage, height: 150 }}
        />
      )}

      {/* Description with website link below it */}
      <Text style={styles.sectionTitle}>
        {locale === "en" ? "Description" : "الوصف"}
      </Text>
      <Text style={styles.description}>{property.home_description || ""}</Text>
      <Text style={{ fontSize: 8, marginBottom: 10, color: "#2e7d32" }}>
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${locale}${pathname}`}>
          {`${process.env.NEXT_PUBLIC_APP_URL}/${locale}${pathname}`}
        </Link>
      </Text>

      {/* Property Features Table */}
      <Text style={styles.sectionTitle}>
        {locale === "en" ? "Property Features" : "مميزات العقار"}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>
              {locale === "en" ? "Bedrooms" : "غرف النوم"}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {property.home_bedrooms || "-"}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>
              {locale === "en" ? "Bathrooms" : "الحمامات"}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {property.home_bathrooms || "-"}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>
              {locale === "en" ? "Area" : "المساحة"}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{property.home_area || "-"}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>
              {locale === "en" ? "Price" : "السعر"}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>€ {property.home_price || "-"}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>
              {locale === "en" ? "Reference" : "المرجع"}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{property.id || "-"}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          {locale === "en"
            ? "This document is for information purposes only."
            : "هذه الوثيقة لأغراض المعلومات فقط."}
        </Text>

        <Text>
          Ref: {property.id || "-"} - {new Date().toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
);

const PropertyPdfGenerator = ({
  property,
  children,
}: PropertyPdfGeneratorProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering for PDFDownloadLink
  // This is necessary because PDFDownloadLink uses browser APIs
  // that aren't available during server-side rendering
  useState(() => {
    setIsClient(true);
  });

  const handleClick = () => {
    toast.success(
      locale === "en"
        ? "Preparing PDF, please wait..."
        : "جاري إعداد ملف PDF، يرجى الانتظار..."
    );
  };

  if (!isClient) {
    return <div onClick={handleClick}>{children}</div>;
  }

  return (
    <PDFDownloadLink
      document={
        <PropertyPDF property={property} locale={locale} pathname={pathname} />
      }
      fileName={`property-${property.home_name || "property"}.pdf`}
      onClick={handleClick}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {({ loading }) => <div>{children}</div>}
    </PDFDownloadLink>
  );
};

export default PropertyPdfGenerator;
