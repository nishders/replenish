import type { Flavour } from '@/components/ds/assets';
import type { FooterColumn } from '@/components/ds/Footer';
import type { NavItem } from '@/components/ds/NavBar';

// The shop page isn't built yet, so shop links point at the lineup section for now.
export const SHOP_HREF = '#lineup';
export const ABOUT_HREF = '#about';

export const NAV_LINKS: NavItem[] = [
  { label: 'shop', id: 'shop', href: SHOP_HREF, quip: "it's all free" },
  { label: 'what is this?', id: 'about', href: ABOUT_HREF, quip: 'good question' },
];

export const ZERO_TICKER = ['0g protein', '0g sugar', '0g drink', '0ml per can', '100% imaginary'];

export const BENEFITS = [
  { doodle: '0g', tone: 'vanilla', title: 'Zero protein.', body: 'The least protein per ml on the market. We checked twice. Still none.' },
  { doodle: '✶', tone: 'strawberry', title: 'Clinically untested.', body: 'No clinics were bothered in the making of this drink.' },
  { doodle: '?', tone: 'latte', title: 'Loved by zero athletes.', body: 'And zero non-athletes too. Nobody has tried it. Nobody can.' },
  { doodle: '~', tone: 'brand', title: 'Now with even less.', body: 'Our new formula removes the last thing left: the drink.' },
] as const;

export const LINEUP: { flavour: Flavour; name: string; line: string }[] = [
  { flavour: 'vanilla', name: 'vanilla-ish', line: 'Tastes like nothing.' },
  { flavour: 'chocolate', name: 'chocolate, allegedly', line: 'No chocolate was involved in the making of this claim.' },
  { flavour: 'strawberry', name: 'strawberry (trace amounts)', line: 'May contain the memory of a strawberry.' },
  { flavour: 'latte', name: 'iced latte, roughly', line: 'All of the protein of coffee, which is none.' },
];

export const REVIEWS = [
  { avatar: 1, quote: 'I felt nothing. Five stars.', name: 'Pat Notreal', role: 'imaginary marathoner' },
  { avatar: 2, quote: 'Finally, a shake that respects my decision not to drink it.', name: 'Dee Fictional', role: 'hypothetical gym regular' },
  { avatar: 3, quote: 'In my day we had nothing. This is exactly like that.', name: 'Walt Supposedly', role: 'retired, theoretically', rating: 4 },
  { avatar: 4, quote: 'Shook it for ten minutes. Still nothing. Very consistent.', name: 'Mia Imaginary', role: 'professional shaker' },
  { avatar: 5, quote: 'My gains are exactly where I left them.', name: 'Sam Madeup', role: 'theoretical lifter', rating: 4 },
  { avatar: 6, quote: "I gave one to my grandson. He's still waiting for it.", name: 'Rosa Fakeworth', role: 'doting, allegedly' },
];

export const FAQ = [
  { title: 'Is any of this real?', body: 'The website is. The drink is not. Please do not attempt to drink the website.' },
  { title: 'Why does checkout need a log in?', body: 'So the order flow, database and confirmation email can be shown working end to end.' },
  { title: 'What happens when I order?', body: 'You get an order number, an email, and the warm feeling of having bought nothing.' },
  { title: 'Who made it?', body: 'nish, a designer-developer who wanted a very nish product for a very nish market.' },
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
