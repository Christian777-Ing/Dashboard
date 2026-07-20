import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
  data?: OpenMeteoResponse;
  loading: boolean;
  error?: string;
  selectedMetricId: string;
}

export default function TableUI({ data, loading, error, selectedMetricId }: TableUIProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, bgcolor: '#fff', borderRadius: 3, p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data || !data.hourly) {
    return <Alert severity="warning">No hay datos disponibles para la tabla.</Alert>;
  }

  const rows = data.hourly.time.map((time, index) => ({
    id: index + 1,
    time: time.substring(11, 16),
    temperature: data.hourly.temperature_2m[index],
    wind: data.hourly.wind_speed_10m[index],
    humidity: data.hourly.relative_humidity_2m[index],
    apparent: data.hourly.apparent_temperature[index],
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'time', headerName: 'Hora', width: 100 },
    {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 150,
      headerClassName: selectedMetricId === 'temperature_2m' ? 'selected-header' : undefined,
    },
    {
      field: 'wind',
      headerName: 'Viento (km/h)',
      width: 140,
      headerClassName: selectedMetricId === 'wind_speed_10m' ? 'selected-header' : undefined,
    },
    {
      field: 'humidity',
      headerName: 'Humedad (%)',
      width: 140,
      headerClassName: selectedMetricId === 'relative_humidity_2m' ? 'selected-header' : undefined,
    },
    {
      field: 'apparent',
      headerName: 'Sensación (°C)',
      width: 150,
      headerClassName: selectedMetricId === 'apparent_temperature' ? 'selected-header' : undefined,
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 16px 30px rgba(12, 25, 55, 0.06)' }}>
      <Box sx={{ mb: 2 }}>
        <strong>Tabla de Pronóstico Horario</strong>
      </Box>
      <Box sx={{ height: 400, width: '100%', '& .selected-header': { color: '#1976d2', fontWeight: 700 } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Box>
    </Box>
  );
}