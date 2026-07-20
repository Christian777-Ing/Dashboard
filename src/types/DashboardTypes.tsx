export interface CityOption {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type MetricId =
  | 'all'
  | 'temperature_2m'
  | 'apparent_temperature'
  | 'wind_speed_10m'
  | 'relative_humidity_2m';

export interface MetricOption {
  id: MetricId;
  label: string;
  unit: string;
  color: string;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  wind_speed_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  wind_speed_10m: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  wind_speed_10m: number[];
}

export const CITIES: CityOption[] = [
  { id: 'guayaquil', label: 'Guayaquil', latitude: -2.1962, longitude: -79.8862, timezone: 'America/Guayaquil' },
  { id: 'quito', label: 'Quito', latitude: -0.1807, longitude: -78.4678, timezone: 'America/Guayaquil' },
  { id: 'cuenca', label: 'Cuenca', latitude: -2.9001, longitude: -79.0059, timezone: 'America/Guayaquil' },
  { id: 'manta', label: 'Manta', latitude: -0.9677, longitude: -80.7089, timezone: 'America/Guayaquil' },
];

export const METRICS: MetricOption[] = [
  { id: 'all', label: 'Todas las variables', unit: '', color: '#ffffff' },
  { id: 'temperature_2m', label: 'Temperatura (2m)', unit: '°C', color: '#00e676' },
  { id: 'apparent_temperature', label: 'Temperatura Aparente', unit: '°C', color: '#3d5aff' },
  { id: 'wind_speed_10m', label: 'Velocidad del Viento', unit: 'km/h', color: '#00e5ff' },
  { id: 'relative_humidity_2m', label: 'Humedad Relativa', unit: '%', color: '#ab47bc' },
];