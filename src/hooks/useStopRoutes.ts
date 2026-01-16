import { useState, useEffect, useMemo } from "react";

interface StopRoutes {
  stop_id: string;
  routes: string[];
}

export function useStopRoutes() {
  const [stopRoutes, setStopRoutes] = useState<StopRoutes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/gtfs/stop_to_routes.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length < 2) {
          setStopRoutes([]);
          setLoading(false);
          return;
        }

        const results: StopRoutes[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // Handle CSV with quoted fields
          const match = line.match(/^(\d+),(.*)$/);
          if (match) {
            const stop_id = match[1];
            let routesStr = match[2];
            // Remove quotes if present
            if (routesStr.startsWith('"') && routesStr.endsWith('"')) {
              routesStr = routesStr.slice(1, -1);
            }
            const routes = routesStr.split(",").map((r) => r.trim()).filter(Boolean);
            results.push({ stop_id, routes });
          }
        }

        setStopRoutes(results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get routes for a specific stop
  const getRoutesForStop = useMemo(() => {
    const stopMap = new Map<string, string[]>();
    stopRoutes.forEach((sr) => stopMap.set(sr.stop_id, sr.routes));
    return (stopId: string) => stopMap.get(stopId) || [];
  }, [stopRoutes]);

  // Get all stops that have a specific route
  const getStopsForRoute = useMemo(() => {
    return (routeNumber: string) => {
      return stopRoutes
        .filter((sr) => sr.routes.includes(routeNumber))
        .map((sr) => sr.stop_id);
    };
  }, [stopRoutes]);

  return {
    stopRoutes,
    loading,
    error,
    getRoutesForStop,
    getStopsForRoute,
  };
}
