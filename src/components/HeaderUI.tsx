import Typography from '@mui/material/Typography';

interface HeaderUIProps {
  subtitle?: string;
}

export default function HeaderUI({ subtitle }: HeaderUIProps) {
  return (
    <div>
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: 'bold', mb: 1 }}
      >
        Dashboard del Clima
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </div>
  );
}
