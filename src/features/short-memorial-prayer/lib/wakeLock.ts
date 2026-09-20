// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// FR-5: Wake Lock

type WakeLockSentinelLike = {
  released: boolean
  release: () => Promise<void>
}

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
}

export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator
}

export async function requestWakeLock(): Promise<WakeLockSentinelLike | null> {
  const nav = navigator as WakeLockNavigator
  if (!nav.wakeLock) return null
  try {
    return await nav.wakeLock.request('screen')
  } catch {
    return null
  }
}

export async function releaseWakeLock(
  sentinel: WakeLockSentinelLike | null,
): Promise<void> {
  if (!sentinel || sentinel.released) return
  try {
    await sentinel.release()
  } catch {
    // ignore
  }
}
