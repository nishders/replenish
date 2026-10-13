# replenish

**The protein shake with the least protein per ml on the market. Also the least shake.**

replenish is a fictional protein drink brand, designed and built by nish as a portfolio project. Nothing is sold, everything is free, and please do not attempt to drink this website.

## What it shows

- **A brand built from scratch.** Logo, colour palette, type, illustrated cans for four flavours, and a playful, self-aware voice.
- **A custom design system.** Design tokens for colour, type, spacing, shape and motion, plus reusable components like buttons, stickers, product packs, reviews, a nutrition panel and an accordion.
- **A shop backed by a real database.** The shop page reads its flavours from a Supabase table, protected so visitors can read the products but never change them.
- **Small, bouncy interactions.** Buttons that squish, stickers that wobble, cans that tilt, and googly eyes that follow your cursor.
- **Accessible and responsive.** Readable contrast on every background, and a layout that works on phones.

## Built with

- [Next.js](https://nextjs.org) and React
- TypeScript
- [Supabase](https://supabase.com) (Postgres database with row level security)
- Plain CSS with design tokens and CSS Modules

## Project structure

```
src/
  app/                 pages (landing, shop), layout and global styles
  components/ds/       design-system components
  components/site/     shared header, footer and navigation copy
  components/landing/  landing page sections and copy
  components/shop/     shop page and product cards
  lib/                 Supabase connection
  styles/              design tokens
public/                fonts, can artwork and avatars
```

---

Made by nish with claude code.
