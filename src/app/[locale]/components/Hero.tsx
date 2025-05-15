/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import Banner from "@/components/shared/Banner";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import TransitionBox from "@/components/shared/TransitionBox";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

type PropertyType = "sale" | "rent";
type SearchFilterType = "name" | "category" | "city";

interface ToggleButtonProps {
  type: PropertyType;
  selected: PropertyType;
  onSelect: (type: PropertyType) => void;
}

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
  onSubmit: () => void;
  filterType: SearchFilterType;
  onFilterChange: (type: SearchFilterType) => void;
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
      className={`text-lg pb-2 px-4 relative transition-colors duration-300 ${selected === type ? "font-bold" : "opacity-75 hover:opacity-100"
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

const SearchInput = ({ placeholder, onSearch, onSubmit, filterType, onFilterChange }: SearchInputProps) => {
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });

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

  // Toggle dropdown with improved handler
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  // Update dropdown position when opened
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: locale !== "ar" ? rect.left + window.scrollX : 0,
        right: locale === "ar" ? window.innerWidth - rect.right + window.scrollX : 0
      });
    }
  }, [isDropdownOpen, locale]);

  // Close dropdown when clicking outside
  useEffect(() => {
    // Ensure dropdown appears by forcing it to be visible on first mount
    if (isDropdownOpen && buttonRef.current && dropdownRef.current) {
      dropdownRef.current.style.display = "block";
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const filterOptions = [
    { value: "name" as const, label: t("searchByName") },
    { value: "category" as const, label: t("searchByCategory") },
    { value: "city" as const, label: t("searchByCity") }
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className={`relative bg-white rounded-full overflow-hidden transition-shadow duration-300 ${isFocused ? "shadow-lg" : "shadow-md"
          }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className={`relative z-20 ${locale === "ar" ? "order-last" : ""}`}>
            <button
              ref={buttonRef}
              type="button"
              className={`h-full min-w-[110px] ${locale === "ar" ? "border-l" : "border-r"} border-gray-200 pl-4 pr-3 py-4 flex items-center justify-between text-gray-600 hover:text-gray-900 transition-colors`}
              onClick={toggleDropdown}
            >
              <span className="text-sm font-medium">
                {filterOptions.find(opt => opt.value === filterType)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <input
            type="text"
            placeholder={placeholder}
            className={`flex-1 px-3 py-4 text-gray-800 placeholder-gray-500 focus:outline-none`}
            aria-label="Search properties"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleSearch}
          />

          <div className={`px-4 ${locale === "ar" ? "order-first" : ""}`}>
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
        </div>
      </motion.form>

      {/* Dropdown outside the form for better visibility and z-index handling */}
      {isDropdownOpen && createPortal(
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`fixed bg-white shadow-2xl rounded-lg overflow-hidden w-48 border border-gray-200 z-[9999]`}
          style={{
            top: dropdownPosition.top,
            left: locale !== "ar" ? dropdownPosition.left : "auto",
            right: locale === "ar" ? dropdownPosition.right : "auto",
            pointerEvents: "auto"
          }}
        >
          {filterOptions.map(option => (
            <button
              key={option.value}
              type="button"
              className={`block w-full text-left px-4 py-3 text-sm ${filterType === option.value
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange(option.value);
                setIsDropdownOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </motion.div>,
        document.body
      )}
    </div>
  );
};

const Hero = () => {
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const router = useRouter();
  const [selected, setSelected] = useState<PropertyType>(PROPERTY_TYPES.RENT);
  const [searchValue, setSearchValue] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>("name");

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (searchValue.trim()) {
      const params = new URLSearchParams();

      // Add search parameter based on selected filter
      if (searchFilter === "name") {
        params.append("home_name", searchValue.trim());
      } else if (searchFilter === "category") {
        params.append("category_type", searchValue.trim());
      } else if (searchFilter === "city") {
        params.append("city", searchValue.trim());
      }

      router.push(`/search/${selected}?${params.toString()}`);
    }
  }, [router, searchValue, selected, searchFilter]);

  return (
    <Banner backgroundImage="/images/hero-bg.jpg" height="90vh">
      <TransitionBox
        transitionType="fromBottom"
        className="text-center text-white max-w-4xl mx-auto"
      >
        <TransitionBox
          transitionType="fromBottom"
          delay={0.2}
          className={`text-4xl font-extrabold mb-2 ${locale === "ar" ? "" : "font-montserrat"
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
            filterType={searchFilter}
            onFilterChange={setSearchFilter}
          />
        </TransitionBox>
      </TransitionBox>
    </Banner>
  );
};

export default Hero;
