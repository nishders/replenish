'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { placeOrder, type PlaceOrderResult } from '@/app/checkout/actions';
import c from '@/components/cart/cart.module.css';
import { sceneSrc, type Flavour } from '@/components/ds/assets';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { Message } from '@/components/ds/Message';
import { Ticker } from '@/components/ds/Ticker';
import { CART_HREF, LOGIN_HREF, SHOP_HREF } from '@/components/site/content';
import { cartActions, useCart } from '@/lib/cart';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import type { Product } from '@/lib/supabase';
import s from './checkout.module.css';

const cx = (...k: (string | false | undefined)[]) => k.filter(Boolean).join(' ');

const JOKES = ['payment method: vibes', 'delivery address: not required', 'lifetime protein delivered: 0g', 'returns policy: there is nothing to return'];
const FLAVOURS: Flavour[] = ['vanilla', 'chocolate', 'strawberry', 'latte'];
const thumbSrc = (p: Product) => ((FLAVOURS as string[]).includes(p.slug) ? sceneSrc(p.slug as Flavour) : p.image_path);
const PACKING_MS = 1800; // long enough to enjoy "packing nothing..."

type Status = 'idle' | 'placing' | 'failed';

function Progress() {
  return (
    <nav aria-label="checkout progress" className={s.progress}>
      <ol className={s.steps}>
        <li className={s.stepItem}>
          <a href={CART_HREF} className={cx(s.pill, s.pillDone)}>
            <span className={cx(s.dot, s.dotDone)}>
              <Icon name="check" size={16} />
            </span>
            <span>cart</span>
          </a>
          <span aria-hidden="true" className={s.line} />
        </li>
        <li aria-current="step" className={s.stepItem}>
          <span className={cx(s.pill, s.pillNow)}>
            <span className={cx(s.dot, s.dotNow)}>2</span>
            <span>checkout</span>
            <span className={s.here}>· you are here</span>
          </span>
          <span aria-hidden="true" className={cx(s.line, s.lineNext)} />
        </li>
        <li className={cx(s.pill, s.pillNext)}>
          <span className={cx(s.dot, s.dotNext)}>3</span>
          <span>done</span>
        </li>
      </ol>
    </nav>
  );
}

function InfoCard({ icon, label, value, aside, extra }: { icon: string; label: string; value: ReactNode; aside: string; extra?: ReactNode }) {
  return (
    <section className={s.card}>
      <span className={cx(s.cardIcon, s.desk)}>
        <Icon name={icon} size={24} />
      </span>
      <div className={s.cardCopy}>
        <div className={s.labelRow}>
          <span className={cx(s.iconSm, s.phone)}>
            <Icon name={icon} size={18} />
          </span>
          <h2 className={s.cardLabel}>{label}</h2>
        </div>
        <span className={s.cardValue}>{value}</span>
        <span className={s.cardAside}>{aside}</span>
      </div>
      {extra}
    </section>
  );
}

function PlaceButton({ status, onPlace }: { status: Status; onPlace: () => void }) {
  return status === 'placing' ? (
    <button type="button" disabled aria-busy="true" aria-live="polite" className={s.packing}>
      <span aria-hidden="true" className={s.spinner} />
      <span>packing nothing...</span>
    </button>
  ) : (
    <Button size="lg" fullWidth arrow magnetic quip="we'll charge you £0.00. promise." onClick={onPlace}>
      place free order
    </Button>
  );
}

const FAILED = (
  <Message tone="error" title="order not placed">
    something went wrong and your nothing wasn&apos;t ordered. try again?
  </Message>
);

export function CheckoutPage({ products, email, footer }: { products: Product[] | null; email: string; footer: ReactNode }) {
  const router = useRouter();
  const { cart, count, ready } = useCart();
  const [status, setStatus] = useState<Status>('idle');

  const rows = (products ?? []).filter((p) => cart[p.slug]).map((p) => ({ product: p, qty: cart[p.slug] }));
  const hasItems = rows.length > 0;
  const metaLine = hasItems ? `${count} ${count === 1 ? 'can' : 'cans'} · 0g protein total · ships never` : '0 cans · 0g protein · nothing to see here';

  const place = async () => {
    if (status === 'placing') return;
    setStatus('placing');
    const items = rows.map(({ product, qty }) => ({ slug: product.slug, quantity: qty }));
    const [result] = await Promise.all([
      placeOrder(items).catch((): PlaceOrderResult => ({ ok: false, reason: 'failed' })),
      new Promise((r) => setTimeout(r, PACKING_MS)),
    ]);
    if (result.ok) {
      cartActions.clear();
      router.push(`/order/${result.orderNumber}`);
    } else if (result.reason === 'login') {
      router.push(`${LOGIN_HREF}?next=${CART_HREF}`);
    } else {
      setStatus('failed');
    }
  };

  const logOut = async () => {
    await getBrowserSupabase().auth.signOut();
    router.push(`${LOGIN_HREF}?next=${CART_HREF}`);
  };

  const summary = (
    <aside className={c.summary}>
      <div className={s.summaryHead}>
        <h2 className={c.summaryTitle} style={{ margin: 0 }}>
          the damage
        </h2>
        <a href={CART_HREF} className={s.edit}>
          <Icon name="arrow-left" size={18} />
          <span>edit cart</span>
        </a>
      </div>
      <ul className={s.items}>
        {rows.map(({ product: p, qty }) => (
          <li key={p.slug} className={s.item}>
            <Image src={thumbSrc(p)} alt={`${p.name} can`} width={128} height={128} className={s.itemImg} />
            <span className={s.itemName}>{p.name}</span>
            <span aria-label={`quantity ${qty}`} className={s.itemQty}>
              × {qty}
            </span>
          </li>
        ))}
      </ul>
      <div className={c.sumLine}>
        <span>subtotal</span>
        <span>free</span>
      </div>
      <div className={c.sumLine}>
        <span>protein</span>
        <span>0g</span>
      </div>
      <div className={c.sumLine}>
        <span>shipping</span>
        <span>not happening</span>
      </div>
      <div className={c.total}>
        <span className={c.totalLabel}>total</span>
        <span className={c.totalValue}>free</span>
      </div>
      <div className={cx(s.placeArea, s.desk)}>
        {status === 'failed' && FAILED}
        <PlaceButton status={status} onPlace={place} />
        <p className={s.agree}>by placing this order you agree to receive absolutely nothing.</p>
      </div>
    </aside>
  );

  return (
    <>
      <main className={s.main}>
        <Progress />
        <div className={s.head}>
          <h1 className={s.h1}>almost yours. sort of.</h1>
          <span className={s.meta}>{ready ? metaLine : ' '}</span>
        </div>

        {!ready ? null : !products ? (
          <p className={c.problem}>the shelf couldn&apos;t load just now. try refreshing.</p>
        ) : hasItems ? (
          <div className={s.layout}>
            <div className={s.cards}>
              <InfoCard
                icon="user"
                label="ordering as"
                value={email}
                aside="your inbox is about to get one (1) email."
                extra={
                  <button type="button" className={s.logout} onClick={logOut}>
                    not you? log out
                  </button>
                }
              />
              <InfoCard icon="package" label="delivering to" value="nowhere. there's nothing to deliver." aside="no address needed. we wouldn't know what to do with it." />
              <InfoCard
                icon="sparkles"
                label="paying with"
                value="vibes"
                aside="accepted everywhere we exist. so, here."
                extra={
                  <div aria-label="fake card: vibes" role="img" className={s.vibes}>
                    <div className={s.vibesTop}>
                      <span className={s.chip} />
                      <span className={s.squiggle}>~✶</span>
                    </div>
                    <div>
                      <span className={s.vibesNum}>•••• •••• 0000</span>
                      <div className={s.vibesName}>vibes</div>
                    </div>
                  </div>
                }
              />
            </div>
            <div className={s.summaryWrap}>{summary}</div>
          </div>
        ) : (
          <div className={c.empty}>
            <span aria-hidden="true" className={cx(c.emptyDoodle, c.e1)}>
              ?
            </span>
            <span aria-hidden="true" className={cx(c.emptyDoodle, c.e2)}>
              0g
            </span>
            <span aria-hidden="true" className={cx(c.emptyDoodle, c.e4)}>
              ✶
            </span>
            <span className={s.desk}>
              <IconButton icon="shopping-bag" label="empty bag" size={128} badge={0} rattle quip="*rattle* … nothing in here" />
            </span>
            <span className={s.phone}>
              <IconButton icon="shopping-bag" label="empty bag" size={104} badge={0} rattle quip="*rattle* … nothing in here" />
            </span>
            <h2 className={c.emptyTitle}>nothing to check out. even by our standards.</h2>
            <p className={c.emptyAside}>add some nothing first, then come back.</p>
            <div className={c.emptyCta}>
              <Button size="lg" fullWidth arrow magnetic quip="four kinds of nothing" onClick={() => router.push(SHOP_HREF)}>
                go to shop
              </Button>
            </div>
          </div>
        )}
      </main>

      <div className={c.jokes}>
        <Ticker tone="accent" items={JOKES} speed={30} />
      </div>

      {footer}

      {/* phone: place-order bar stuck to the bottom */}
      {ready && hasItems && (
        <>
          <div aria-hidden="true" className={cx(s.phone, status === 'failed' ? s.barSpacerTall : s.barSpacer)} />
          <div className={s.bar}>
            {status === 'failed' && FAILED}
            <PlaceButton status={status} onPlace={place} />
            <p className={s.agree}>by placing this order you agree to receive absolutely nothing.</p>
          </div>
        </>
      )}
    </>
  );
}
