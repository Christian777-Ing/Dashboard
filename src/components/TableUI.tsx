import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
  data?: OpenMeteoResponse;
  loading: boolean;
  error?: string;
  selectedMetricId: string;
}

export default function TableUI({ data, loading, error, selectedMetricId }: TableUIProps) {
  // Procesamiento seguro de datos
  const rows = data?.hourly
    ? data.hourly.time.map((time, index) => {
        const date = new Date(time);
        const day = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          timeZone: 'UTC',
        });
        const hour = date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        });

        return {
          id: index + 1,
          time: `${day} ${hour}`,
          temperature: data.hourly.temperature_2m?.[index] ?? null,
          wind: data.hourly.wind_speed_10m?.[index] ?? null,
          humidity: data.hourly.relative_humidity_2m?.[index] ?? null,
          apparent: data.hourly.apparent_temperature?.[index] ?? null,
        };
      })
    : [];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'time', headerName: 'Día y Hora', width: 140 },
    {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 160,
      headerClassName: selectedMetricId === 'temperature_2m' ? 'selected-header' : undefined,
    },
    {
      field: 'wind',
      headerName: 'Viento (km/h)',
      width: 150,
      headerClassName: selectedMetricId === 'wind_speed_10m' ? 'selected-header' : undefined,
    },
    {
      field: 'humidity',
      headerName: 'Humedad (%)',
      width: 150,
      headerClassName: selectedMetricId === 'relative_humidity_2m' ? 'selected-header' : undefined,
    },
    {
      field: 'apparent',
      headerName: 'Sensación (°C)',
      width: 160,
      headerClassName: selectedMetricId === 'apparent_temperature' ? 'selected-header' : undefined,
    },
  ];

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: '0 16px 30px rgba(12, 25, 55, 0.06)',
        position: 'relative',
      }}
    >
      {/* Título de la sección */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: '1.1rem' }}>
        Tabla de Pronóstico Horario
      </Typography>

      <Box
        sx={{
          height: 400,
          width: '100%',
          position: 'relative',
          '& .selected-header': { color: '#1976d2', fontWeight: 700 },
        }}
      >
        {/* Capa de Carga (Overlay) flotante que mantiene el diseño visible */}
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

        {/* Notificación de Error */}
        {error && !loading && <Alert severity="error">{error}</Alert>}

        {/* Notificación de falta de datos */}
        {!data && !loading && !error && (
          <Alert severity="warning">No hay datos disponibles para la tabla.</Alert>
        )}

        {/* Rendimiento continuo del DataGrid */}
        {(data || loading) && (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: 2,
            }}
          />
        )}
      </Box>
    </Box>
  );
}