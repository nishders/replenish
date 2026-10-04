// Design-system asset URLs. Files live in /public (copied from the design system's assets/).

export type Flavour = 'vanilla' | 'chocolate' | 'strawberry' | 'latte';

export const packSrc = (flavour: Flavour) => `/packs/${flavour}.png`;
export const sceneSrc = (flavour: Flavour) => `/packs/${flavour}-scene.png`;

export const AVATAR_COUNT = 6;
export const avatarSrc = (n: number) =>
  `/avatars/avatar-${((((n - 1) % AVATAR_COUNT) + AVATAR_COUNT) % AVATAR_COUNT) + 1}.png`;
