import { render, screen } from '@testing-library/react'
import { AppHeader } from './Header'

describe('Header', () => {
  it('links the logo to /projects', () => {
    render(<AppHeader />)
    const logoLink = screen.getByAltText(/pblworks design/i).closest('a')
    expect(logoLink).toHaveAttribute('href', '/projects')
  })

  it('does not show a title by default', () => {
    render(<AppHeader />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('displays the project title when passed as a prop', () => {
    render(<AppHeader title="My Awesome Project" />)
    expect(screen.getByText('My Awesome Project')).toBeInTheDocument()
  })

  it('displays the avatar menu', () => {
    render(<AppHeader />)
    expect(
      screen.getByRole('button', { name: /open user menu/i })
    ).toBeInTheDocument()
  })
})
