import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { CityOption, MetricId, MetricOption } from '../types/DashboardTypes';

// Defina la interfaz del prop según la Guía 17
interface SelectorUIProps {
  cities: CityOption[];
  selectedCityId: string;
  onCityChange: (cityId: string) => void;
  // Prop opcional de la guía para máxima compatibilidad
  onOptionSelect?: (option: string) => void; 
  metrics: MetricOption[];
  selectedMetricId: MetricId;
  onMetricChange: (metricId: MetricId) => void;
  disabled?: boolean;
}

export default function SelectorUI({
  cities,
  selectedCityId,
  onCityChange,
  onOptionSelect,
  metrics,
  selectedMetricId,
  onMetricChange,
  disabled = false,
}: SelectorUIProps) {

  // Handler que comunica la opción de ciudad seleccionada al componente padre
  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    
    // Notifica al padre mediante los callbacks
    onCityChange(selectedValue);
    if (onOptionSelect) {
      onOptionSelect(selectedValue);
    }
  };

  // Handler que comunica la métrica seleccionada al componente padre
  const handleMetricChange = (event: SelectChangeEvent<MetricId>) => {
    const selectedValue = event.target.value as MetricId;
    onMetricChange(selectedValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 16px 30px rgba(12, 25, 55, 0.08)' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Opciones de visualización
      </Typography>

      {/* Selector de Ciudad */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="city-select-label">Ciudad</InputLabel>
        <Select
          labelId="city-select-label"
          id="city-select"
          label="Ciudad"
          value={selectedCityId}
          onChange={handleCityChange}
          disabled={disabled}
        >
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              {city.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Selector de Métrica */}
      <FormControl fullWidth>
        <InputLabel id="metric-select-label">Métrica</InputLabel>
        <Select
          labelId="metric-select-label"
          id="metric-select"
          label="Métrica"
          value={selectedMetricId}
          onChange={handleMetricChange}
          disabled={disabled}
        >
          {metrics.map((metric) => (
            <MenuItem key={metric.id} value={metric.id}>
              {metric.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}