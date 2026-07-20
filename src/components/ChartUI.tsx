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

export default function ChartUI({ data, loading, error }: ChartUIProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 450,
          bgcolor: '#080c14',
          borderRadius: 2,
          p: 3,
        }}
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data || !data.hourly) {
    return <Alert severity="warning">No hay datos disponibles para el gráfico.</Alert>;
  }

  // 1. Convertir el tiempo a objetos Date nativos
  const timeDates = data.hourly.time.map((t) => new Date(t));

  // 2. Cálculo de límites para los ejes Y
  const minTemp = Math.floor(Math.min(...data.hourly.temperature_2m) - 2);
  const maxTemp = Math.ceil(Math.max(...data.hourly.temperature_2m) + 2);
  const maxWind = Math.ceil(Math.max(...data.hourly.wind_speed_10m) + 2);

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#060606', fontSize: '1.2rem', fontFamily: 'sans-serif' }}
        >
          {Math.abs(data.latitude).toFixed(2)}°{data.latitude >= 0 ? 'N' : 'S'}{' '}
          {Math.abs(data.longitude).toFixed(2)}°{data.longitude >= 0 ? 'E' : 'W'}{' '}
          {data.elevation}m above sea level
        </Typography>
        <Typography variant="caption" sx={{ color: '#060606', fontSize: '0.8rem' }}>
          Generated in {data.generationtime_ms.toFixed(2)}ms, time in {data.timezone}
        </Typography>
      </Box>

      {/* Contenedor del gráfico */}
      <Box sx={{ width: '100%', height: 420 }}>
        <LineChart
          height={420}
          margin={{ left: 90, right: 30, top: 40, bottom: 40 }}
          
          // Ejes Y independientes
          yAxis={[
            {
              id: 'tempAxis',
              position: 'left',
              width: 30,
              label: '°C',
              min: minTemp,
              max: maxTemp,
            },
            {
              id: 'humidityAxis',
              position: 'left',
              width: 30,
              label: '%',
              min: 0,
              max: 100,
            },
            {
              id: 'windAxis',
              position: 'left',
              width: 30,
              label: 'km/h',
              min: 0,
              max: maxWind > 25 ? maxWind : 25,
            },
          ]}

          // Eje X continuo en UTC
          xAxis={[
            {
              scaleType: 'utc',
              data: timeDates,
              valueFormatter: (date: Date) => {
                const day = date.getUTCDate();
                const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
                return `${day} ${month}`;
              },
            },
          ]}

          // Series sincronizadas con sus respectivos ejes
          series={[
            {
              data: data.hourly.temperature_2m,
              label: 'Temperatura (°C)',
              color: '#34d399', // Verde
              yAxisId: 'tempAxis',
              showMark: false,
              curve: 'monotoneX',
            },
            {
              data: data.hourly.relative_humidity_2m,
              label: 'Humedad (%)',
              color: '#818cf8', // Morado
              yAxisId: 'humidityAxis',
              showMark: false,
              curve: 'monotoneX',
            },
            {
              data: data.hourly.wind_speed_10m,
              label: 'Viento (km/h)',
              color: '#38bdf8', // Celeste
              yAxisId: 'windAxis',
              showMark: false,
              curve: 'monotoneX',
            },
          ]}

          sx={{
            // REGLA CLAVE: Hace visible TODO el texto SVG en blanco/gris claro
            '& text': { fill: '#090a0a !important' },
            '& .MuiChartsLegend-root text': { fill: '#060606 !important' },
            // Estilos de líneas y cuadrícula
            '& .MuiChartsAxis-line': { stroke: '#060606 !important' },
            '& .MuiChartsAxis-tick': { stroke: '#060606 !important' },
            '& .MuiChartsGrid-line': { stroke: '#060606 !important' },
          }}
          grid={{ horizontal: true }}
        />
      </Box>
    </Box>
  );
}