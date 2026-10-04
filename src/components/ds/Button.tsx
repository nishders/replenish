'use client';

import { useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Quip, SPRING, usePress } from './interaction';

const SIZES = {
  sm: { h: 38, px: 18, fs: 14, icon: 18 },
  md: { h: 48, px: 24, fs: 16, icon: 20 },
  lg: { h: 60, px: 32, fs: 19, icon: 22 },
};
const VARIANTS = {
  primary: { bg: 'var(--zest-500)', bgHover: 'var(--zest-400)', fg: 'var(--ink-900)', shadow: true },
  secondary: { bg: 'var(--nish-500)', bgHover: 'var(--nish-400)', fg: 'var(--cream-50)', shadow: true },
  outline: { bg: 'transparent', bgHover: 'var(--cream-50)', fg: 'var(--ink-900)', shadow: false },
  inverse: { bg: 'var(--cream-50)', bgHover: 'var(--white)', fg: 'var(--ink-900)', shadow: true },
};
const CONFETTI = ['0g', 'free', '✶', '0ml', 'nish', '0g', '✶'];
const CONFETTI_BG = ['var(--nish-500)', 'var(--zest-500)', 'var(--flavour-strawberry)', 'var(--flavour-latte)', 'var(--flavour-vanilla)'];

type Bit = { id: string; t: string; x: number; y: number; r: number; c: string; on: boolean };

function Ripple({ text, on }: { text: ReactNode; on: boolean }) {
  if (typeof text !== 'string') return <>{text}</>;
  return (
    <>
      {text.split('').map((c, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            transform: on ? 'translateY(-3px)' : 'none',
            transition: `transform 300ms ${SPRING} ${i * 22}ms`,
          }}
        >
          {c}
        </span>
      ))}
    </>
  );
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
  variant?: keyof typeof VARIANTS | 'text';
  size?: keyof typeof SIZES;
  arrow?: boolean;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  magnetic?: boolean;
  confetti?: boolean | string[];
  quip?: ReactNode;
  style?: CSSProperties;
};

// Jelly button: letters ripple on hover, squash on press, wobble on release. Optional magnetic lean and 0g confetti burst.
export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  icon,
  iconRight,
  disabled = false,
  fullWidth = false,
  type = 'button',
  magnetic = false,
  confetti = false,
  quip,
  onClick,
  children,
  style,
  ...rest
}: ButtonProps) {
  const { hover, press, bind } = usePress(disabled);
  const [jelly, setJelly] = useState(0);
  const [mag, setMag] = useState({ x: 0, y: 0, near: false });
  const [bits, setBits] = useState<Bit[]>([]);
  const btn = useRef<HTMLButtonElement>(null);
  const s = SIZES[size] || SIZES.md;

  const fire = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setJelly((j) => j + 1);
    if (confetti) {
      const words = Array.isArray(confetti) ? confetti : CONFETTI;
      const k = Date.now();
      const b = Array.from({ length: 20 }).map((_, i) => ({
        id: k + '-' + i,
        t: words[i % words.length],
        x: (Math.random() - 0.5) * 320,
        y: -50 - Math.random() * 150,
        r: (Math.random() - 0.5) * 140,
        c: CONFETTI_BG[i % CONFETTI_BG.length],
        on: false,
      }));
      setBits(b);
      requestAnimationFrame(() => requestAnimationFrame(() => setBits(b.map((x) => ({ ...x, on: true })))));
      setTimeout(() => setBits([]), 1300);
    }
    onClick?.(e);
  };

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!magnetic || disabled || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setMag({
      x: Math.max(-14, Math.min(14, dx * 0.22)),
      y: Math.max(-10, Math.min(10, dy * 0.3)),
      near: Math.abs(dx) < r.width / 2 + 10 && Math.abs(dy) < r.height / 2 + 10,
    });
  };

  const magT = magnetic ? `translate(${mag.x}px, ${mag.y}px) rotate(${mag.x * 0.25}deg) ` : '';
  const arrowEl = (arrow || iconRight) && (
    <Icon
      name={iconRight || 'arrow-right'}
      size={s.icon}
      boil={hover}
      style={{
        transform: hover && !disabled ? (mag.near ? 'translateX(5px) scaleX(1.25)' : 'translateX(3px)') : 'none',
        transition: `transform var(--dur-base) ${SPRING}`,
      }}
    />
  );

  let look: CSSProperties;
  if (variant === 'text') {
    look = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 0,
      padding: '6px 2px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: s.fs,
      color: disabled ? 'var(--ink-300)' : hover ? 'var(--nish-600)' : 'var(--ink-900)',
      textDecoration: 'underline',
      textUnderlineOffset: hover ? 6 : 4,
      textDecorationThickness: 2,
      transform: magT + (press ? 'scale(var(--press-scale))' : ''),
      transition: `color var(--dur-fast), text-underline-offset var(--dur-base) ${SPRING}, transform var(--dur-slow) ${SPRING}`,
    };
  } else {
    const v = VARIANTS[variant] || VARIANTS.primary;
    const lift = v.shadow && hover && !press;
    look = {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: s.h,
      padding: `0 ${s.px}px`,
      borderRadius: 'var(--radius-pill)',
      border: `var(--border-thick) solid ${disabled ? 'var(--ink-300)' : 'var(--ink-900)'}`,
      background: disabled ? 'var(--cream-200)' : hover ? v.bgHover : v.bg,
      color: disabled ? 'var(--ink-500)' : v.fg,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: s.fs,
      letterSpacing: '0.005em',
      whiteSpace: 'nowrap',
      boxShadow: disabled || !v.shadow ? 'none' : press ? '0 0 0 var(--ink-900)' : lift ? '5px 5px 0 var(--ink-900)' : 'var(--shadow-sm)',
      transform: magT + (press ? 'translate(2px,2px) scale(1.08,.82)' : lift ? 'translate(-2px,-2px)' : ''),
      transition: `transform ${magnetic && hover ? 'var(--dur-slow)' : '180ms'} ${SPRING}, box-shadow 180ms ${SPRING}, background var(--dur-fast)`,
    };
  }

  const inner = (
    <span
      key={jelly}
      style={{ display: 'inline-flex', alignItems: 'center', gap: variant === 'text' ? 8 : 10, animation: jelly ? 'nish-jelly 700ms both' : undefined }}
    >
      {icon && <Icon name={icon} size={s.icon} boil={hover} />}
      <span style={{ display: 'inline-flex' }}>
        <Ripple text={children} on={hover && !press && !disabled} />
      </span>
      {arrowEl}
    </span>
  );

  return (
    <span
      onMouseMove={onMove}
      onMouseLeave={() => setMag({ x: 0, y: 0, near: false })}
      style={{
        position: 'relative',
        display: fullWidth ? 'flex' : 'inline-flex',
        ...(magnetic ? { padding: 24, margin: -24 } : null),
        ...style,
      }}
    >
      {bits.map((b) => (
        <span
          key={b.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            zIndex: 40,
            padding: '2px 8px',
            borderRadius: 99,
            border: 'var(--border-thin) solid var(--ink-900)',
            background: b.c,
            color: 'var(--ink-900)',
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            transform: b.on ? `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg)` : 'translate(-50%,-50%) scale(.3)',
            opacity: b.on ? 0 : 1,
            transition: 'transform 1100ms cubic-bezier(.15,.9,.3,1), opacity 400ms 800ms',
          }}
        >
          {b.t}
        </span>
      ))}
      <button ref={btn} type={type} disabled={disabled} onClick={fire} {...bind} {...rest} style={{ ...look, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {inner}
      </button>
      <Quip show={hover && !disabled}>{quip}</Quip>
    </span>
  );
}
