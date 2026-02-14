import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

interface UseAutosaveOptions<TPayload, TResult> {
  payload: TPayload
  onSave: (payload: TPayload) => Promise<TResult>
  onSuccess?: (result: TResult) => void
  onError?: (error: unknown) => void
}

const comparator = <TPayload>(a: TPayload, b: TPayload) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function useAutosave<TPayload, TResult>({
  payload,
  onSave,
  onSuccess,
  onError,
}: UseAutosaveOptions<TPayload, TResult>) {
  const [isSaving, setIsSaving] = useState(false)
  const lastSavedPayloadRef = useRef<TPayload | null>(payload)
  const versionRef = useRef(0)

  const save = useCallback(async () => {
    if (comparator(payload, lastSavedPayloadRef.current)) return

    const version = ++versionRef.current

    setIsSaving(true)

    try {
      const result = await onSave(payload)
      if (version !== versionRef.current) return
      lastSavedPayloadRef.current = payload
      onSuccess?.(result)
    } catch (error) {
      if (version !== versionRef.current) return
      onError?.(error)
    } finally {
      if (version !== versionRef.current) return
      setIsSaving(false)
    }
  }, [payload, onSave, onSuccess, onError])

  const saveOnUnmount = useEffectEvent(() => {
    save()
  })

  useEffect(() => {
    return () => saveOnUnmount()
  }, [])

  return { save, isSaving }
}
