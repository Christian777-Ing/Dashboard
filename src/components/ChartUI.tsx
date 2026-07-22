import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
  data?: OpenMeteoResponse;
  loading: boolean;
  error?: string;
  selectedMetricId?: string;
}

export default function ChartUI({
  data,
  loading,
  error,
  selectedMetricId = 'all',
}: ChartUIProps) {
  // Preparación de datos (si existen)
  const timeDates = data?.hourly ? data.hourly.time.map((t) => new Date(t)) : [];

  const minTemp = data?.hourly ? Math.floor(Math.min(...data.hourly.temperature_2m) - 2) : 0;
  const maxTemp = data?.hourly ? Math.ceil(Math.max(...data.hourly.temperature_2m) + 2) : 40;
  const maxWind = data?.hourly ? Math.ceil(Math.max(...data.hourly.wind_speed_10m) + 2) : 30;

  const allYAxes = [
    {
      id: 'tempAxis',
      metricId: 'temperature_2m',
      position: 'left' as const,
      width: 30,
      label: '°C',
      min: minTemp,
      max: maxTemp,
    },
    {
      id: 'humidityAxis',
      metricId: 'relative_humidity_2m',
      position: 'left' as const,
      width: 30,
      label: '%',
      min: 0,
      max: 100,
    },
    {
      id: 'windAxis',
      metricId: 'wind_speed_10m',
      position: 'left' as const,
      width: 30,
      label: 'km/h',
      min: 0,
      max: maxWind > 25 ? maxWind : 25,
    },
  ];

  const allSeries = data?.hourly
    ? [
        {
          id: 'temperature_2m',
          data: data.hourly.temperature_2m,
          label: 'Temperatura (°C)',
          color: '#34d399',
          yAxisId: 'tempAxis',
          showMark: false,
          curve: 'monotoneX' as const,
        },
        {
          id: 'relative_humidity_2m',
          data: data.hourly.relative_humidity_2m,
          label: 'Humedad (%)',
          color: '#818cf8',
          yAxisId: 'humidityAxis',
          showMark: false,
          curve: 'monotoneX' as const,
        },
        {
          id: 'wind_speed_10m',
          data: data.hourly.wind_speed_10m,
          label: 'Viento (km/h)',
          color: '#38bdf8',
          yAxisId: 'windAxis',
          showMark: false,
          curve: 'monotoneX' as const,
        },
      ]
    : [];

  const activeSeries =
    selectedMetricId === 'all'
      ? allSeries
      : allSeries.filter((s) => s.id === selectedMetricId);

  const activeYAxes =
    selectedMetricId === 'all'
      ? allYAxes
      : allYAxes.filter(
          (a) => a.metricId === selectedMetricId || selectedMetricId === 'apparent_temperature'
        );

  const leftMargin = activeYAxes.length > 1 ? 100 : 50;

  const formatXAxisLabel = (date: Date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' });
    const hour = date.getUTCHours();
    const period = hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour < 12 ? `${hour}AM` : `${hour - 12}PM`;

    return `${day} ${month} ${period}`;
  };

  const xAxisTickValues = timeDates.filter((_, index) => index === 0 || index % 12 === 0);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 16px 30px rgba(12, 25, 55, 0.08)',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Encabezado fijo del gráfico */}
      <Box sx={{ textAlign: 'center', mb: 2, minHeight: 48 }}>
        {data ? (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#080c14', fontSize: '1.2rem', fontFamily: 'sans-serif' }}
            >
              {Math.abs(data.latitude).toFixed(2)}°{data.latitude >= 0 ? 'N' : 'S'}{' '}
              {Math.abs(data.longitude).toFixed(2)}°{data.longitude >= 0 ? 'E' : 'W'}{' '}
              {data.elevation}m sobre el nivel del mar
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              Generado en {data.generationtime_ms.toFixed(2)}ms, zona horaria {data.timezone}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            Cargando información geográfica...
          </Typography>
        )}
      </Box>

      {/* Contenedor estático del gráfico con capa de carga flotante */}
      <Box sx={{ width: '100%', height: 420, position: 'relative' }}>
        {/* Capa de Carga (Overlay) */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(2px)',
              zIndex: 10,
              borderRadius: 2,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        {error && !loading && <Alert severity="error">{error}</Alert>}

        {!data && !loading && !error && (
          <Alert severity="warning">No hay datos disponibles para el gráfico.</Alert>
        )}

        {/* Gráfico persistente */}
        {data && data.hourly && (
          <LineChart
            height={420}
            margin={{ left: leftMargin, right: 30, top: 40, bottom: 40 }}
            yAxis={activeYAxes.map(({ metricId, ...axisProps }) => axisProps)}
            xAxis={[
              {
                scaleType: 'utc',
                data: timeDates,
                tickValues: xAxisTickValues,
                valueFormatter: (date: Date) => formatXAxisLabel(date),
              },
            ]}
            series={activeSeries.map(({ id, ...seriesProps }) => seriesProps)}
            grid={{ horizontal: true }}
          />
        )}
      </Box>
    </Box>
  );
}