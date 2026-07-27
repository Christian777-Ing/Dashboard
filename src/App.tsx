import { useState } from 'react';
import './App.css';
import { Grid, Box } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import { CITIES, METRICS, type MetricId } from './types/DashboardTypes';

type IndicatorMetric = 'temperature_2m' | 'apparent_temperature' | 'wind_speed_10m' | 'relative_humidity_2m';

function App() {
  const [selectedCityId, setSelectedCityId] = useState<string>(CITIES[0].id);
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>('all');

  const currentCity = CITIES.find((c) => c.id === selectedCityId) ?? CITIES[0];
  const { data, loading, error } = useFetchData(selectedCityId);

  const getIndicatorValue = (metric: IndicatorMetric) => {
    if (!data) {
      return error ? 'Sin datos disponibles' : undefined;
    }

    return `${data.current[metric]} ${data.current_units[metric]}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ justifyContent: 'left', alignItems: 'center' }}>

        {/* Encabezado */}
        <Grid size={{ xs: 12, md: 12 }}>
          <HeaderUI subtitle={`Monitoreo en tiempo real para ${currentCity.label}`} />
        </Grid>

        {/* Estado API */}
        <Grid size={{ xs: 12, md: 12 }}>
          <AlertUI
            title="Estado de conexión API"
            description={
              error
                ? `Error: ${error}`
                : `Datos sincronizados exitosamente con Open-Meteo para ${currentCity.label}.`
            }
            severity={error ? 'error' : 'success'}
          />
        </Grid>

        {/* Selector */}
        <Grid size={{ xs: 12, md: 3 }}>
          <SelectorUI
            cities={CITIES}
            selectedCityId={selectedCityId}
            onCityChange={(cityId) => setSelectedCityId(cityId)}
            metrics={METRICS}
            selectedMetricId={selectedMetricId}
            onMetricChange={(metricId) => setSelectedMetricId(metricId)}
            disabled={loading}
          />
        </Grid>

        {/* Indicadores en tarjetas que persisten en la pantalla */}
        <Grid container size={{ xs: 12, md: 9 }} spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorUI
              title="Temperatura (2m)"
              value={getIndicatorValue('temperature_2m')}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorUI
              title="Sensación Térmica"
              value={getIndicatorValue('apparent_temperature')}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorUI
              title="Velocidad del Viento"
              value={getIndicatorValue('wind_speed_10m')}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorUI
              title="Humedad Relativa"
              value={getIndicatorValue('relative_humidity_2m')}
              loading={loading}
              error={error}
            />
          </Grid>
        </Grid>

        {/* Gráfico fija en el contenedor */}
        <Grid size={{ xs: 12, md: 12 }}>
          <ChartUI
            data={data}
            loading={loading}
            error={error}
            selectedMetricId={selectedMetricId}
          />
        </Grid>

        {/* Tabla */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TableUI
            data={data}
            loading={loading}
            error={error}
            selectedMetricId={selectedMetricId}
          />
        </Grid>

      </Grid>
    </Box>
  );
}

export default App;