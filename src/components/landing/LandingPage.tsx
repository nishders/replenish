import Image from 'next/image';
import { Accordion } from '@/components/ds/Accordion';
import { sceneSrc } from '@/components/ds/assets';
import { BenefitTile } from '@/components/ds/BenefitTile';
import { Button } from '@/components/ds/Button';
import { NutritionPanel } from '@/components/ds/NutritionPanel';
import { Pack } from '@/components/ds/Pack';
import { ReviewCard } from '@/components/ds/ReviewCard';
import { Sticker } from '@/components/ds/Sticker';
import { Ticker } from '@/components/ds/Ticker';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { SHOP_HREF } from '@/components/site/content';
import { BENEFITS, FAQ, LINEUP, REVIEWS, ZERO_TICKER } from './content';
import s from './landing.module.css';
import { ShopForFree } from './ShopForFree';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

// Pack sizes / sticker sizes are props, so the hero art renders once per breakpoint.
function HeroArt({ phone }: { phone?: boolean }) {
  const side = phone ? 250 : 380;
  const mid = phone ? 340 : 540;
  const nudge = phone ? 30 : 44;
  const lift = phone ? 4 : 6;
  return (
    <div className={cx(s.heroArt, phone ? s.phone : s.desk)}>
      <Pack flavour="strawberry" size={side} style={{ transform: `rotate(-9deg) translate(${nudge}px, ${lift}px)` }} />
      <Pack flavour="latte" size={mid} style={{ zIndex: 1 }} />
      <Pack flavour="chocolate" size={side} style={{ transform: `rotate(8deg) translate(-${nudge}px, ${lift}px)` }} />
      <Sticker
        tone="not-real"
        shape="round"
        size={phone ? 'md' : 'lg'}
        wobble
        peelable
        style={{ position: 'absolute', top: 0, right: phone ? 0 : 40, zIndex: 2 }}
      >
        not real
      </Sticker>
      <Sticker
        tone="free"
        rotate={-12}
        size={phone ? 'md' : 'lg'}
        peelable
        style={{ position: 'absolute', bottom: phone ? 40 : 64, left: phone ? 0 : 24, zIndex: 2 }}
      >
        100% free
      </Sticker>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className={s.page}>
      <SiteHeader active="home" />

      <main>
        {/* hero */}
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <Sticker tone="ink" rotate={-2} size="sm" peelable>
              a portfolio project, not a product
            </Sticker>
            <h1 className={s.h1}>The protein shake with the least protein per ml on the market.</h1>
            <p className={s.aside}>Also the least shake.</p>
          </div>
          <HeroArt />
          <HeroArt phone />
          <div className={s.heroCta}>
            <span className={s.desk}>
              <ShopForFree />
            </span>
            <span className={s.phone}>
              <ShopForFree phone />
            </span>
            <span className={s.priceNote}>£0.00 · forever · ships never</span>
          </div>
        </section>

        {/* useless benefits */}
        <section className={s.section}>
          <div className={s.head}>
            <h2 className={s.h2} style={{ maxWidth: 640 }}>
              Proudly useless benefits.
            </h2>
            <p className={s.lede}>We asked a panel of experts. They were also not real.</p>
          </div>
          <div className={cx(s.grid4, s.benefits)}>
            {BENEFITS.map((b) => (
              <BenefitTile key={b.title} {...b} />
            ))}
          </div>
        </section>

        {/* flavour lineup */}
        <section id="lineup" className={cx(s.section, s.scrollSection)}>
          <div className={s.head}>
            <h2 className={s.h2}>The lineup. All four of them.</h2>
            <p className={s.lede}>Four flavours. Nutritionally identical. Spiritually distinct.</p>
          </div>
          <div className={cx(s.grid4, s.lineup)}>
            {LINEUP.map((f) => (
              <a key={f.flavour} href={SHOP_HREF} className={s.card}>
                <Image
                  src={sceneSrc(f.flavour)}
                  alt={`${f.name} can`}
                  width={673}
                  height={841}
                  sizes="(max-width: 760px) 248px, (max-width: 1100px) 50vw, 25vw"
                  className={s.cardImg}
                />
                <div className={s.cardBody}>
                  <span className={s.cardName}>{f.name}</span>
                  <span className={s.cardLine}>{f.line}</span>
                  <div className={s.cardFoot}>
                    <span>£0.00</span>
                    <span className={s.cardShop}>shop →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className={cx(s.swipe, s.phone)}>swipe for more nothing →</p>
        </section>

        <Ticker tone="accent" items={ZERO_TICKER} speed={30} />

        {/* nutrition */}
        <section className={s.nutrition}>
          <div className={s.nutritionCopy}>
            <h2 className={s.mega}>
              0g protein.
              <br />
              0g sugar.
              <br />
              <span className={s.zest}>0g drink.</span>
            </h2>
            <p className={s.nutritionBody}>
              Every can is lab-certified to contain nothing at all, mostly because there is no lab, and no can.
            </p>
          </div>
          <div className={s.panelWrap}>
            <NutritionPanel style={{ transform: 'rotate(2deg)' }} />
          </div>
        </section>

        {/* fake reviews */}
        <section className={cx(s.section, s.scrollSection)}>
          <div className={s.head}>
            <h2 className={s.h2}>Reviews from people we made up.</h2>
            <p className={s.lede} style={{ maxWidth: 380 }}>
              Any resemblance to real customers is impossible. We have none.
            </p>
          </div>
          <div className={cx(s.grid3, s.reviews)}>
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* what is this, really */}
        <section id="about" className={s.about}>
          <div className={s.aboutCopy}>
            <h2 className={s.h2} style={{ marginBottom: 0 }}>
              What is this, really?
            </h2>
            <p className={s.aboutLead}>
              replenish is a portfolio project. I made it because I wanted to build a proper full-stack web app, and had way too much fun
              inventing a drink with nothing in it along the way.
            </p>
            <p className={s.aboutNote}>Nothing is sold. Everything is free. No drinks will arrive, ever. Made by nish.</p>
            <div className={s.aboutCta}>
              <Button variant="outline" arrow quip="the only real thing here">
                see the case study
              </Button>
              <span className={cx(s.trueBit, s.desk)}>this bit&apos;s true ~</span>
            </div>
          </div>
          <Accordion items={FAQ} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
