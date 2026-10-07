import { Footer } from '@/components/ds/Footer';
import { GooglyEyes } from '@/components/ds/GooglyEyes';
import { Logo } from '@/components/ds/Logo';
import { NavBar } from '@/components/ds/NavBar';
import { Ticker } from '@/components/ds/Ticker';
import { CREDIT, FOOTER_COLUMNS, NAV_LINKS, PHONE_FOOTER_COLUMNS } from './content';
import s from './site.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

// Ticker + sticky nav. `active` is the nav link id to underline ('home', 'shop', 'about').
export function SiteHeader({ active }: { active?: string }) {
  return (
    <>
      <Ticker />
      <header className={s.nav}>
        <div className={s.desk}>
          <NavBar links={NAV_LINKS} active={active} cartCount={0} />
        </div>
        <div className={s.phone}>
          <NavBar compact cartCount={0} />
        </div>
      </header>
    </>
  );
}

function PhoneFooter() {
  const [shop, account, truth] = PHONE_FOOTER_COLUMNS;
  const links = (c: typeof shop) => c.links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>);
  return (
    <footer className={cx(s.pFooter, s.phone)}>
      <div className={s.pFooterTop}>
        <div className={s.pFooterIntro}>
          <GooglyEyes size={24} />
          <p className={s.pDisclaimer}>replenish is a portfolio project. Please do not attempt to drink this website.</p>
          <p className={s.pCredit}>{CREDIT}</p>
        </div>
        <div className={s.pCols}>
          <div className={s.pCol}>
            <span className={s.pColTitle}>{shop.title}</span>
            {links(shop)}
          </div>
          <div className={s.pCol}>
            <span className={s.pColTitle}>{account.title}</span>
            {links(account)}
            <span className={s.pColTitle}>{truth.title}</span>
            {links(truth)}
          </div>
        </div>
      </div>
      <div className={s.pFooterLogo}>
        <Logo size={82} />
      </div>
    </footer>
  );
}

export function SiteFooter() {
  return (
    <>
      <div className={s.desk}>
        <Footer columns={FOOTER_COLUMNS} credit={CREDIT} />
      </div>
      <PhoneFooter />
    </>
  );
}
