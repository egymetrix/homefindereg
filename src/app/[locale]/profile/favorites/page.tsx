"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import ProfileLayout from "../components/ProfileLayout";
import ProfileLoading from "../components/ProfileLoading";
import { useTranslations } from "next-intl";
import { Property } from "@/types";
import PropertyCard from "../../cities/[cityId]/components/property-card";
import { Loader2 } from "lucide-react";
import { getProperty } from "@/services/properties";

const FavoritesPage = () => {
    const { isAuthenticated, isLoading } = useAuthContext();
    const t = useTranslations("profile");
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [isLoadingProperties, setIsLoadingProperties] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            redirect("/");
        }
    }, [isLoading, isAuthenticated]);

    useEffect(() => {
        const fetchFavoriteProperties = async () => {
            try {
                // Get favorite IDs from localStorage
                const storedFavorites = localStorage.getItem("favorites");
                const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

                if (favoriteIds.length === 0) {
                    setIsLoadingProperties(false);
                    return;
                }

                // Fetch each property by ID
                const propertyPromises = favoriteIds.map(async (id: string) => {
                    try {
                        const response = await getProperty(id);
                        // Ensure data exists and has required properties
                        if (response?.data && typeof response.data.id !== 'undefined') {
                            return response.data;
                        }
                        console.error(`Invalid property data for ID ${id}`);
                        return null;
                    } catch (error) {
                        console.error(`Failed to fetch property with ID ${id}:`, error);
                        return null;
                    }
                });

                const propertiesData = await Promise.all(propertyPromises);
                // Filter out null values and ensure properties have an id
                const validProperties = propertiesData.filter(
                    (property): property is Property =>
                        property !== null &&
                        typeof property.id !== 'undefined'
                );
                setFavorites(validProperties);
            } catch (error) {
                console.error("Error fetching favorite properties:", error);
            } finally {
                setIsLoadingProperties(false);
            }
        };

        if (!isLoading && isAuthenticated) {
            fetchFavoriteProperties();
        }
    }, [isLoading, isAuthenticated]);

    // Show loading state while checking authentication
    if (isLoading) {
        return <ProfileLoading />;
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">{t("savedProperties")}</h2>

                {isLoadingProperties ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((property) => (
                            property && property.id ? (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onClick={() => { }}
                                />
                            ) : null
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">{t("noSavedProperties")}</p>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default FavoritesPage;