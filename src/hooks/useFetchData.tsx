import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

type UseFetchDataReturn = {
  data?: OpenMeteoResponse;
  loading: boolean;
  error?: string;
};

export default function useFetchData(latitude: number, longitude: number): UseFetchDataReturn {
  const [data, setData] = useState<OpenMeteoResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Error al obtener datos de Open-Meteo.');
        }

        const json: OpenMeteoResponse = await response.json();
        setData(json);
        setError(undefined);
      } catch (fetchError) {
        console.error(fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Error al conectar con la API de clima.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return { data, loading, error };
}