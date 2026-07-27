import { useState, useEffect } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

export interface UseFetchDataResult {
  data: OpenMeteoResponse | undefined;
  loading: boolean;
  error: string | undefined;
}

// Diccionario que soporta IDs en minúscula, mayúscula y nombres de la Guía 17
const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  // Minúsculas (IDs comunes)
  guayaquil: { latitude: -2.1962, longitude: -79.8862 },
  quito: { latitude: -0.2298, longitude: -78.5249 },
  cuenca: { latitude: -2.9001, longitude: -79.0059 },
  manta: { latitude: -0.9677, longitude: -80.7089 },
  // Mayúsculas (Nombres de la guía)
  Guayaquil: { latitude: -2.1962, longitude: -79.8862 },
  Quito: { latitude: -0.2298, longitude: -78.5249 },
  Cuenca: { latitude: -2.9001, longitude: -79.0059 },
  Manta: { latitude: -0.9677, longitude: -80.7089 },
};

export default function useFetchData(selectedOption: string | null): UseFetchDataResult {
  const [data, setData] = useState<OpenMeteoResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setData(undefined);
      setLoading(true);
      setError(undefined);

      try {
        const normalizedOption = selectedOption?.trim() ?? 'Guayaquil';
        const normalizedKey = normalizedOption.charAt(0).toUpperCase() + normalizedOption.slice(1).toLowerCase();
        const cityConfig = CITY_COORDS[normalizedKey] || CITY_COORDS[normalizedOption] || CITY_COORDS['Guayaquil'];

        const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=auto`;

        const response = await fetch(URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Error HTTP (${response.status}): ${response.statusText}`);
        }

        const result: OpenMeteoResponse = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al conectar con el servicio de clima.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [selectedOption]);

  return { data, loading, error };
}