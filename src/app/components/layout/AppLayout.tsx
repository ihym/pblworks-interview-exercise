import { Container } from '@mui/material'
import { AppHeader } from '@/app/components/layout/Header'

type AppLayoutProps = {
  children: React.ReactNode
  title?: React.ReactNode
}

export const AppLayout = ({ children, title = null }: AppLayoutProps) => (
  <>
    <AppHeader title={title} />
    <Container component="main" maxWidth="lg" sx={{ py: 3 }}>
      {children}
    </Container>
  </>
)
