import { NextLink } from '@/app/components/NextLink'
import {
  Alert,
  AlertTitle,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

export default function ProjectNotFoundPage() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Typography variant="h5">Project not found</Typography>
        <Typography variant="body2" color="text.secondary">
          The link might be outdated, the project may have been deleted, or you
          may not have access.
        </Typography>
        <Alert severity="warning">
          <AlertTitle>We could not find that project</AlertTitle>
          Check the URL and try again, or return to your projects.
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            component={NextLink}
            href="/projects"
            variant="contained"
            sx={{ width: 'fit-content' }}
          >
            Back to projects
          </Button>
          <Button
            component={NextLink}
            href="/"
            variant="outlined"
            sx={{ width: 'fit-content' }}
          >
            Go to dashboard
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
