'use client'

import { useState, type MouseEvent } from 'react'
import { Avatar, Menu, MenuItem, IconButton, Link } from '@mui/material'
import { NextLink } from '@/app/components/NextLink'

type AvatarMenuProps = {
  initials: string
}

const menuItems = [
  { label: 'My Account', href: '/' },
  { label: 'Settings', href: '/' },
  { label: 'Avalytics', href: '/' },
  { label: 'Logout', href: '/' },
]

export const AvatarMenu = ({ initials }: AvatarMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Open user menu"
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar>{initials}</Avatar>
      </IconButton>

      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menuItems.map(({ label, href }) => (
          <MenuItem key={label} onClick={handleClose}>
            <Link
              component={NextLink}
              href={href}
              underline="none"
              color="inherit"
            >
              {label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
