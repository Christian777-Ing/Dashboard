import { useEffect, useState } from 'react';
import { CITIES, type CityOption, type OpenMeteoResponse } from '../types/DashboardTypes';

interface UseFetchDataResult {
  data: OpenMeteoResponse | undefined;
  loading: boolean;
  error: string | undefined;
}

interface CityCoordinates {
  latitude: number;
  longitude: number;
}

const CITY_COORDS: Record<string, CityCoordinates> = Object.fromEntries(
  CITIES.flatMap((city: CityOption) => [
    [city.id, { latitude: city.latitude, longitude: city.longitude }],
    [city.label, { latitude: city.latitude, longitude: city.longitude }],
    [city.id.toLowerCase(), { latitude: city.latitude, longitude: city.longitude }],
    [city.label.toLowerCase(), { latitude: city.latitude, longitude: city.longitude }],
  ])
);

function getCityCoordinates(selectedOption: string | null): CityCoordinates {
  const normalizedOption = selectedOption?.trim();

  if (!normalizedOption) {
    return CITY_COORDS.Guayaquil ?? CITY_COORDS.guayaquil;
  }

  const directMatch = CITY_COORDS[normalizedOption];
  if (directMatch) {
    return directMatch;
  }

  const lowercaseMatch = CITY_COORDS[normalizedOption.toLowerCase()];
  if (lowercaseMatch) {
    return lowercaseMatch;
  }

  return CITY_COORDS.Guayaquil ?? CITY_COORDS.guayaquil;
}

export default function useFetchData(selectedOption: string | null): UseFetchDataResult {
  const [data, setData] = useState<OpenMeteoResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const cityConfig: CityCoordinates = getCityCoordinates(selectedOption);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP (${response.status}): ${response.statusText}`);
        }

        const result: OpenMeteoResponse = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setData(undefined);
          setError(
            err instanceof Error
              ? err.message
              : 'Error al conectar con el servicio de clima.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedOption]);

  return { data, loading, error };
}