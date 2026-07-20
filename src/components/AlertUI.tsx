import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

interface AlertConfig {
  title?: string;
  description: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

export default function AlertUI({ title, description, severity = 'info' }: AlertConfig) {
  return (
    <Alert variant="standard" severity={severity} sx={{ alignItems: 'flex-start', p: 2 }}>
      <div>
        {title && (
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: 'inherit' }}>
          {description}
        </Typography>
      </div>
    </Alert>
  );
}
