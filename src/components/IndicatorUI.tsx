import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface IndicatorUIProps {
  title: string;
  value: string;
  caption?: string;
  color?: string;
}

export default function IndicatorUI({ title, value, caption, color }: IndicatorUIProps) {
  return (
    <Card sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
      <CardContent>
        <Typography variant="h4" component="div" sx={{ color: color ?? '#111', fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: caption ? 0.5 : 0 }}>
          {title}
        </Typography>
        {caption && (
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
