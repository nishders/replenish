'use client';

import { Button } from '@/components/ds/Button';
import { SHOP_HREF } from './content';

// Hero CTA: lets the confetti land, then heads to the lineup (the shop page isn't built yet).
export function ShopForFree({ phone = false }: { phone?: boolean }) {
  const go = () => {
    setTimeout(() => {
      document.querySelector(SHOP_HREF)?.scrollIntoView({ behavior: 'smooth' });
    }, 650);
  };
  return (
    <Button
      size="lg"
      arrow
      confetti
      quip="it's free. obviously."
      onClick={go}
      {...(phone ? { fullWidth: true, style: { width: '100%' } } : { magnetic: true })}
    >
      shop for free
    </Button>
  );
}
