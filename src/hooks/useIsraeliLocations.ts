import { useState, useEffect, useCallback } from "react";

const CITIES_RESOURCE_ID = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const STREETS_RESOURCE_ID = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const DATA_GOV_API = "https://data.gov.il/api/3/action/datastore_search";

interface City {
  id: number;
  name: string;
  code: string;
}

interface Street {
  id: number;
  name: string;
  cityCode: number;
}

interface DataGovCityRecord {
  _id: number;
  סמל_ישוב: string;
  שם_ישוב: string;
}

interface DataGovStreetRecord {
  _id: number;
  סמל_ישוב: number;
  שם_ישוב: string;
  סמל_רחוב: number;
  שם_רחוב: string;
}

// Cache for cities and streets to avoid repeated API calls
let citiesCache: City[] | null = null;
let streetsCacheByCity: Map<number, Street[]> = new Map();

export function useIsraeliCities(searchQuery: string = "") {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      // Use cache if available
      if (citiesCache) {
        const filtered = searchQuery
          ? citiesCache.filter((city) =>
              city.name.includes(searchQuery)
            )
          : citiesCache;
        setCities(filtered.slice(0, 50));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${DATA_GOV_API}?resource_id=${CITIES_RESOURCE_ID}&limit=2000`
        );
        const data = await response.json();

        if (data.success && data.result?.records) {
          const parsedCities: City[] = data.result.records
            .map((record: DataGovCityRecord) => ({
              id: record._id,
              name: record.שם_ישוב?.trim() || "",
              code: record.סמל_ישוב?.trim() || "",
            }))
            .filter((city: City) => city.name && city.name !== "לא רשום");

          citiesCache = parsedCities;

          const filtered = searchQuery
            ? parsedCities.filter((city) =>
                city.name.includes(searchQuery)
              )
            : parsedCities;
          setCities(filtered.slice(0, 50));
        }
      } catch (err) {
        setError("שגיאה בטעינת רשימת הישובים");
        console.error("Error fetching cities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { cities, isLoading, error };
}

export function useIsraeliStreets(cityName: string, searchQuery: string = "") {
  const [streets, setStreets] = useState<Street[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) {
      setStreets([]);
      return;
    }

    const fetchStreets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Search for streets in the selected city
        const searchParams = new URLSearchParams({
          resource_id: STREETS_RESOURCE_ID,
          limit: "500",
          q: cityName,
        });

        const response = await fetch(`${DATA_GOV_API}?${searchParams}`);
        const data = await response.json();

        if (data.success && data.result?.records) {
          const parsedStreets: Street[] = data.result.records
            .map((record: DataGovStreetRecord) => ({
              id: record._id,
              name: record.שם_רחוב?.trim() || "",
              cityCode: record.סמל_ישוב,
            }))
            .filter((street: Street) => street.name);

          // Filter by search query if provided
          const filtered = searchQuery
            ? parsedStreets.filter((street) =>
                street.name.includes(searchQuery)
              )
            : parsedStreets;

          // Remove duplicates and sort
          const uniqueStreets = Array.from(
            new Map(filtered.map((s) => [s.name, s])).values()
          ).sort((a, b) => a.name.localeCompare(b.name, "he"));

          setStreets(uniqueStreets.slice(0, 50));
        }
      } catch (err) {
        setError("שגיאה בטעינת רשימת הרחובות");
        console.error("Error fetching streets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchStreets, 300);
    return () => clearTimeout(timeoutId);
  }, [cityName, searchQuery]);

  return { streets, isLoading, error };
}

// Validation functions
export function validateCity(cityName: string): boolean {
  if (!citiesCache) return true; // Allow if cache not loaded
  return citiesCache.some((city) => city.name === cityName);
}

export function getCityByName(cityName: string): City | undefined {
  return citiesCache?.find((city) => city.name === cityName);
}
