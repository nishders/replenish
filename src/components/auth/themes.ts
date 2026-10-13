import type { AuthTheme } from './AuthLayout';

// Per-page colours, art and jokes for the account pages.

export const LOGIN_THEME: AuthTheme = {
  accountQuip: 'you are here. sadly.',
  panel: 'var(--zest-100)',
  tilt: -8,
  tiltPhone: -4,
  ticker: ['you came back', 'on purpose??', 'bold choice', 'nothing has changed', 'still 0g', 'why tho', 'ok welcome i guess'],
  driftWord: 'why tho',
  flavour: 'latte',
  artBg: '#CAEEFA',
  artAlt: 'a can of replenish iced latte, roughly',
  sticker: 'still 0g',
  artLine: "it didn't miss you. it's a can. it can't.",
};

export const SIGNUP_THEME: AuthTheme = {
  accountQuip: 'back so soon?',
  panel: 'var(--nish-100)',
  tilt: 7,
  tiltPhone: 4,
  ticker: ['a new one??', 'population: you', 'welcome to nothing', 'still 0g', 'no charges, no refunds', 'bold life choice', 'tell no one'],
  driftWord: 'a new one??',
  flavour: 'strawberry',
  artBg: '#FCCFDC',
  artAlt: 'a can of replenish strawberry (trace amounts)',
  sticker: 'new member, 0g',
  artLine: 'ten seconds to sign up. a lifetime of not drinking it.',
};

export const FORGOT_THEME: AuthTheme = {
  accountQuip: 'or try remembering first',
  panel: 'var(--flavour-latte-tint)',
  tilt: -5,
  tiltPhone: -2.5,
  ticker: ['forgot it?', 'happens to everyone', 'it was probably password123', 'no judgement', 'ok, a little judgement', 'still 0g'],
  driftWord: 'oops',
  flavour: 'vanilla',
  artBg: '#FDF3C7',
  artAlt: 'a can of replenish vanilla-ish',
  sticker: 'memory: 0g',
  artLine: "it's fine. we forget things too. like the protein.",
};

export const RESET_THEME: AuthTheme = {
  accountQuip: 'nearly back in',
  panel: 'var(--flavour-strawberry-tint)',
  tilt: 9,
  tiltPhone: 4.5,
  ticker: ['new password', 'same zero protein', 'make it a good one', 'not password123', "write it down (don't)", 'still 0g'],
  driftWord: 'shh',
  flavour: 'chocolate',
  artBg: '#EDD0B9',
  artAlt: 'a can of replenish chocolate, allegedly',
  sticker: 'fresh start',
  artLine: 'new password. same can. same nothing inside.',
};
