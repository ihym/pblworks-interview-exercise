import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { AppLayout } from '@/app/components/layout/AppLayout'

export const metadata: Metadata = {
  title: 'PBLWorks Author',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
  title: React.ReactNode
}>

export default function RootLayout({ children, title }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
              styles={{
                body: { backgroundColor: '#eaeaea' },
              }}
            />
            <AppLayout title={title}>{children}</AppLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
