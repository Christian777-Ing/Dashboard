import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import useFetchData from '../hooks/useFetchData';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'time',
    headerName: 'Hora',
    width: 180,
  },
  {
    field: 'temperature',
    headerName: 'Temperatura (°C)',
    width: 160,
  },
  {
    field: 'wind',
    headerName: 'Viento (km/h)',
    width: 160,
  },
  {
    field: 'humidity',
    headerName: 'Humedad (%)',
    width: 160,
  },
  {
    field: 'apparent',
    headerName: 'Sensación (°C)',
    width: 170,
  },
];

export default function TableUI() {
  const { data, loading, error } = useFetchData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const rows =
    data?.hourly.time.map((time, index) => ({
      id: index,
      time,
      temperature: data.hourly.temperature_2m[index],
      wind: data.hourly.wind_speed_10m[index],
      humidity: data.hourly.relative_humidity_2m[index],
      apparent: data.hourly.apparent_temperature[index],
    })) ?? [];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </Box>
  );
}