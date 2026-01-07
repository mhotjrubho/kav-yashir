import { useState, useEffect, useMemo } from "react";

// GTFS Types
export interface Stop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  city: string;
}

export interface Route {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
}

export interface Agency {
  agency_id: string;
  agency_name: string;
}

// Parse city from stop_desc (format: "רחוב: ... עיר: CITY רציף: ...")
function extractCityFromDesc(desc: string): string {
  const match = desc.match(/עיר:\s*([^\s]+(?:\s+[^\s]+)?)\s*רציף:/);
  return match ? match[1].trim() : "";
}

// Parse CSV with proper handling of Hebrew and special chars
function parseCSV<T>(text: string, mapper: (row: string[]) => T): T[] {
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].replace(/^\uFEFF/, "").split(",");
  const results: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length >= headers.length) {
      results.push(mapper(values));
    }
  }

  return results;
}

export function useStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/gtfs/stops.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text, (row) => ({
          stop_id: row[0],
          stop_code: row[1],
          stop_name: row[2],
          stop_desc: row[3],
          stop_lat: parseFloat(row[4]),
          stop_lon: parseFloat(row[5]),
          city: extractCityFromDesc(row[3]),
        }));
        setStops(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { stops, loading, error };
}

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/gtfs/routes.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text, (row) => ({
          route_id: row[0],
          agency_id: row[1],
          route_short_name: row[2],
          route_long_name: row[3],
          route_desc: row[4],
        }));
        setRoutes(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { routes, loading, error };
}

export function useAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/gtfs/agency.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text, (row) => ({
          agency_id: row[0],
          agency_name: row[1],
        }));
        setAgencies(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { agencies, loading, error };
}

// Combined hook for complete GTFS data with validation helpers
export function useGtfsValidation() {
  const { stops, loading: stopsLoading } = useStops();
  const { routes, loading: routesLoading } = useRoutes();
  const { agencies, loading: agenciesLoading } = useAgencies();

  const loading = stopsLoading || routesLoading || agenciesLoading;

  // Get stop by code
  const getStopByCode = useMemo(() => {
    const stopMap = new Map<string, Stop>();
    stops.forEach((stop) => stopMap.set(stop.stop_code, stop));
    return (code: string) => stopMap.get(code);
  }, [stops]);

  // Validate stop code exists
  const isValidStopCode = useMemo(() => {
    const stopCodes = new Set(stops.map((s) => s.stop_code));
    return (code: string) => stopCodes.has(code);
  }, [stops]);

  // Get unique line numbers
  const allLineNumbers = useMemo(() => {
    const lineSet = new Set<string>();
    routes.forEach((r) => {
      if (r.route_short_name) {
        lineSet.add(r.route_short_name);
      }
    });
    return Array.from(lineSet).sort((a, b) => {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      return numA - numB;
    });
  }, [routes]);

  // Get routes by line number
  const getRoutesByLineNumber = useMemo(() => {
    const lineMap = new Map<string, Route[]>();
    routes.forEach((route) => {
      const existing = lineMap.get(route.route_short_name) || [];
      existing.push(route);
      lineMap.set(route.route_short_name, existing);
    });
    return (lineNumber: string) => lineMap.get(lineNumber) || [];
  }, [routes]);

  // Get operators for a line number
  const getOperatorsForLine = useMemo(() => {
    return (lineNumber: string) => {
      const lineRoutes = getRoutesByLineNumber(lineNumber);
      const operatorIds = new Set(lineRoutes.map((r) => r.agency_id));
      return agencies.filter((a) => operatorIds.has(a.agency_id));
    };
  }, [getRoutesByLineNumber, agencies]);

  // Get alternatives (origin-destination) for a line and operator
  const getAlternatives = useMemo(() => {
    return (lineNumber: string, operatorId?: string) => {
      let lineRoutes = getRoutesByLineNumber(lineNumber);
      if (operatorId) {
        lineRoutes = lineRoutes.filter((r) => r.agency_id === operatorId);
      }
      // Extract unique origin-destination from route_long_name
      const alternatives = lineRoutes
        .map((r) => {
          // Format: "origin<->destination-city-direction"
          const match = r.route_long_name.match(/(.+)<->(.+)-\d+#?/);
          if (match) {
            return {
              value: r.route_id,
              label: `${match[1].trim()} ⟷ ${match[2].trim()}`,
              origin: match[1].trim(),
              destination: match[2].trim(),
            };
          }
          return {
            value: r.route_id,
            label: r.route_long_name,
            origin: "",
            destination: "",
          };
        })
        .filter(
          (alt, index, arr) =>
            arr.findIndex((a) => a.label === alt.label) === index
        );
      return alternatives;
    };
  }, [getRoutesByLineNumber]);

  // Get cities for a line (extracted from route_long_name)
  const getCitiesForLine = useMemo(() => {
    return (lineNumber: string) => {
      const lineRoutes = getRoutesByLineNumber(lineNumber);
      const cities = new Set<string>();
      lineRoutes.forEach((route) => {
        // Extract city from route_long_name
        const match = route.route_long_name.match(/-([^-<>]+)-\d+#?$/);
        if (match) {
          cities.add(match[1].trim());
        }
        // Also try to extract from both ends
        const parts = route.route_long_name.split("<->");
        parts.forEach((part) => {
          const cityMatch = part.match(/-([^-]+)$/);
          if (cityMatch) {
            cities.add(cityMatch[1].replace(/[-\d#]+$/, "").trim());
          }
        });
      });
      return Array.from(cities).filter((c) => c.length > 1).sort();
    };
  }, [getRoutesByLineNumber]);

  return {
    stops,
    routes,
    agencies,
    loading,
    getStopByCode,
    isValidStopCode,
    allLineNumbers,
    getRoutesByLineNumber,
    getOperatorsForLine,
    getAlternatives,
    getCitiesForLine,
  };
}
