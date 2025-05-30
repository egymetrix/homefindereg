"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { clientGet } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Category, City, Government } from "@/types";

interface GovernmentResponse {
  success: boolean;
  status: number;
  message: string;
  data: Government[];
}

const CitiesFilter = ({
  activeFilter,
  setActiveFilter,
  activeCategory,
  setActiveCategory,
}: {
  activeFilter: "sale" | "rent";
  setActiveFilter: React.Dispatch<React.SetStateAction<"sale" | "rent">>;
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const locale = useLocale();
  const filters = [
    { name: "sale", label: locale === "en" ? "Sale" : "بيع" },
    { name: "rent", label: locale === "en" ? "Rent" : "إيجار" },
  ];

  const { data: categoriesResponse, isLoading } = useQuery<{
    data: Category[];
  }>({
    queryKey: ["categories", activeFilter],
    queryFn: async () => {
      return await clientGet<{ data: Category[] }>(
        `/site/get-category?type=${activeFilter}`
      );
    },
  });

  useEffect(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      setActiveCategory(categoriesResponse.data[0].id.toString());
    }
  }, [activeFilter, categoriesResponse, setActiveCategory]);

  const handleCategoryClick = (name: string) => {
    setActiveCategory(name);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-2">
        {filters.map((filter) => (
          <button
            key={filter.name}
            className={`px-6 capitalize py-2 rounded-t-lg transition-colors duration-300 ${activeFilter === filter.name
              ? "bg-white"
              : "bg-gray-100 hover:bg-gray-200"
              }`}
            onClick={() => {
              if (activeFilter !== filter.name) {
                setActiveFilter(filter.name as "sale" | "rent");
                // The category will be updated via useEffect
                if (
                  categoriesResponse?.data &&
                  categoriesResponse.data.length > 0
                ) {
                  const newCategory = categoriesResponse.data[0].id.toString();
                  setActiveCategory(newCategory);
                }
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="flex gap-8 overflow-x-auto border-b border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          categoriesResponse?.data?.map((category: Category) => (
            <button
              key={category.name}
              className={`relative whitespace-nowrap px-1 py-4 text-sm font-medium transition-colors ${activeCategory === category.id.toString()
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => handleCategoryClick(category.id.toString())}
            >
              {category.name}
              {activeCategory === category.id.toString() && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const CitiesList = ({
  activeFilter,
  activeCategory,
}: {
  activeFilter: "sale" | "rent";
  activeCategory: string;
}) => {
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  const { data: governmentsResponse, isLoading } = useQuery<GovernmentResponse>(
    {
      queryKey: ["governments", activeFilter, activeCategory],
      queryFn: async () => {
        return await clientGet<GovernmentResponse>(
          `/site/gov-city?type=${activeFilter}&category_id=${activeCategory}`
        );
      },
      enabled: !!activeFilter && !!activeCategory,
    }
  );

  const governments = governmentsResponse?.data || [];
  const displayedGovernments = showAll ? governments : governments.slice(0, 4);

  const handleCityClick = () => {
    // Removed redirect logic
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!governments.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {locale === "en" ? "No Governments Found" : "لا يوجد محافظات"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="columns-1 md:columns-2 lg:columns-4 gap-4">
        {displayedGovernments.map((government: Government) => (
          <div key={government.id} className="break-inside-avoid mb-4">
            <div className="bg-white p-3">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                {government.name}
              </h3>
              {government.cities.length > 0 ? (
                <ul className="space-y-2">
                  {government.cities.map((city: City) => (
                    <Link
                      key={city.id}
                      href={`/cities/${`${city.name}-${city.id}`}?category_id=${activeCategory}&type=${activeFilter}`}
                      className="flex items-center gap-2 py-1 px-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleCityClick()}
                    >
                      <span className="text-gray-900 text-xs bg-white px-2 py-1 rounded-full">
                        {city.count}
                      </span>
                      <span className="text-gray-700 text-sm">{city.name}</span>
                    </Link>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-2">
                  {locale === "en" ? "No Cities Found" : "لا يوجد مدن"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {!showAll && governments.length > 4 && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleShowAll} className="shadow-2xl">
            {locale === "en" ? "SHOW MORE" : "عرض المزيد"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Cities = () => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const categoryParam = searchParams.get("category");

  // Initialize state from URL parameters, but don't trigger navigation on load
  const [activeFilter, setActiveFilter] = useState<"sale" | "rent">(
    filterParam === "rent" || filterParam === "sale" ? filterParam : "sale"
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    categoryParam || ""
  );

  return (
    <section className="pb-16 -mt-10 px-4">
      <div className="container mx-auto max-w-7xl">
        <CitiesFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <CitiesList
          activeFilter={activeFilter}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
};

export default Cities;
