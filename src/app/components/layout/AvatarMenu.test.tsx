import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AvatarMenu } from './AvatarMenu'

describe('AvatarMenu', () => {
  it('renders the avatar with the given initials', () => {
    render(<AvatarMenu initials="VD" />)
    expect(screen.getByText('VD')).toBeInTheDocument()
  })

  it('displays all four menu items', async () => {
    const user = userEvent.setup()
    render(<AvatarMenu initials="VD" />)

    await user.click(screen.getByRole('button', { name: /open user menu/i }))

    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(4)

    const menuItems = ['My Account', 'Settings', 'Avalytics', 'Logout']
    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('opens the menu on click and closes it when a menu item is clicked', async () => {
    const user = userEvent.setup()
    render(<AvatarMenu initials="VD" />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open user menu/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(screen.getByText('My Account'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('links all menu items to "/"', async () => {
    const user = userEvent.setup()
    render(<AvatarMenu initials="VD" />)

    await user.click(screen.getByRole('button', { name: /open user menu/i }))

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/')
    })
  })
})
