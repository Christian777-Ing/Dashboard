import { useState, useEffect } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

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

export default function useFetchData(selectedOption: string | null) {
  const [data, setData] = useState<OpenMeteoResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        // Normalización para encontrar la ciudad sin importar si viene en minúsculas o mayúsculas
        const key = selectedOption ? selectedOption.trim() : 'Guayaquil';
        const cityConfig = CITY_COORDS[key] || CITY_COORDS['Guayaquil'];

        const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=auto`;

        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error(`Error HTTP (${response.status}): ${response.statusText}`);
        }

        const result: OpenMeteoResponse = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al conectar con el servicio de clima.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Garantiza que la rueda de carga SIEMPRE se apague
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedOption]);

  return { data, loading, error };
}