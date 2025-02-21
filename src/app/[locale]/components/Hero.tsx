/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import Banner from "@/components/shared/Banner";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import TransitionBox from "@/components/shared/TransitionBox";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

type PropertyType = "sale" | "rent";

interface ToggleButtonProps {
  type: PropertyType;
  selected: PropertyType;
  onSelect: (type: PropertyType) => void;
}

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
  onSubmit: () => void;
}

const PROPERTY_TYPES = {
  SALE: "sale" as const,
  RENT: "rent" as const,
} as const;

const ToggleButton = ({ type, selected, onSelect }: ToggleButtonProps) => {
  const t = useTranslations("home.hero");
  return (
    <motion.button
      onClick={() => onSelect(type)}
      className={`text-lg pb-2 px-4 relative transition-colors duration-300 ${
        selected === type ? "font-bold" : "opacity-75 hover:opacity-100"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-pressed={selected === type}
      role="tab"
      aria-selected={selected === type}
    >
      {t(type).toUpperCase()}
      {selected === type && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const SearchInput = ({ placeholder, onSearch, onSubmit }: SearchInputProps) => {
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative max-w-2xl mx-auto bg-white rounded-full overflow-hidden transition-shadow duration-300 ${
        isFocused ? "shadow-lg" : "shadow-md"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-4 pr-4 py-4 text-gray-800 placeholder-gray-500 focus:outline-none ${
          locale === "ar" ? "pl-4 pr-4" : ""
        }`}
        aria-label="Search properties"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleSearch}
      />
      <div
        className={`absolute ${
          locale === "en" ? "right-4" : "left-4"
        } top-1/2 transform -translate-y-1/2`}
      >
        <motion.button
          type="submit"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Search"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </motion.button>
      </div>
    </motion.form>
  );
};

const Hero = () => {
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const router = useRouter();
  const [selected, setSelected] = useState<PropertyType>(PROPERTY_TYPES.RENT);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (searchValue.trim()) {
      router.push(
        `/search/${selected}?home_name=${encodeURIComponent(
          searchValue.trim()
        )}`
      );
    }
  }, [router, searchValue, selected]);

  return (
    <Banner backgroundImage="/images/hero-bg.jpg" height="90vh">
      <TransitionBox
        transitionType="fromBottom"
        className="text-center text-white max-w-4xl mx-auto"
      >
        <TransitionBox
          transitionType="fromBottom"
          delay={0.2}
          className={`text-4xl font-extrabold mb-2 ${
            locale === "ar" ? "" : "font-montserrat"
          } drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}
        >
          {t("title")}
        </TransitionBox>

        <TransitionBox
          transitionType="fromBottom"
          delay={0.4}
          className="text-xl mb-8 opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
        >
          {t("almost")}
        </TransitionBox>

        <TransitionBox delay={0.6}>
          <div className="flex justify-center mb-8 relative">
            <div
              className="flex relative drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              role="tablist"
            >
              <div className="absolute w-full h-0.5 bg-white/30 bottom-0" />
              <ToggleButton
                type={PROPERTY_TYPES.RENT}
                selected={selected}
                onSelect={setSelected}
              />
              <ToggleButton
                type={PROPERTY_TYPES.SALE}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>
        </TransitionBox>

        <TransitionBox transitionType="fromBottom" delay={0.8}>
          <SearchInput
            placeholder={t("placeholder")}
            onSearch={handleSearch}
            onSubmit={handleSearchSubmit}
          />
        </TransitionBox>
      </TransitionBox>
    </Banner>
  );
};

export default Hero;
