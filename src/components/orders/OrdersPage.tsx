'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import c from '@/components/cart/cart.module.css';
import { sceneSrc, type Flavour } from '@/components/ds/assets';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { Message } from '@/components/ds/Message';
import { Ticker } from '@/components/ds/Ticker';
import { OrderDate } from '@/components/order/OrderDate';
import { SHOP_HREF } from '@/components/site/content';
import { cartActions } from '@/lib/cart';
import s from './orders.module.css';

const cx = (...k: (string | false | undefined)[]) => k.filter(Boolean).join(' ');

export const ORDER_JOKES = ['a proud history of nothing', 'lifetime protein delivered: 0g', 'lifetime spend: £0.00', 'estimated delivery: never', 'order again. we dare you'];
const FLAVOURS: Flavour[] = ['vanilla', 'chocolate', 'strawberry', 'latte'];
const PAGE = 6;
const SHOWN_TILES = 3;
const AGAIN_MS = 1600;

export type PastOrderItem = { slug: string; name: string; image_path: string; quantity: number };
export type PastOrder = { number: string; createdAt: string; items: PastOrderItem[] };

const thumbSrc = (i: PastOrderItem) => ((FLAVOURS as string[]).includes(i.slug) ? sceneSrc(i.slug as Flavour) : i.image_path);
const cansLine = (n: number) => `${n} can${n === 1 ? '' : 's'} · 0g protein`;

// `count` is null while orders are still loading.
function Stats({ count }: { count: number | null }) {
  const note = count === null ? 'counting…' : count === 0 ? 'a clean record' : count === 1 ? 'a humble start' : 'and counting (to nothing)';
  return (
    <>
      <dl className={s.stats}>
        <div className={s.stat}>
          <dt className={s.statLabel}>orders placed</dt>
          {count === null ? (
            <dd aria-label="counting" className={cx(s.sk, s.skPulse)} style={{ margin: 0, width: 64, height: 44, borderRadius: 12 }} />
          ) : (
            <dd className={s.statValue}>{count}</dd>
          )}
          <span className={s.statNote}>{note}</span>
        </div>
        <div className={s.stat}>
          <dt className={s.statLabel}>protein received</dt>
          <dd className={s.statValue}>0g</dd>
          <span className={s.statNote}>exactly as promised</span>
        </div>
        <div className={s.stat}>
          <dt className={s.statLabel}>money spent</dt>
          <dd className={s.statMoney}>£0.00</dd>
          <span className={s.statNote}>and we&apos;d do it again</span>
        </div>
      </dl>
      <p className={cx(s.statsNote, s.phone)}>exactly as promised. and we&apos;d do it again.</p>
    </>
  );
}

function Steps() {
  return (
    <div className={s.status}>
      <span className={s.statusLabel}>status</span>
      <ol aria-label="delivery status" className={s.steps}>
        <li className={s.step}>
          <span className={cx(s.dot, s.dotDone)}>
            <Icon name="check" size={16} />
          </span>
          <span className={s.stepText}>order placed ✓</span>
          <span aria-hidden="true" className={s.stepLine} />
          <span />
        </li>
        <li aria-current="step" className={s.step}>
          <span className={cx(s.dot, s.dotNow)}>
            <Icon name="package" size={16} />
          </span>
          <span className={s.stepText}>
            packing nothing <span className={s.stepSub}>· permanently</span>
          </span>
          <span aria-hidden="true" className={cx(s.stepLine, s.stepLineNext)} />
          <span />
        </li>
        <li className={s.step}>
          <span className={cx(s.dot, s.dotNever)}>
            <Icon name="x" size={16} />
          </span>
          <span className={s.stepText}>delivered never</span>
        </li>
      </ol>
    </div>
  );
}

function OrderCard({ order }: { order: PastOrder }) {
  const router = useRouter();
  const [flag, setFlag] = useState<'added' | 'full' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const cans = order.items.reduce((n, i) => n + i.quantity, 0);
  const shown = order.items.slice(0, SHOWN_TILES);
  const extra = order.items.length - shown.length;
  const view = () => router.push(`/order/${order.number}`);

  // Puts this order's flavours back in the cart (each still capped at 10).
  const again = () => {
    if (flag) return;
    const added = cartActions.addMany(order.items.map((i) => ({ slug: i.slug, quantity: i.quantity })));
    setFlag(added ? 'added' : 'full');
    timer.current = setTimeout(() => setFlag(null), AGAIN_MS);
  };

  return (
    <article aria-label={`order ${order.number}`} className={s.order}>
      <div className={s.orderHead}>
        <div className={s.orderId}>
          <h2 className={s.orderNumber}>order #{order.number}</h2>
          <span className={s.orderDate}>
            placed <OrderDate iso={order.createdAt} />
          </span>
        </div>
        <div className={s.orderTotal}>
          <span className={s.countLine}>{cansLine(cans)}</span>
          <span className={s.totalLabel}>total</span>
          <span className={s.totalValue}>free</span>
        </div>
      </div>
      <div className={s.orderBody}>
        <ul aria-label="items" className={s.tiles}>
          {shown.map((i) => (
            <li key={i.slug} className={s.tile}>
              <Image src={thumbSrc(i)} alt={`${i.name} can`} width={192} height={192} className={s.tileImg} />
              <span className={s.tileName}>{i.name}</span>
              <span aria-label={`quantity ${i.quantity}`} className={s.tileQty}>
                × {i.quantity}
              </span>
            </li>
          ))}
          {extra > 0 && (
            <li className={s.tile}>
              <span aria-label={`plus ${extra} more flavour${extra > 1 ? 's' : ''}`} className={s.more}>
                +{extra} more
              </span>
              <span className={s.seeDetails}>see details</span>
            </li>
          )}
        </ul>
        <div className={cx(s.phoneTotal, s.phone)}>
          <span className={s.phoneTotalLabel}>
            total <span className={s.phoneTotalLine}>· {cansLine(cans)}</span>
          </span>
          <span className={s.phoneTotalValue}>free</span>
        </div>
        <Steps />
      </div>
      <div className={s.orderFoot}>
        <span className={s.again}>the same nothing, again.</span>
        <span role="status" className={s.srOnly}>
          {flag === 'added' ? `order ${order.number} added to cart` : flag === 'full' ? 'cart is full, nothing added' : ''}
        </span>
        <span className={s.viewBtn}>
          <Button variant="outline" fullWidth quip="relive the nothing" onClick={view}>
            view details
          </Button>
        </span>
        <span className={s.againBtn}>
          <Button
            fullWidth
            icon={flag === 'added' ? 'check' : flag === 'full' ? 'x' : 'shopping-bag'}
            disabled={!!flag}
            quip="we'll charge you £0.00. again."
            onClick={again}
          >
            {flag === 'added' ? 'added!' : flag === 'full' ? "cart's full" : 'order again'}
          </Button>
        </span>
      </div>
    </article>
  );
}

export function OrdersPage({ orders, failed }: { orders: PastOrder[]; failed: boolean }) {
  const router = useRouter();
  const [limit, setLimit] = useState(PAGE);
  const [retrying, setRetrying] = useState(false);
  const total = orders.length;

  const retry = () => {
    setRetrying(true);
    router.refresh();
    setTimeout(() => setRetrying(false), 1800);
  };

  return (
    <>
      <main>
        <OrdersHeader count={failed ? undefined : total} />

        {failed ? (
          retrying ? (
            <OrdersSkeleton />
          ) : (
            <div className={s.errorWrap}>
              <div className={s.errorMsg}>
                <Message tone="error" title="we couldn't fetch your orders.">
                  they&apos;re probably still nothing. check your connection and try again.
                </Message>
              </div>
              <Button size="lg" quip="once more, with feeling" onClick={retry}>
                try again
              </Button>
            </div>
          )
        ) : total === 0 ? (
          <div className={s.emptyWrap}>
            <div className={c.empty}>
              <span aria-hidden="true" className={cx(c.emptyDoodle, c.e1)}>
                0g
              </span>
              <span aria-hidden="true" className={cx(c.emptyDoodle, c.e2)}>
                ~ ~
              </span>
              <span aria-hidden="true" className={cx(c.emptyDoodle, c.e3)}>
                ✶
              </span>
              <span className={s.desk}>
                <IconButton icon="package" label="empty box" size={128} rattle quip="*rattle* … nothing in here" onClick={() => router.push(SHOP_HREF)} />
              </span>
              <span className={s.phone}>
                <IconButton icon="package" label="empty box" size={104} rattle quip="*rattle* … nothing in here" onClick={() => router.push(SHOP_HREF)} />
              </span>
              <h2 className={c.emptyTitle}>no orders yet. you&apos;re missing out on nothing.</h2>
              <p className={c.emptyAside}>impressive restraint, honestly.</p>
              <div className={c.emptyCta}>
                <Button size="lg" fullWidth arrow magnetic quip="it's all free" onClick={() => router.push(SHOP_HREF)}>
                  go to shop
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={s.list}>
            {orders.slice(0, limit).map((o) => (
              <OrderCard key={o.number} order={o} />
            ))}
            {total > PAGE &&
              (limit < total ? (
                <div className={s.moreWrap}>
                  <Button variant="outline" size="lg" quip="dig deeper into nothing" onClick={() => setLimit((l) => l + PAGE)}>
                    load more
                  </Button>
                  <p className={s.moreLine}>
                    showing {limit} of {total}
                  </p>
                </div>
              ) : (
                <p className={s.moreLine}>
                  ✶ that&apos;s all {total} orders. all of the nothing. ✶
                </p>
              ))}
          </div>
        )}
      </main>
      <div className={s.jokes}>
        <Ticker tone="accent" items={ORDER_JOKES} speed={30} />
      </div>
    </>
  );
}

// Page title + stats. `count`: a number, null while loading, or undefined to hide the stats (load failed).
export function OrdersHeader({ count }: { count?: number | null }) {
  return (
    <header className={s.header}>
      <div className={s.titles}>
        <p className={s.kicker}>all of it, accounted for.</p>
        <h1 className={s.h1}>your orders. a proud history of nothing.</h1>
      </div>
      {count !== undefined && <Stats count={count} />}
    </header>
  );
}

// Placeholder cards while orders load (also used by app/orders/loading.tsx).
export function OrdersSkeleton() {
  return (
    <div aria-busy="true" className={s.loading}>
      <p role="status" className={s.loadingText}>
        loading your orders…
      </p>
      {[1, 2, 3].map((k) => (
        <div key={k} aria-hidden="true" className={s.skeleton}>
          <div className={s.skRow}>
            <span className={s.sk} style={{ width: 'min(280px, 60%)', height: 28 }} />
            <span className={s.sk} style={{ width: 120, height: 28 }} />
          </div>
          <div className={s.skRow}>
            <div className={s.skTiles}>
              <span className={s.sk} style={{ width: 96, height: 96, borderRadius: 18 }} />
              <span className={s.sk} style={{ width: 96, height: 96, borderRadius: 18 }} />
            </div>
          </div>
          <div className={s.skRow} style={{ justifyContent: 'flex-end' }}>
            <span className={s.sk} style={{ width: 150, height: 48, borderRadius: 999 }} />
            <span className={s.sk} style={{ width: 160, height: 48, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
