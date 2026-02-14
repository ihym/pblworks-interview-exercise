import { renderHook, act } from '@testing-library/react'
import { useAutosave } from './useAutosave'

type Payload = { title: string }
type Options = Parameters<typeof useAutosave<Payload, Payload>>[0]

const defaultOptions: Options = {
  payload: { title: 'original' },
  onSave: jest.fn().mockResolvedValue({ title: 'saved' }),
  onSuccess: jest.fn(),
  onError: jest.fn(),
}

const renderAutosave = (overrides?: Partial<Options>) => {
  const options = { ...defaultOptions, ...overrides }
  const hook = renderHook((props: Options) => useAutosave(props), {
    initialProps: options,
  })

  return { options, ...hook }
}

describe('useAutosave', () => {
  it('calls onSave and onSuccess when save is called with a new payload', async () => {
    const { options, result, rerender } = renderAutosave()

    rerender({ ...options, payload: { title: 'updated' } })

    await act(async () => {
      result.current.save()
    })

    expect(options.onSave).toHaveBeenCalledWith({ title: 'updated' })
    expect(options.onSuccess).toHaveBeenCalledWith({ title: 'saved' })
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('skips save when payload matches the initial payload', async () => {
    const { options, result } = renderAutosave()

    await act(async () => {
      result.current.save()
    })

    expect(options.onSave).not.toHaveBeenCalled()
  })

  it('skips save when payload matches the last saved payload', async () => {
    const { options, result, rerender } = renderAutosave()

    rerender({ ...options, payload: { title: 'updated' } })

    await act(async () => {
      result.current.save()
    })

    expect(options.onSave).toHaveBeenCalledTimes(1)

    // Try saving the same thing again
    await act(async () => {
      result.current.save()
    })

    // Should not have fired a second save
    expect(options.onSave).toHaveBeenCalledTimes(1)
  })

  it('sets isSaving to true while save is in-flight', async () => {
    const { promise, resolve } = Promise.withResolvers<Payload>()
    const onSave = jest.fn(() => promise)
    const { result, rerender } = renderAutosave({ onSave })

    expect(result.current.isSaving).toBe(false)

    rerender({ payload: { title: 'pending' }, onSave })

    act(() => {
      result.current.save()
    })

    expect(result.current.isSaving).toBe(true)

    await act(async () => {
      resolve({ title: 'done' })
    })

    expect(result.current.isSaving).toBe(false)
  })

  it('calls onError when save throws and does not update lastSavedPayload', async () => {
    const error = new Error('network failure')
    const onSave = jest.fn().mockRejectedValue(error)
    const { options, result, rerender } = renderAutosave({ onSave })

    rerender({ ...options, onSave, payload: { title: 'will fail' } })

    await act(async () => {
      result.current.save()
    })

    expect(options.onError).toHaveBeenCalledWith(error)
    expect(options.onSuccess).not.toHaveBeenCalled()

    // Since save failed, saving the same payload again should work (not be skipped)
    onSave.mockResolvedValueOnce({ title: 'will fail' })
    await act(async () => {
      result.current.save()
    })

    expect(onSave).toHaveBeenCalledTimes(2)
  })

  it('aborts stale save — onSuccess from first save is suppressed', async () => {
    const { promise: firstPromise, resolve: resolveFirst } =
      Promise.withResolvers<Payload>()

    const onSave = jest
      .fn()
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({ title: 'second' })

    const { options, result, rerender } = renderAutosave({ onSave })

    // Fire first save (will hang)
    rerender({ ...options, onSave, payload: { title: 'first' } })

    act(() => {
      result.current.save()
    })

    expect(onSave).toHaveBeenCalledTimes(1)

    // Fire second save — aborts the first
    rerender({ ...options, onSave, payload: { title: 'second' } })

    await act(async () => {
      result.current.save()
    })

    expect(onSave).toHaveBeenCalledTimes(2)
    expect(options.onSuccess).toHaveBeenCalledTimes(1)
    expect(options.onSuccess).toHaveBeenCalledWith({ title: 'second' })

    // Now let the first save resolve — its onSuccess should NOT fire again
    await act(async () => {
      resolveFirst({ title: 'stale first' })
      await firstPromise
    })

    // onSuccess should still only have been called once (from the second save)
    expect(options.onSuccess).toHaveBeenCalledTimes(1)
  })

  it('does not call onError for aborted saves that reject', async () => {
    const { promise: firstPromise, reject: rejectFirst } =
      Promise.withResolvers<Payload>()

    const onSave = jest
      .fn()
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({ title: 'second' })

    const { options, result, rerender } = renderAutosave({ onSave })

    // Fire first save (will hang)
    rerender({ ...options, onSave, payload: { title: 'first' } })

    act(() => {
      result.current.save()
    })

    // Fire second save — aborts the first
    rerender({ ...options, onSave, payload: { title: 'second' } })

    await act(async () => {
      result.current.save()
    })

    // Now reject the first save — onError should NOT be called (it was aborted)
    await act(async () => {
      rejectFirst(new Error('too late'))
      await firstPromise.catch(() => {})
    })

    expect(options.onError).not.toHaveBeenCalled()
  })

  it('fires onSave on unmount when payload has unsaved changes', () => {
    const onSave = jest.fn().mockResolvedValue({ title: 'saved' })
    const { options, rerender, unmount } = renderAutosave({ onSave })

    // Change payload without calling save
    rerender({ ...options, onSave, payload: { title: 'unsaved' } })

    unmount()

    expect(onSave).toHaveBeenCalledWith({ title: 'unsaved' })
  })

  it('does not fire onSave on unmount when payload is already saved', async () => {
    const onSave = jest.fn().mockResolvedValue({ title: 'saved' })
    const { options, result, rerender, unmount } = renderAutosave({ onSave })

    rerender({ ...options, onSave, payload: { title: 'updated' } })

    await act(async () => {
      result.current.save()
    })

    expect(onSave).toHaveBeenCalledTimes(1)

    unmount()

    // Should not fire again — payload was already saved
    expect(onSave).toHaveBeenCalledTimes(1)
  })
})
