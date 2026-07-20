import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { CityOption, MetricId, MetricOption } from '../types/DashboardTypes';

interface SelectorUIProps {
    cities: CityOption[];
    selectedCityId: string;
    onCityChange: (cityId: string) => void;
    metrics: MetricOption[];
    selectedMetricId: MetricId;
    onMetricChange: (metricId: MetricId) => void;
    disabled?: boolean;
}

export default function SelectorUI({
    cities,
    selectedCityId,
    onCityChange,
    metrics,
    selectedMetricId,
    onMetricChange,
    disabled = false,
}: SelectorUIProps) {
    const handleCityChange = (event: SelectChangeEvent<string>) => {
        onCityChange(event.target.value);
    };

    const handleMetricChange = (event: SelectChangeEvent<MetricId>) => {
        onMetricChange(event.target.value as MetricId);
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 16px 30px rgba(12, 25, 55, 0.08)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Opciones de visualización
            </Typography>
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