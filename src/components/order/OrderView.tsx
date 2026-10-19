'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import c from '@/components/cart/cart.module.css';
import { sceneSrc, type Flavour } from '@/components/ds/assets';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { Ticker } from '@/components/ds/Ticker';
import { ORDERS_HREF, SHOP_HREF } from '@/components/site/content';
import { formatOrderDate } from '@/lib/orders';
import s from './order.module.css';

const cx = (...k: (string | false | undefined)[]) => k.filter(Boolean).join(' ');

const JOKES = ['your order of nothing is on its way', 'estimated delivery: never', 'lifetime protein delivered: 0g', 'returns policy: there is nothing to return'];
const FLAVOURS: Flavour[] = ['vanilla', 'chocolate', 'strawberry', 'latte'];
const CHIPS = ['0g', '✶', 'free', '0ml', 'nish', '✓', '✶', '0g', 'free', '✶'];
const FILLS = [
  ['var(--zest-500)', 'var(--ink-900)'],
  ['var(--cream-50)', 'var(--ink-900)'],
  ['var(--nish-500)', 'var(--cream-50)'],
];

export type OrderItem = { slug: string; name: string; image_path: string; quantity: number };
export type Order = { number: string; createdAt: string; items: OrderItem[] };

const thumbSrc = (i: OrderItem) => ((FLAVOURS as string[]).includes(i.slug) ? sceneSrc(i.slug as Flavour) : i.image_path);

// 0g / free / ✶ chips burst out from the middle once (calmer fade-in with reduced motion). Never blocks clicks.
function useConfetti(host: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const t = setTimeout(() => {
      const el = host.current;
      if (!el?.animate) return;
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      CHIPS.forEach((text, i) => {
        const chip = document.createElement('span');
        chip.textContent = text;
        chip.setAttribute('aria-hidden', 'true');
        const [bg, fg] = FILLS[i % 3];
        Object.assign(chip.style, {
          position: 'absolute',
          left: w / 2 + 'px',
          top: h * 0.42 + 'px',
          zIndex: '3',
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: w > 600 ? '16px' : '13px',
          fontWeight: '500',
          padding: '4px 11px',
          borderRadius: '999px',
          border: '2px solid var(--ink-900)',
          background: bg,
          color: fg,
          boxShadow: '2px 2px 0 var(--ink-900)',
          whiteSpace: 'nowrap',
          translate: '-50% -50%',
        });
        el.appendChild(chip);
        const side = i % 2 ? 1 : -1;
        const tx = side * (w * (0.28 + Math.random() * 0.18));
        const ty = (Math.random() - 0.5) * h * 0.8;
        const rot = (Math.random() - 0.5) * 40;
        const at = `translate(${tx}px,${ty}px) rotate(${rot}deg)`;
        const frames = calm
          ? [
              { transform: at, opacity: 0 },
              { transform: at, opacity: 1, offset: 0.25 },
              { transform: at, opacity: 1, offset: 0.75 },
              { transform: at, opacity: 0 },
            ]
          : [
              { transform: 'translate(0,0) scale(.3)', opacity: 1 },
              { transform: `translate(${tx}px,${ty}px) scale(1.1) rotate(${rot}deg)`, opacity: 1, offset: 0.3 },
              { transform: `translate(${tx * 1.05}px,${ty + 14}px) scale(1) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.75 },
              { transform: `translate(${tx * 1.08}px,${ty + 40}px) scale(.85) rotate(${rot * 0.4}deg)`, opacity: 0 },
            ];
        chip.animate(frames, { duration: 1600, delay: calm ? 0 : i * 25, easing: calm ? 'ease' : 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' }).onfinish = () =>
          chip.remove();
      });
    }, 700);
    return () => clearTimeout(t);
  }, [host]);
}

// The date is shown in the visitor's own time zone (the server only knows UTC), so it's filled in by the browser.
function OrderDate({ iso }: { iso: string }) {
  return <span suppressHydrationWarning>{formatOrderDate(iso)}</span>;
}

function Confirmed({ order, email }: { order: Order; email: string }) {
  const router = useRouter();
  const hero = useRef<HTMLDivElement>(null);
  useConfetti(hero);
  const count = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <main>
      <div ref={hero} className={s.hero}>
        <p className={s.kicker}>you did it. sort of.</p>
        <h1 className={s.h1}>order placed! nothing is on its way.</h1>
        <div className={s.ticket}>
          <div className={s.ticketPart}>
            <span className={s.label}>order number</span>
            <span className={s.number}>#{order.number}</span>
          </div>
          <div className={s.ticketPart}>
            <span className={s.label}>placed</span>
            <span className={s.date}>
              <OrderDate iso={order.createdAt} />
            </span>
          </div>
        </div>
      </div>

      <div className={s.details}>
        <section className={s.panel}>
          <div className={s.panelHead}>
            <h2 className={s.h2}>what you &quot;bought&quot;</h2>
            <span className={s.count}>
              {count} {count === 1 ? 'can' : 'cans'} · 0g protein
            </span>
          </div>
          <ul className={s.items}>
            {order.items.map((i) => (
              <li key={i.slug} className={s.item}>
                <Image src={thumbSrc(i)} alt={`${i.name} can`} width={128} height={128} className={s.itemImg} />
                <span className={s.itemName}>{i.name}</span>
                <span aria-label={`quantity ${i.quantity}`} className={s.itemQty}>
                  × {i.quantity}
                </span>
                <span className={s.itemFree}>free</span>
              </li>
            ))}
          </ul>
          <div className={s.total}>
            <span className={s.totalLabel}>total</span>
            <span className={s.totalValue}>free</span>
          </div>
        </section>

        <div className={s.side}>
          <section aria-label="delivery tracker" className={s.panel} style={{ gap: 16 }}>
            <div className={s.panelHead}>
              <h2 className={s.h2}>track your nothing</h2>
              <span className={s.panelAside}>it won&apos;t move. we checked.</span>
            </div>
            <ol className={s.track}>
              <li className={s.trackStep}>
                <span className={cx(s.trackDot, s.dotDone)}>
                  <Icon name="check" size={22} />
                </span>
                <div className={s.trackText}>
                  <span className={s.trackTitle}>order placed ✓</span>
                  <span className={s.trackSub}>
                    done · <OrderDate iso={order.createdAt} />
                  </span>
                </div>
                <span aria-hidden="true" className={s.trackLine} />
                <span />
              </li>
              <li aria-current="step" className={s.trackStep}>
                <span className={cx(s.trackDot, s.dotNow)}>
                  <Icon name="package" size={22} />
                </span>
                <div className={s.trackText}>
                  <span className={s.trackTitle}>packing nothing</span>
                  <span className={s.trackSub}>in progress · permanently</span>
                </div>
                <span aria-hidden="true" className={cx(s.trackLine, s.trackLineNext)} />
                <span />
              </li>
              <li className={s.trackStep}>
                <span className={cx(s.trackDot, s.dotNever)}>
                  <Icon name="x" size={22} />
                </span>
                <div className={s.trackText}>
                  <span className={s.trackTitle}>delivered never</span>
                  <span className={s.trackSub}>not started · estimated: never</span>
                </div>
              </li>
            </ol>
          </section>
          <div className={s.mail}>
            <span className={s.mailIcon}>
              <Icon name="mail" size={22} />
            </span>
            <p className={s.mailText}>
              we&apos;ve sent a confirmation to <strong>{email}</strong>. the protein, you won&apos;t get. but this email? ya sure will!
            </p>
          </div>
        </div>
      </div>

      <div className={s.actions}>
        <div className={s.buttons}>
          <Button size="lg" fullWidth arrow magnetic quip="your orders of nothing" onClick={() => router.push(ORDERS_HREF)}>
            view my orders
          </Button>
          <Button variant="outline" size="lg" fullWidth quip="more nothing, coming up" onClick={() => router.push(SHOP_HREF)}>
            keep shopping
          </Button>
        </div>
        <p className={s.thanks}>✶ replenish is a portfolio project by nish. thanks for playing along. ✶</p>
      </div>
    </main>
  );
}

function NotFound() {
  const router = useRouter();
  return (
    <main className={s.missingWrap}>
      <div className={c.empty}>
        <span aria-hidden="true" className={cx(c.emptyDoodle, c.e1)}>
          ?
        </span>
        <span aria-hidden="true" className={cx(c.emptyDoodle, c.e2)}>
          ~ ~
        </span>
        <span className={s.desk}>
          <IconButton icon="search" label="order search" size={128} quip="looked everywhere. twice." />
        </span>
        <span className={s.phone}>
          <IconButton icon="search" label="order search" size={104} quip="looked everywhere. twice." />
        </span>
        <h1 className={c.emptyTitle}>we couldn&apos;t find that order.</h1>
        <p className={s.missingBody}>check the order number in your confirmation email, or find it in your orders.</p>
        <p className={c.emptyAside}>
          it&apos;s nothing. but it&apos;s <u>your</u> nothing.
        </p>
        <div className={c.emptyCta}>
          <Button size="lg" fullWidth arrow magnetic quip="your orders of nothing" onClick={() => router.push(ORDERS_HREF)}>
            view my orders
          </Button>
        </div>
      </div>
    </main>
  );
}

export function OrderView({ order, email }: { order: Order | null; email: string }) {
  return (
    <>
      {order ? <Confirmed order={order} email={email} /> : <NotFound />}
      <div className={s.jokes}>
        <Ticker tone="accent" items={JOKES} speed={30} />
      </div>
    </>
  );
}
