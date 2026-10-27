'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sceneSrc, type Flavour } from '@/components/ds/assets';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { Ticker } from '@/components/ds/Ticker';
import { CHECKOUT_HREF, LOGIN_HREF, SHOP_HREF, SIGNUP_HREF } from '@/components/site/content';
import { cartActions, MAX_QTY, useCart } from '@/lib/cart';
import type { Product } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import s from './cart.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const JOKES = [
  "you've saved £0.00 by shopping with us. again.",
  'lifetime protein delivered: 0g',
  'nothing in your cart has ever been weighed',
  'returns policy: there is nothing to return',
];
const FLAVOURS: Flavour[] = ['vanilla', 'chocolate', 'strawberry', 'latte'];
const thumbSrc = (p: Product) => ((FLAVOURS as string[]).includes(p.slug) ? sceneSrc(p.slug as Flavour) : p.image_path);

function Stepper({ product, qty }: { product: Product; qty: number }) {
  const atMax = qty >= MAX_QTY;
  return (
    <div role="group" aria-label={`quantity of ${product.name}`} className={s.stepper}>
      <button type="button" aria-label="decrease quantity" className={s.step} disabled={qty <= 1} onClick={() => cartActions.setQty(product.slug, qty - 1)}>
        <Icon name="minus" size={20} />
      </button>
      <span aria-live="polite" className={s.qty}>
        {qty}
      </span>
      {atMax ? (
        <button type="button" disabled aria-label={`can't increase: max ${MAX_QTY} reached`} className={cx(s.step, s.stepLocked)}>
          <Icon name="lock" size={18} />
        </button>
      ) : (
        <button type="button" aria-label="increase quantity" className={s.step} onClick={() => cartActions.setQty(product.slug, qty + 1)}>
          <Icon name="plus" size={20} />
        </button>
      )}
    </div>
  );
}

function AuthPrompt({ onClose, phone }: { onClose: () => void; phone?: boolean }) {
  const router = useRouter();
  const size = phone ? 'lg' : 'md';
  return (
    <>
      <div className={s.authHead}>
        <span className={s.lockDot}>
          <Icon name="lock" size={20} />
        </span>
        <h3 className={s.authTitle}>log in to place your free order</h3>
        <button type="button" aria-label="close" className={s.close} onClick={onClose}>
          <Icon name="x" size={20} />
        </button>
      </div>
      <p className={s.authBody}>we&apos;ll keep your cart exactly as it is. nobody&apos;s going to take it. there&apos;s nothing to take.</p>
      <div className={phone ? undefined : s.authButtons} style={phone ? { display: 'flex', flexDirection: 'column', gap: 12 } : undefined}>
        <Button size={size} fullWidth quip="welcome back-ish" onClick={() => router.push(`${LOGIN_HREF}?next=/cart`)}>
          log in
        </Button>
        <Button variant="outline" size={size} fullWidth quip="takes ten seconds" onClick={() => router.push(`${SIGNUP_HREF}?next=/cart`)}>
          sign up
        </Button>
      </div>
    </>
  );
}

export function CartPage({ products }: { products: Product[] | null }) {
  const router = useRouter();
  const { cart, count, ready } = useCart();
  const { user } = useAuth();
  const [removed, setRemoved] = useState<{ slug: string; qty: number; name: string }>();
  const [askLogin, setAskLogin] = useState(false);

  // Rows follow the shop's order; anything no longer in the products table is skipped.
  const rows = (products ?? []).filter((p) => cart[p.slug]).map((p) => ({ product: p, qty: cart[p.slug] }));
  const hasItems = rows.length > 0;
  const metaLine = count ? `${count} ${count === 1 ? 'can' : 'cans'} · 0g protein total · ships never` : '0 cans · 0g protein · still ships never';

  const remove = (p: Product, qty: number) => {
    cartActions.remove(p.slug);
    setRemoved({ slug: p.slug, qty, name: p.name });
  };
  const undo = () => {
    if (!removed) return;
    cartActions.restore(removed.slug, removed.qty);
    setRemoved(undefined);
  };
  // Logged out: ask to log in (which brings them back here). Logged in: on to checkout.
  const checkout = () => (user ? router.push(CHECKOUT_HREF) : setAskLogin(true));

  const backLink = (
    <a href={SHOP_HREF} className={s.back}>
      <Icon name="arrow-left" size={20} />
      <span>keep shopping</span>
    </a>
  );

  return (
    <>
      <main className={s.main}>
        <div className={s.head}>
          <div className={s.headCopy}>
            <h1 className={s.h1}>your cart. impressively empty of protein.</h1>
            <span className={s.meta}>{ready ? metaLine : ' '}</span>
          </div>
          {backLink}
        </div>

        {removed && (
          <div role="status" className={s.removed}>
            <span className={s.tick}>
              <Icon name="check" size={18} />
            </span>
            <span className={s.removedText}>
              <strong>removed.</strong> it won&apos;t miss you.<span className={s.removedName}> · {removed.name}</span>
            </span>
            <button type="button" className={s.undo} onClick={undo}>
              undo
            </button>
          </div>
        )}

        {!ready ? null : !products ? (
          <p className={s.problem}>the shelf couldn&apos;t load just now, so neither can your cart. try refreshing.</p>
        ) : hasItems ? (
          <div className={s.layout}>
            <div className={s.rows}>
              {rows.map(({ product: p, qty }) => (
                <div key={p.slug} className={s.row}>
                  <Image src={thumbSrc(p)} alt={`${p.name} can`} width={224} height={224} className={s.thumb} />
                  <div className={s.info}>
                    <h3 className={s.name}>{p.name}</h3>
                    <p className={s.line}>{p.description}</p>
                    <span className={s.phonePrice}>free</span>
                  </div>
                  <div className={s.rowControls}>
                    <Stepper product={p} qty={qty} />
                    <span className={s.price}>free</span>
                    <button type="button" className={s.remove} onClick={() => remove(p, qty)}>
                      <Icon name="trash-2" size={18} />
                      <span>remove</span>
                    </button>
                  </div>
                  {qty >= MAX_QTY && (
                    <div role="note" className={s.maxNote}>
                      <Icon name="lock" size={18} />
                      <span>
                        <strong>max {MAX_QTY}.</strong> we only have so much nothing.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <aside className={s.summary}>
              <h2 className={s.summaryTitle}>the damage</h2>
              <div className={s.sumLine}>
                <span>subtotal</span>
                <span>free</span>
              </div>
              <div className={s.sumLine}>
                <span>protein</span>
                <span>0g</span>
              </div>
              <div className={s.sumLine}>
                <span>shipping</span>
                <span>not happening</span>
              </div>
              <div className={s.total}>
                <span className={s.totalLabel}>total</span>
                <span className={s.totalValue}>free</span>
              </div>
              <p className={cx(s.proud, s.desk)}>and proud of it.</p>
              <div className={s.desk} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {askLogin ? (
                  <div role="alert" className={s.auth}>
                    <AuthPrompt onClose={() => setAskLogin(false)} />
                  </div>
                ) : (
                  <>
                    <Button size="lg" fullWidth arrow magnetic quip="total: still zero" onClick={checkout}>
                      checkout for free
                    </Button>
                    <p className={s.fine}>no card needed. there&apos;s nothing to charge you for.</p>
                  </>
                )}
              </div>
              <p className={cx(s.fine, s.phone)}>no card needed. there&apos;s nothing to charge you for.</p>
            </aside>
          </div>
        ) : (
          <div className={s.empty}>
            <span aria-hidden="true" className={cx(s.emptyDoodle, s.e1)}>
              ?
            </span>
            <span aria-hidden="true" className={cx(s.emptyDoodle, s.e2)}>
              0g
            </span>
            <span aria-hidden="true" className={cx(s.emptyDoodle, s.e3)}>
              ~ ~
            </span>
            <span aria-hidden="true" className={cx(s.emptyDoodle, s.e4)}>
              ✶
            </span>
            <span className={s.desk}>
              <IconButton icon="shopping-bag" label="empty bag" size={128} badge={0} rattle quip="*rattle* … nothing in here" onClick={() => router.push(SHOP_HREF)} />
            </span>
            <span className={s.phone}>
              <IconButton icon="shopping-bag" label="empty bag" size={104} badge={0} rattle quip="*rattle* … nothing in here" onClick={() => router.push(SHOP_HREF)} />
            </span>
            <h2 className={s.emptyTitle}>your cart is empty. so are our bottles.</h2>
            <p className={s.emptyAside}>honestly, it&apos;s the most on-brand thing here.</p>
            <div className={s.emptyCta}>
              <Button size="lg" fullWidth arrow magnetic quip="four kinds of nothing" onClick={() => router.push(SHOP_HREF)}>
                go to shop
              </Button>
            </div>
          </div>
        )}
      </main>

      <div className={s.jokes}>
        <Ticker tone="accent" items={JOKES} speed={30} />
      </div>

      {/* phone: checkout bar stuck to the bottom, or the log in sheet */}
      {ready && hasItems && (
        <>
          {askLogin ? (
            <div role="dialog" aria-label="log in to place your free order" className={s.sheet}>
              <AuthPrompt phone onClose={() => setAskLogin(false)} />
            </div>
          ) : (
            <div className={s.bar}>
              <div className={s.barTotal}>
                <span className={s.barLabel}>total</span>
                <span className={s.barValue}>free</span>
              </div>
              <div className={s.barCta}>
                <Button size="lg" fullWidth arrow quip="total: still zero" onClick={checkout}>
                  checkout for free
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

// Space so the phone checkout bar never covers the footer.
export function CartBarSpacer() {
  const { count, ready } = useCart();
  return ready && count > 0 ? <div aria-hidden="true" className={cx(s.barSpacer, s.phone)} /> : null;
}
