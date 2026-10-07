import Image from 'next/image';
import { sceneSrc, type Flavour } from '@/components/ds/assets';
import { Button } from '@/components/ds/Button';
import { Sticker } from '@/components/ds/Sticker';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import type { Product } from '@/lib/supabase';
import s from './shop.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const FLAVOUR_SLUGS: Flavour[] = ['vanilla', 'chocolate', 'strawberry', 'latte'];
const isFlavour = (slug: string): slug is Flavour => (FLAVOUR_SLUGS as string[]).includes(slug);

const formatPrice = (price: number) => `£${Number(price).toFixed(2)}`;

function ProductCard({ product }: { product: Product }) {
  // Cards show the flavour's scene art; anything without one falls back to the product's own image.
  const img = isFlavour(product.slug) ? sceneSrc(product.slug) : product.image_path;
  return (
    <article className={s.card}>
      <div className={s.cardArt}>
        <Image
          src={img}
          alt={`${product.name} can`}
          width={673}
          height={841}
          sizes="(max-width: 1100px) 50vw, 25vw"
          className={s.cardImg}
        />
        <span className={s.cardSticker}>
          <span className={s.desk}>
            <Sticker tone="free" rotate={8}>
              free
            </Sticker>
          </span>
          <span className={s.phone}>
            <Sticker tone="free" size="sm" rotate={8}>
              free
            </Sticker>
          </span>
        </span>
      </div>
      <div className={s.cardBody}>
        <div className={s.cardTop}>
          <h3 className={s.cardName}>{product.name}</h3>
          <span className={s.price}>{formatPrice(product.price)}</span>
        </div>
        <p className={s.cardLine}>{product.description}</p>
        <div className={s.addWrap}>
          {/* Add to cart doesn't do anything yet. */}
          <Button size="sm" icon="plus" fullWidth quip="it's free. go wild.">
            add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ShopPage({ products }: { products: Product[] | null }) {
  const count = products?.length ?? 0;
  return (
    <div className={s.page}>
      <SiteHeader active="shop" />

      <main>
        <section className={s.header}>
          <div className={s.headCopy}>
            <h1 className={s.h1}>Shop all.</h1>
            <p className={s.aside}>Everything is free, because nothing is real.</p>
          </div>
          <div className={s.headSide}>
            <span className={s.desk}>
              <Sticker tone="free" shape="round" size="lg" wobble peelable>
                £0.00 forever
              </Sticker>
            </span>
            <span className={cx(s.phone, s.headSticker)}>
              <Sticker tone="free" shape="round" size="md" wobble peelable>
                £0.00 forever
              </Sticker>
            </span>
            <span className={s.meta}>
              {count} {count === 1 ? 'flavour' : 'flavours'} · 0 in stock · ships never
            </span>
          </div>
        </section>

        <section className={s.shelf}>
          {products ? (
            <>
              <div className={s.grid}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <p className={cx(s.outro, s.desk)}>that&apos;s the whole range. we ran out of nothing to add ~</p>
              <p className={cx(s.outro, s.phone)}>that&apos;s the whole range ~</p>
            </>
          ) : (
            <p className={s.empty}>The shelf couldn&apos;t load just now. Which, for a shop that sells nothing, is very on brand. Try refreshing.</p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
