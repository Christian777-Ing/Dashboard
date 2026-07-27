import { Box, Typography, CircularProgress } from '@mui/material';

interface IndicatorUIProps {
  title: string;
  value?: string;
  loading?: boolean;
  error?: string;
}

export default function IndicatorUI({ title, value, loading = false, error }: IndicatorUIProps) {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 16px 30px rgba(12, 25, 55, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
          {error ? error : value ?? '--'}
        </Typography>
      )}
    </Box>
  );
}