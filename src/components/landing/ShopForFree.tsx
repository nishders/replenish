'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ds/Button';
import { SHOP_HREF } from '@/components/site/content';

// Hero CTA: lets the confetti land, then heads to the shop.
export function ShopForFree({ phone = false }: { phone?: boolean }) {
  const router = useRouter();
  const go = () => {
    setTimeout(() => router.push(SHOP_HREF), 650);
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
