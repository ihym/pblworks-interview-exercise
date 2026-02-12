import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material'
import Image from 'next/image'
import { NextLink } from '@/app/components/NextLink'
import { AvatarMenu } from '@/app/components/layout/AvatarMenu'

type AppHeaderProps = {
  title?: React.ReactNode
}

export const AppHeader = ({ title = null }: AppHeaderProps) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Link
            component={NextLink}
            href="/projects"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Image
              src="/design-logo.svg"
              alt="PBLWorks Design – go to projects"
              width={200}
              height={32}
              preload
            />
          </Link>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {title ? (
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <AvatarMenu initials="VD" />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
