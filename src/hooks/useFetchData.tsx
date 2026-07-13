import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

export default function useFetchData(): OpenMeteoResponse | undefined {
    const URL =
        'https://api.open-meteo.com/v1/forecast?latitude=-2.2144113&longitude=-79.8872314&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago';

    const [data, setData] = useState<OpenMeteoResponse>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const json: OpenMeteoResponse = await response.json();
                setData(json);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return data;
}