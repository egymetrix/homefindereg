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
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/services/api";
import { Category } from "@/types";

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
  selectedType: PropertyType;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onCategorySelected?: (category: string) => void;
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

const SearchInput = ({
  placeholder,
  onSearch,
  onSubmit,
  filterType,
  onFilterChange,
  selectedType,
  selectedCategory,
  onCategorySelect,
  onCategorySelected
}: SearchInputProps) => {
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const categoryInputRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });
  const [categoryDropdownPosition, setCategoryDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [inputValue, setInputValue] = useState("");

  // Fetch categories when filter type is "category"
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery<{
    data: Category[];
  }>({
    queryKey: ["categories", selectedType, locale, filterType],
    queryFn: async () => {
      if (filterType !== "category") return { data: [] };
      return await clientGet<{ data: Category[] }>(
        `/site/get-category?type=${selectedType}&locale=${locale}`
      );
    },
    enabled: filterType === "category",
  });

  const categories = categoriesResponse?.data || [];

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (filterType !== "category") {
        onSearch(e.target.value);
      }
    },
    [onSearch, filterType]
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

  // Toggle category dropdown
  const toggleCategoryDropdown = (e: React.MouseEvent) => {
    if (filterType === "category") {
      e.preventDefault();
      e.stopPropagation();
      setIsCategoryDropdownOpen(prev => !prev);
    }
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

  // Update category dropdown position
  useEffect(() => {
    if (isCategoryDropdownOpen && categoryInputRef.current) {
      const rect = categoryInputRef.current.getBoundingClientRect();
      setCategoryDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isCategoryDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
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

      if (
        isCategoryDropdownOpen &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isCategoryDropdownOpen]);

  const filterOptions = [
    { value: "name" as const, label: t("searchByName") },
    { value: "category" as const, label: t("searchByCategory") },
    { value: "city" as const, label: t("searchByCity") }
  ];

  // Handle category selection directly
  const handleCategoryItemClick = (categoryName: string) => {
    onCategorySelect(categoryName);
    setIsCategoryDropdownOpen(false);

    // Trigger automatic redirection when a category is selected
    if (onCategorySelected) {
      onCategorySelected(categoryName);
    }
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-4 lg:px-0">
      <motion.form
        onSubmit={handleSubmit}
        className={`relative bg-white rounded-lg sm:rounded-xl lg:rounded-full overflow-hidden transition-shadow duration-300 ${isFocused ? "shadow-lg" : "shadow-md"
          }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
          {/* Filter Type Button */}
          <div className={`relative z-20 ${locale === "ar" ? "sm:order-last" : ""}`}>
            <button
              ref={buttonRef}
              type="button"
              className={`h-full w-full sm:min-w-[90px] md:min-w-[110px] ${locale === "ar" ? "sm:border-l" : "sm:border-r"
                } sm:border-gray-200 border-b sm:border-b-0 border-gray-200 pl-2 sm:pl-3 md:pl-4 pr-2 sm:pr-3 py-2 sm:py-3 md:py-4 flex items-center justify-between text-gray-600 hover:text-gray-900 transition-colors touch-manipulation`}
              onClick={(e) => {
                toggleDropdown(e);
              }}
            >
              <span className="text-xs sm:text-sm font-medium truncate">
                {filterOptions.find(opt => opt.value === filterType)?.label}
              </span>
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Search Input / Category Selector */}
          <div className="flex-1 flex items-center min-w-0">
            {filterType === "category" ? (
              <div
                ref={categoryInputRef}
                className="flex-1 px-2 sm:px-3 py-2 sm:py-3 md:py-4 cursor-pointer relative touch-manipulation min-w-0"
                onClick={(e) => {
                  toggleCategoryDropdown(e);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-gray-800 truncate flex-1 min-w-0 text-xs sm:text-sm md:text-base">
                    {selectedCategory || <span className="text-gray-500">{placeholder}</span>}
                  </div>
                  <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 flex-shrink-0 text-gray-500 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder={placeholder}
                className={`flex-1 px-2 sm:px-3 py-2 sm:py-3 md:py-4 text-gray-800 placeholder-gray-500 focus:outline-none min-w-0 text-xs sm:text-sm md:text-base`}
                aria-label="Search properties"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleSearch}
                value={inputValue}
              />
            )}
          </div>

          {/* Search Button */}
          <div className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-0 ${locale === "ar" ? "sm:order-first" : ""} flex justify-center sm:justify-start`}>
            <motion.button
              type="submit"
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 touch-manipulation"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600"
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

      {/* Filter type dropdown */}
      {isDropdownOpen && createPortal(
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 z-[99999] w-32 sm:w-40 md:w-48"
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
              className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm touch-manipulation ${filterType === option.value
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange(option.value);
                setIsDropdownOpen(false);

                // Reset category selection when changing filter type
                if (option.value === "category") {
                  onCategorySelect("");
                  setInputValue("");
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </motion.div>,
        document.body
      )}

      {/* Category dropdown */}
      {isCategoryDropdownOpen && filterType === "category" && createPortal(
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 z-[99999] max-h-48 sm:max-h-60 overflow-y-auto w-32 sm:w-40 md:w-48"
          style={{
            top: categoryDropdownPosition.top,
            left: categoryDropdownPosition.left,
            pointerEvents: "auto"
          }}
        >
          {isCategoriesLoading ? (
            <div className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-500 text-center">
              {t("loading")}...
            </div>
          ) : categories.length > 0 ? (
            categories.map(category => {
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm touch-manipulation ${selectedCategory === category.name
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCategoryItemClick(category.id.toString());
                  }}
                >
                  <span className="truncate block">{category.name}</span>
                </button>
              );
            })
          ) : (
            <div className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-500 text-center">
              {t("noCategories")}
            </div>
          )}
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
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const params = new URLSearchParams();

    // Add search parameter based on selected filter
    if (searchFilter === "name" && searchValue.trim()) {
      params.append("home_name", searchValue.trim());
    } else if (searchFilter === "category" && selectedCategory) {
      params.append("category_id", selectedCategory);
    } else if (searchFilter === "city" && searchValue.trim()) {
      params.append("city_name", searchValue.trim());
    } else {
      return;
    }

    router.push(`/search?${params.toString()}&type=${selected}`);
  }, [router, searchValue, selectedCategory, selected, searchFilter]);

  // Function to handle category selection and auto-redirect
  const handleCategorySelected = useCallback((categoryId: string) => {
    const params = new URLSearchParams();
    params.append("category_id", categoryId);
    params.append("type", selected);
    router.push(`/search?${params.toString()}`);
  }, [router, selected]);

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
            selectedType={selected}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onCategorySelected={handleCategorySelected}
          />
        </TransitionBox>
      </TransitionBox>
    </Banner>
  );
};

export default Hero;
