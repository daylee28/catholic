// Spec: docs/spec/features/short-memorial-prayer/short-memorial-prayer.md
// Plan: docs/plan/PLAN-000001_init/plan.md

import { useEffect, useRef, useState } from 'react'
import { AutoScrollDock } from './components/AutoScrollDock'
import { FontZoom } from './components/FontZoom'
import { LongOptions } from './components/LongOptions'
import { NameInput } from './components/NameInput'
import { PrayerBody } from './components/PrayerBody'
import { PrayerPicker } from './components/PrayerPicker'
import { PrintPdfButton } from './components/PrintPdfButton'
import { PrintSheet } from './components/PrintSheet'
import { ReadingAids } from './components/ReadingAids'
import { ScrollScrubber } from './components/ScrollScrubber'
import { SituationPicker } from './components/SituationPicker'
import { getPrayerDocument } from './data/catalog'
import {
  isWakeLockSupported,
  releaseWakeLock,
  requestWakeLock,
} from './lib/wakeLock'
import { loadPrefs, savePrefs } from './lib/prefs'
import { setScrollRoot, setScrollTop } from './lib/scrollRoot'
import { useAutoScroll } from './lib/useAutoScroll'
import {
  FONT_SIZE_STEP,
  type AfterLitanyId,
  type AppPrefs,
  type PrayerId,
  type ReadingId,
  type SituationId,
} from './types'
import './short-memorial-prayer.css'

export function ShortMemorialPrayerPage() {
  const [prefs, setPrefs] = useState<AppPrefs>(() => loadPrefs())
  const wakeRef = useRef<Awaited<ReturnType<typeof requestWakeLock>>>(null)
  const wakeSupported = isWakeLockSupported()
  const prayer = getPrayerDocument(prefs.prayerId)

  useAutoScroll(prefs.autoScrollOn, prefs.autoScrollSpeed)

  function bindScrollRoot(el: HTMLDivElement | null) {
    setScrollRoot(el)
  }

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
    document.title = `${prayer.shortTitle} · 위령기도`
  }, [prayer.shortTitle])

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

  function selectPrayer(prayerId: PrayerId) {
    updatePrefs({ prayerId })
    setScrollTop(0)
  }

  function printPdf() {
    window.print()
  }

  return (
    <div className="smp">
      <header className="smp__header no-print">
        <div className="smp__top">
          <NameInput
            value={prefs.deceasedName}
            onChange={(deceasedName) => updatePrefs({ deceasedName })}
          />
          <PrintPdfButton onPrint={printPdf} />
          <FontZoom
            fontSizePx={prefs.fontSizePx}
            step={FONT_SIZE_STEP}
            onChange={(fontSizePx) => updatePrefs({ fontSizePx })}
          />
        </div>
      </header>

      <div className="smp__scroll no-print" ref={bindScrollRoot}>
        <main className="smp__main">
          <h1 className="smp__page-title">{prayer.title}</h1>

          <PrayerPicker value={prefs.prayerId} onChange={selectPrayer} />

          <ReadingAids
            wakeSupported={wakeSupported}
            wakeLockOn={prefs.wakeLockOn}
            onWakeLockChange={(wakeLockOn) => updatePrefs({ wakeLockOn })}
          />

          {prayer.hasShortSituations ? (
            <SituationPicker
              value={prefs.situationId}
              onChange={(situationId: SituationId) =>
                updatePrefs({ situationId })
              }
            />
          ) : null}

          {prayer.hasLongOptions ? (
            <LongOptions
              readingId={prefs.readingId}
              litanyOn={prefs.litanyOn}
              afterLitanyId={prefs.afterLitanyId}
              onReadingChange={(readingId: ReadingId) =>
                updatePrefs({ readingId })
              }
              onLitanyChange={(litanyOn) => updatePrefs({ litanyOn })}
              onAfterChange={(afterLitanyId: AfterLitanyId) =>
                updatePrefs({ afterLitanyId })
              }
            />
          ) : null}

          <PrayerBody
            sections={prayer.sections}
            deceasedName={prefs.deceasedName}
            situationId={prefs.situationId}
            readingId={prefs.readingId}
            litanyOn={prefs.litanyOn}
            afterLitanyId={prefs.afterLitanyId}
          />

          <footer className="smp__footer">
            <p>
              기도문 출처:{' '}
              <a
                href={prayer.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {prayer.sourceLabel}
              </a>
            </p>
            <p className="smp__footer-note">
              가정·본당 기도 보조용입니다. 이름·설정은 이 기기에만 저장됩니다.
            </p>
          </footer>
        </main>
      </div>

      <div className="no-print">
        <ScrollScrubber autoScrollOn={prefs.autoScrollOn} />
        <AutoScrollDock
          on={prefs.autoScrollOn}
          speed={prefs.autoScrollSpeed}
          onToggle={(autoScrollOn) => updatePrefs({ autoScrollOn })}
          onSpeedChange={(autoScrollSpeed) =>
            updatePrefs({ autoScrollSpeed })
          }
        />
      </div>

      <PrintSheet
        prayer={prayer}
        deceasedName={prefs.deceasedName}
        situationId={prefs.situationId}
        readingId={prefs.readingId}
        litanyOn={prefs.litanyOn}
        afterLitanyId={prefs.afterLitanyId}
      />
    </div>
  )
}
