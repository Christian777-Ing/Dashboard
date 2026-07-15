import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

type UseFetchDataReturn = {
    data?: OpenMeteoResponse;
    loading: boolean;
    error?: string;
};

export default function useFetchData(): UseFetchDataReturn {
    const URL =
        'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m';

    const [data, setData] = useState<OpenMeteoResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const json: OpenMeteoResponse = await response.json();
                setData(json);
                setError(undefined);
            } catch (fetchError) {
                console.error(fetchError);
                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : 'Error al obtener los datos',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
}
