'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import s from './auth.module.css';

// Big submit button; while busy it greys out and shows a spinner with `busyLabel`.
export function SubmitButton({ busy, busyLabel, quip, children }: { busy: boolean; busyLabel: string; quip: string; children: ReactNode }) {
  return busy ? (
    <Button type="submit" size="lg" fullWidth disabled aria-busy="true" style={{ marginTop: 4 }}>
      <span className={s.spin}>
        <span aria-hidden="true" className={s.spinner} />
        <span>{busyLabel}</span>
      </span>
    </Button>
  ) : (
    <Button type="submit" size="lg" fullWidth arrow quip={quip} style={{ marginTop: 4 }}>
      {children}
    </Button>
  );
}

// Centred status card: icon badge, title, body, hand-written aside, then actions (children).
export function StatusCard({
  icon,
  tone = 'zest',
  doodles = ['✶', '~ ~'],
  title,
  body,
  aside,
  children,
}: {
  icon: string;
  tone?: 'zest' | 'error';
  doodles?: [string, string];
  title: string;
  body: ReactNode;
  aside: string;
  children: ReactNode;
}) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={s.status}>
      <span aria-hidden="true" className={`${s.statusDoodle} ${s.sd1}`}>
        {doodles[0]}
      </span>
      <span aria-hidden="true" className={`${s.statusDoodle} ${s.sd2}`}>
        {doodles[1]}
      </span>
      <div className={tone === 'error' ? `${s.badge} ${s.badgeError}` : s.badge}>
        <Icon name={icon} size={50} />
      </div>
      <h1 className={s.statusTitle}>{title}</h1>
      <p className={s.statusBody}>{body}</p>
      <p className={s.statusAside}>{aside}</p>
      {children}
    </div>
  );
}

// Heading that can differ between desktop and phone.
export function AuthHeading({ desk, phone }: { desk: string; phone?: string }) {
  if (!phone || phone === desk) return <h1 className={s.h1}>{desk}</h1>;
  return (
    <h1 className={s.h1}>
      <span className={s.desk}>{desk}</span>
      <span className={s.phone}>{phone}</span>
    </h1>
  );
}
