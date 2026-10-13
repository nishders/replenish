import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { packSrc, sceneSrc, type Flavour } from '@/components/ds/assets';
import { GooglyEyes } from '@/components/ds/GooglyEyes';
import { Sticker } from '@/components/ds/Sticker';
import { Ticker } from '@/components/ds/Ticker';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { AuthBackdrop } from './AuthBackdrop';
import s from './auth.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type AuthTheme = {
  accountQuip: string;
  panel: string; // background behind the form
  tilt: number; // slanted ticker angle (deg), desktop
  tiltPhone: number;
  ticker: string[];
  driftWord: string; // hand-written chip in the backdrop
  flavour: Flavour; // can shown on the art panel
  artBg: string;
  artAlt: string;
  sticker: string;
  artLine: string;
};

// Shared frame for account pages: form on a playful panel (left), flavour art (right). Phones get a slim art strip instead.
export function AuthLayout({ theme, children }: { theme: AuthTheme; children: ReactNode }) {
  return (
    <div className={s.page}>
      <SiteHeader accountQuip={theme.accountQuip} />

      <div className={cx(s.strip, s.phone)} style={{ background: theme.artBg }}>
        <Image src={packSrc(theme.flavour)} alt="" width={180} height={449} className={s.stripCan} />
        <p className={s.stripLine}>{theme.artLine}</p>
      </div>

      <main className={s.main}>
        <div
          className={s.panel}
          style={{ background: theme.panel, '--tilt': theme.tilt + 'deg', '--tilt-phone': theme.tiltPhone + 'deg' } as CSSProperties}
        >
          <span className={s.desk}>
            <AuthBackdrop word={theme.driftWord} />
          </span>
          <span className={s.phone}>
            <AuthBackdrop word={theme.driftWord} phone />
          </span>
          <div aria-hidden="true" className={s.slant}>
            <Ticker tone="accent" items={theme.ticker} speed={26} />
          </div>
          <div className={s.slot}>{children}</div>
        </div>

        <div className={s.art} style={{ background: theme.artBg }}>
          <Image src={sceneSrc(theme.flavour)} alt={theme.artAlt} fill sizes="50vw" className={s.artImg} />
          <span className={s.artSticker}>
            <Sticker tone="free" shape="round" size="lg" wobble peelable>
              {theme.sticker}
            </Sticker>
          </span>
          <span aria-hidden="true" className={cx(s.doodle, s.d1)}>
            0g
          </span>
          <span aria-hidden="true" className={cx(s.doodle, s.d2)}>
            ✶
          </span>
          <span aria-hidden="true" className={cx(s.doodle, s.d3)}>
            ?
          </span>
          <div className={s.artNote}>
            <GooglyEyes size={26} />
            <p className={s.artLine}>{theme.artLine}</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
