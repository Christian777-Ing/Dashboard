import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { LineChart } from '@mui/x-charts/LineChart';

import useFetchData from '../hooks/useFetchData';

export default function ChartUI() {
  const { data, loading, error } = useFetchData();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="warning">No hay datos disponibles.</Alert>;
  }

  return (
    <>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Temperatura y velocidad del viento por hora
      </Typography>

      <LineChart
        height={350}
        xAxis={[
          {
            scaleType: 'point',
            data: data.hourly.time.map((time) => time.substring(11, 16)),
          },
        ]}
        series={[
          {
            data: data.hourly.temperature_2m,
            label: 'Temperatura (°C)',
          },
          {
            data: data.hourly.wind_speed_10m,
            label: 'Viento (km/h)',
          },
        ]}
      />
    </>
  );
}