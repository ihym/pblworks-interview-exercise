import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Project } from '@prisma/client'
import { EditProjectForm } from './EditProjectForm'
import { updateProject } from '../actions/update-project'

jest.mock('../actions/update-project', () => ({
  updateProject: jest.fn(),
}))

const mockedUpdateProject = updateProject as jest.MockedFunction<
  typeof updateProject
>

const sampleProject: Project = {
  id: 7,
  title: 'Initial title',
  subhead: 'Initial subhead',
  description: 'Initial description',
  lastUpdated: new Date('2026-01-01T00:00:00Z'),
}

const renderForm = () => render(<EditProjectForm project={sampleProject} />)

describe('EditProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saves on Enter with the full payload including lastUpdated', async () => {
    mockedUpdateProject.mockResolvedValue(sampleProject)
    renderForm()

    const titleField = screen.getByLabelText(/project title/i)
    fireEvent.change(titleField, { target: { value: 'New title' } })
    fireEvent.submit(titleField.closest('form')!)

    await waitFor(() => expect(mockedUpdateProject).toHaveBeenCalledTimes(1))

    const payload = mockedUpdateProject.mock.calls[0][0]
    expect(payload).toMatchObject({
      id: 7,
      title: 'New title',
      subhead: 'Initial subhead',
      description: 'Initial description',
      lastUpdated: expect.any(Date),
    })
  })

  it('saves on blur with the full payload including lastUpdated', async () => {
    mockedUpdateProject.mockResolvedValue(sampleProject)
    renderForm()

    const titleField = screen.getByLabelText(/project title/i)
    fireEvent.change(titleField, { target: { value: 'New title' } })
    fireEvent.blur(titleField)

    await waitFor(() => expect(mockedUpdateProject).toHaveBeenCalledTimes(1))

    const payload = mockedUpdateProject.mock.calls[0][0]
    expect(payload).toMatchObject({
      id: 7,
      title: 'New title',
      subhead: 'Initial subhead',
      description: 'Initial description',
      lastUpdated: expect.any(Date),
    })
  })

  it('shows an error toast with retry on save failure', async () => {
    mockedUpdateProject
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(sampleProject)
    renderForm()

    const titleField = screen.getByLabelText(/project title/i)
    fireEvent.change(titleField, { target: { value: 'Will fail' } })

    await act(async () => {
      fireEvent.blur(titleField)
    })

    expect(screen.getByText(/could not save project/i)).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()

    // Retry succeeds and clears the toast
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => expect(mockedUpdateProject).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(
        screen.queryByText(/could not save project/i)
      ).not.toBeInTheDocument()
    )
  })
})
