import type { FooterColumn } from '@/components/ds/Footer';
import type { NavItem } from '@/components/ds/NavBar';
import { LINEUP } from '@/components/landing/content';

// Nav + footer copy shared by every page. Links are absolute so they work from any page.
export const SHOP_HREF = '/shop';
export const ABOUT_HREF = '/#about';

export const NAV_LINKS: NavItem[] = [
  { label: 'shop', id: 'shop', href: SHOP_HREF, quip: "it's all free" },
  { label: 'what is this?', id: 'about', href: ABOUT_HREF, quip: 'good question' },
];

const flavourLinks = LINEUP.map((f) => ({ label: f.name, href: SHOP_HREF }));
const accountLinks = [
  { label: 'log in', href: '#' },
  { label: 'my orders', href: '#' },
  { label: 'cart', href: '#' },
];
const truthLinks = [
  { label: 'what is this?', href: ABOUT_HREF },
  { label: 'credits', href: '#' },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: 'shop', links: flavourLinks },
  { title: 'account', links: accountLinks },
  { title: 'the truth', links: [...truthLinks, { label: 'github', href: '#' }] },
];

// The phone footer drops github and stacks "the truth" under "account".
export const PHONE_FOOTER_COLUMNS: FooterColumn[] = [
  { title: 'shop', links: flavourLinks },
  { title: 'account', links: accountLinks },
  { title: 'the truth', links: truthLinks },
];

export const CREDIT = 'designed & built by nish';
