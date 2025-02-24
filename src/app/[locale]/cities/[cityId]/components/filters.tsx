/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  Loader2,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/services/api";
import { useLocale } from "next-intl";
import { Category } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

interface FilterState {
  type: "sale" | "rent";
  category_type: string;
  min_price: string;
  max_price: string;
  min_area: string;
  max_area: string;
  home_bathrooms: string;
  home_kitchens: string;
  home_name: string;
}

interface CustomSelectProps {
  name: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  isLoading?: boolean;
}

interface RangeFilterProps {
  title: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder: string;
  maxPlaceholder: string;
  formatValue: (min: string, max: string) => string;
  icon?: React.ReactNode;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
}

const formatPrice = (value: string) =>
  value ? `$${Number(value).toLocaleString()}` : "";

const formatArea = (value: string) => (value ? `${value} m²` : "");

const updateSearchParams = (
  searchParams: URLSearchParams,
  pathname: string,
  router: any,
  updates: Record<string, string | null>
) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  router.push(`${pathname}?${params.toString()}`);
};

// Components
const CustomSelect = ({
  placeholder,
  value,
  onChange,
  options,
  isLoading,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent group-hover:border-primary/40"
      >
        <span className="text-sm font-medium">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : value ? (
            options.find((opt) => opt.value === value)?.label
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !isLoading && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg rounded-lg py-1 overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    value === option.value
                      ? "text-primary font-medium bg-primary/5"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, icon, error, label, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              icon ? "pl-10" : ""
            } ${
              error ? "border-red-500" : "hover:border-primary/40"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

const RangeFilter = ({
  title,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
  formatValue,
  icon,
}: RangeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localMinValue, setLocalMinValue] = useState(minValue);
  const [localMaxValue, setLocalMaxValue] = useState(maxValue);

  const debouncedMinValue = useDebounce(localMinValue, 500);
  const debouncedMaxValue = useDebounce(localMaxValue, 500);

  useEffect(() => {
    if (debouncedMinValue !== minValue) {
      onMinChange(debouncedMinValue);
    }
  }, [debouncedMinValue, onMinChange, minValue]);

  useEffect(() => {
    if (debouncedMaxValue !== maxValue) {
      onMaxChange(debouncedMaxValue);
    }
  }, [debouncedMaxValue, onMaxChange, maxValue]);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent group-hover:border-primary/40"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className="text-sm font-medium">
            {minValue || maxValue ? formatValue(minValue, maxValue) : title}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-4"
            >
              <div className="flex gap-2">
                <CustomInput
                  type="number"
                  min="0"
                  placeholder={minPlaceholder}
                  value={localMinValue}
                  onChange={(e) => setLocalMinValue(e.target.value)}
                />
                <CustomInput
                  type="number"
                  min="0"
                  placeholder={maxPlaceholder}
                  value={localMaxValue}
                  onChange={(e) => setLocalMaxValue(e.target.value)}
                />
              </div>
            </motion.div>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("filters");
  const isRTL = locale === "ar";

  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => ({
    type: (searchParams.get("type") as "sale" | "rent") || "sale",
    category_type: searchParams.get("category_type") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    min_area: searchParams.get("min_area") || "",
    max_area: searchParams.get("max_area") || "",
    home_bathrooms: searchParams.get("home_bathrooms") || "",
    home_kitchens: searchParams.get("home_kitchens") || "",
    home_name: searchParams.get("home_name") || "",
  }));

  // Update initial state of localFilters to match URL params
  const [localFilters, setLocalFilters] = useState({
    home_name: searchParams.get("home_name") || "",
    home_bathrooms: searchParams.get("home_bathrooms") || "",
    home_kitchens: searchParams.get("home_kitchens") || "",
  });

  // Debounce the local filter values
  const debouncedFilters = useDebounce(localFilters, 500);

  // Fetch categories
  const { data: categoriesResponse, isLoading } = useQuery<{
    data: Category[];
  }>({
    queryKey: ["categories", filters.type],
    queryFn: async () => {
      return await clientGet<{ data: Category[] }>(
        `/site/get-category?type=${filters.type}`,
        locale
      );
    },
  });

  // Update URL and state
  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      updateSearchParams(searchParams, pathname, router, { [key]: value });
    },
    [searchParams, router, pathname]
  );

  // Update URL when debounced values change with proper dependencies
  useEffect(() => {
    const updates: Partial<Record<keyof FilterState, string>> = {};

    if (debouncedFilters.home_name !== filters.home_name) {
      updates.home_name = debouncedFilters.home_name;
    }
    if (debouncedFilters.home_bathrooms !== filters.home_bathrooms) {
      updates.home_bathrooms = debouncedFilters.home_bathrooms;
    }
    if (debouncedFilters.home_kitchens !== filters.home_kitchens) {
      updates.home_kitchens = debouncedFilters.home_kitchens;
    }

    if (Object.keys(updates).length > 0) {
      Object.entries(updates).forEach(([key, value]) => {
        updateFilter(key as keyof FilterState, value);
      });
    }
  }, [debouncedFilters, filters, updateFilter]);

  // Sync localFilters with filters when URL params change
  useEffect(() => {
    setLocalFilters({
      home_name: filters.home_name,
      home_bathrooms: filters.home_bathrooms,
      home_kitchens: filters.home_kitchens,
    });
  }, [filters.home_name, filters.home_bathrooms, filters.home_kitchens]);

  // Add state for active filters count
  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      type: filters.type,
      category_type: filters.category_type,
      min_price: null,
      max_price: null,
      min_area: null,
      max_area: null,
      home_bathrooms: null,
      home_kitchens: null,
      home_name: null,
    };

    setFilters({
      ...defaultFilters,
      min_price: "",
      max_price: "",
      min_area: "",
      max_area: "",
      home_bathrooms: "",
      home_kitchens: "",
      home_name: "",
    });

    updateSearchParams(searchParams, pathname, router, defaultFilters);
  }, [filters.type, filters.category_type, router, pathname, searchParams]);

  return (
    <div className="bg-white shadow-sm border-y sticky top-[69px] z-[99]">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all duration-200 group"
            >
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                </div>
                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-sm font-medium">{t("filters")}</span>
                  <span className="text-xs text-gray-500">
                    {activeFiltersCount > 0
                      ? t("filtersApplied", { count: activeFiltersCount })
                      : t("noFilters")}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t("clearAll")}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <CustomSelect
              name="propertyType"
              placeholder={t("selectType")}
              value={filters.type}
              onChange={(value) => updateFilter("type", value)}
              options={[
                { value: "sale", label: t("sale") },
                { value: "rent", label: t("rent") },
              ]}
            />

            <CustomSelect
              name="category"
              placeholder={t("propertyType")}
              value={filters.category_type}
              onChange={(value) => updateFilter("category_type", value)}
              options={
                categoriesResponse?.data?.map((category) => ({
                  value: category.name,
                  label: category.name,
                })) || []
              }
              isLoading={isLoading}
            />

            <RangeFilter
              title={t("priceRange")}
              minValue={filters.min_price}
              maxValue={filters.max_price}
              onMinChange={(value) => updateFilter("min_price", value)}
              onMaxChange={(value) => updateFilter("max_price", value)}
              minPlaceholder={t("minPrice")}
              maxPlaceholder={t("maxPrice")}
              formatValue={(min, max) =>
                min && max
                  ? `${formatPrice(min)} - ${formatPrice(max)}`
                  : min
                  ? t("fromPrice", { price: formatPrice(min) })
                  : max
                  ? t("upToPrice", { price: formatPrice(max) })
                  : t("priceRange")
              }
              icon={<span className="text-sm font-medium">$</span>}
            />

            <RangeFilter
              title={t("surfaceArea")}
              minValue={filters.min_area}
              maxValue={filters.max_area}
              onMinChange={(value) => updateFilter("min_area", value)}
              onMaxChange={(value) => updateFilter("max_area", value)}
              minPlaceholder={t("minArea")}
              maxPlaceholder={t("maxArea")}
              formatValue={(min, max) =>
                min && max
                  ? `${formatArea(min)} - ${formatArea(max)}`
                  : min
                  ? t("fromArea", { area: formatArea(min) })
                  : max
                  ? t("upToArea", { area: formatArea(max) })
                  : t("surfaceArea")
              }
            />
          </div>

          <div className="flex justify-center mt-2 mb-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 group"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t("advancedFilters")}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 group-hover:text-gray-900 ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showAdvancedFilters && (
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-2 px-2">
                    <CustomInput
                      type="text"
                      placeholder={t("searchByPropertyName")}
                      value={localFilters.home_name}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          home_name: e.target.value,
                        }))
                      }
                      icon={<Search className="w-4 h-4" />}
                    />
                    <CustomInput
                      type="number"
                      min="0"
                      placeholder={t("bathrooms")}
                      value={localFilters.home_bathrooms}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          home_bathrooms: e.target.value,
                        }))
                      }
                    />
                    <CustomInput
                      type="number"
                      min="0"
                      placeholder={t("kitchens")}
                      value={localFilters.home_kitchens}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          home_kitchens: e.target.value,
                        }))
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 top-[72px] z-[99999] lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <div
              className={`fixed inset-x-0 top-[72px] bottom-0 bg-white overflow-y-auto ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b z-10">
                <h2 className="text-lg font-semibold">{t("filters")}</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <CustomSelect
                  name="propertyType"
                  placeholder={t("selectType")}
                  value={filters.type}
                  onChange={(value) => updateFilter("type", value)}
                  options={[
                    { value: "sale", label: t("sale") },
                    { value: "rent", label: t("rent") },
                  ]}
                />

                <CustomSelect
                  name="category"
                  placeholder={t("propertyType")}
                  value={filters.category_type}
                  onChange={(value) => updateFilter("category_type", value)}
                  options={
                    categoriesResponse?.data?.map((category) => ({
                      value: category.name,
                      label: category.name,
                    })) || []
                  }
                  isLoading={isLoading}
                />

                <RangeFilter
                  title={t("priceRange")}
                  minValue={filters.min_price}
                  maxValue={filters.max_price}
                  onMinChange={(value) => updateFilter("min_price", value)}
                  onMaxChange={(value) => updateFilter("max_price", value)}
                  minPlaceholder={t("minPrice")}
                  maxPlaceholder={t("maxPrice")}
                  formatValue={(min, max) =>
                    min && max
                      ? `${formatPrice(min)} - ${formatPrice(max)}`
                      : min
                      ? t("fromPrice", { price: formatPrice(min) })
                      : max
                      ? t("upToPrice", { price: formatPrice(max) })
                      : t("priceRange")
                  }
                  icon={<span className="text-sm font-medium">$</span>}
                />

                <RangeFilter
                  title={t("surfaceArea")}
                  minValue={filters.min_area}
                  maxValue={filters.max_area}
                  onMinChange={(value) => updateFilter("min_area", value)}
                  onMaxChange={(value) => updateFilter("max_area", value)}
                  minPlaceholder={t("minArea")}
                  maxPlaceholder={t("maxArea")}
                  formatValue={(min, max) =>
                    min && max
                      ? `${formatArea(min)} - ${formatArea(max)}`
                      : min
                      ? t("fromArea", { area: formatArea(min) })
                      : max
                      ? t("upToArea", { area: formatArea(max) })
                      : t("surfaceArea")
                  }
                />

                <CustomInput
                  type="number"
                  label={t("bathrooms")}
                  value={localFilters.home_bathrooms}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      home_bathrooms: e.target.value,
                    }))
                  }
                />

                <CustomInput
                  type="number"
                  label={t("kitchens")}
                  value={localFilters.home_kitchens}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      home_kitchens: e.target.value,
                    }))
                  }
                />

                <div className="relative">
                  <CustomInput
                    type="text"
                    label={t("propertyName")}
                    placeholder={t("searchByPropertyName")}
                    value={localFilters.home_name}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        home_name: e.target.value,
                      }))
                    }
                    className={isRTL ? "pr-10" : "pl-10"}
                  />
                  <Search
                    className={`w-4 h-4 text-gray-500 absolute top-[34px] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
