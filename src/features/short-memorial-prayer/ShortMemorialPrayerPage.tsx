// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// Plan: docs/plan/PLAN-000001_init/plan.md

import { useEffect, useRef, useState } from 'react'
import { FontZoom } from './components/FontZoom'
import { NameInput } from './components/NameInput'
import { PrayerBody } from './components/PrayerBody'
import { SituationPicker } from './components/SituationPicker'
import { WakeLockToggle } from './components/WakeLockToggle'
import { shortMemorialPrayer } from './data/prayer'
import {
  isWakeLockSupported,
  releaseWakeLock,
  requestWakeLock,
} from './lib/wakeLock'
import { loadPrefs, savePrefs } from './lib/prefs'
import {
  FONT_SIZE_STEP,
  type AppPrefs,
  type SituationId,
} from './types'
import './short-memorial-prayer.css'

export function ShortMemorialPrayerPage() {
  const [prefs, setPrefs] = useState<AppPrefs>(() => loadPrefs())
  const wakeRef = useRef<Awaited<ReturnType<typeof requestWakeLock>>>(null)
  const wakeSupported = isWakeLockSupported()

  useEffect(() => {
    savePrefs(prefs)
  }, [prefs])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--prayer-font-size',
      `${prefs.fontSizePx}px`,
    )
  }, [prefs.fontSizePx])

  useEffect(() => {
    let cancelled = false

    async function syncWakeLock() {
      if (!prefs.wakeLockOn || !wakeSupported) {
        await releaseWakeLock(wakeRef.current)
        wakeRef.current = null
        return
      }
      const sentinel = await requestWakeLock()
      if (cancelled) {
        await releaseWakeLock(sentinel)
        return
      }
      wakeRef.current = sentinel
      if (!sentinel) {
        setPrefs((p) => ({ ...p, wakeLockOn: false }))
      }
    }

    void syncWakeLock()

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && prefs.wakeLockOn) {
        void syncWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void releaseWakeLock(wakeRef.current)
      wakeRef.current = null
    }
  }, [prefs.wakeLockOn, wakeSupported])

  function updatePrefs(partial: Partial<AppPrefs>) {
    setPrefs((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="smp">
      <header className="smp__header">
        <div className="smp__header-row">
          <h1 className="smp__title">{shortMemorialPrayer.title}</h1>
          <FontZoom
            fontSizePx={prefs.fontSizePx}
            step={FONT_SIZE_STEP}
            onChange={(fontSizePx) => updatePrefs({ fontSizePx })}
          />
        </div>
        <NameInput
          value={prefs.deceasedName}
          onChange={(deceasedName) => updatePrefs({ deceasedName })}
        />
        <WakeLockToggle
          supported={wakeSupported}
          enabled={prefs.wakeLockOn}
          onChange={(wakeLockOn) => updatePrefs({ wakeLockOn })}
        />
      </header>

      <main className="smp__main">
        <SituationPicker
          value={prefs.situationId}
          onChange={(situationId: SituationId) => updatePrefs({ situationId })}
        />
        <PrayerBody
          sections={shortMemorialPrayer.sections}
          deceasedName={prefs.deceasedName}
          situationId={prefs.situationId}
        />
        <footer className="smp__footer">
          <p>
            기도문 출처:{' '}
            <a
              href={shortMemorialPrayer.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              가톨릭 굿뉴스 위령기도 2(짧은 위령 기도)
            </a>
          </p>
          <p className="smp__footer-note">
            가정·본당 기도 보조용입니다. 이름·설정은 이 기기에만 저장됩니다.
          </p>
        </footer>
      </main>
    </div>
  )
}
