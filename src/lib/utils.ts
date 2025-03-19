import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale: string = "en") {
  const currencyMap: { [key: string]: { locale: string; currency: string } } = {
    en: {
      locale: "en-US",
      currency: "EGP",
    },
    ar: {
      locale: "ar-EG",
      currency: "EGP",
    },
  };

  const { locale: numberLocale, currency } =
    currencyMap[locale] || currencyMap["en"];

  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
