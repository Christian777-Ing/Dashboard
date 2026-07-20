import { useState } from 'react';
import './App.css';
import { Grid, CircularProgress, Box } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import { CITIES, METRICS, type MetricId } from './types/DashboardTypes';

function App() {
  const [selectedCityId, setSelectedCityId] = useState<string>(CITIES[0].id);
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>('all');

  const currentCity = CITIES.find((c) => c.id === selectedCityId) ?? CITIES[0];
  const { data, loading, error } = useFetchData(currentCity.latitude, currentCity.longitude);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ justifyContent: 'left', alignItems: 'center' }}>

        {/* Encabezado */}
        <Grid size={{ xs: 12, md: 12 }}>
          <HeaderUI subtitle={`Monitoreo en tiempo real para ${currentCity.label}`} />
        </Grid>

        {/* Alertas */}
        <Grid size={{ xs: 12, md: 12 }}>
          <AlertUI
            title="Estado de conexión API"
            description={error ? `Error: ${error}` : `Datos sincronizados exitosamente con Open-Meteo para ${currentCity.label}.`}
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

        {/* Indicadores */}
        <Grid container size={{ xs: 12, md: 9 }} spacing={2}>
          {loading ? (
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : data ? (
            <>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <IndicatorUI
                  title="Temperatura (2m)"
                  value={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <IndicatorUI
                  title="Sensación Térmica"
                  value={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <IndicatorUI
                  title="Velocidad del Viento"
                  value={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <IndicatorUI
                  title="Humedad Relativa"
                  value={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`}
                />
              </Grid>
            </>
          ) : null}
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, md: 12 }}>
          <ChartUI
            data={data}
            loading={loading}
            error={error}
            selectedMetricId={selectedMetricId}
          />
        </Grid>

        {/* La tabla la puedes dejar abajo con ancho completo o según prefieras */}
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