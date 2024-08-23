export const MAX_SIZE_BYTES = 15728640;

export const HOST = `https://api.internet.dev`;
// export const HOST = `http://localhost:10001`;

export const LINKS = HOST.startsWith('http')
  ? {
      PAYING: 'https://buy.stripe.com/test_9AQ9AQ5jdf42axWeUU',
      GENERAL_CO_WORKING: 'https://buy.stripe.com/test_3cs28oeTNaNMbC0145',
      PARTNER: 'https://buy.stripe.com/test_3cs8wMfXR1dcgWkaEG',
    }
  : {
      PAYING: 'https://buy.stripe.com/28og0B2f9eIj8Io9AA',
      GENERAL_CO_WORKING: 'https://buy.stripe.com/7sI7u5f1V2ZB1fW145',
      PARTNER: 'https://buy.stripe.com/8wMaGh6vp43F5wccMO',
    };

export const Users = {
  tiers: {
    UNVERIFIED: 0,
    VERIFIED: 10,
    PAYING: 20,
    GENERAL_CO_WORKING: 30,
    PARTNER: 40,
    ADMIN: 100,
  },
};

export const Payouts = {
  PAYING: 1500,
  GENERAL_CO_WORKING: 45000,
  PARTNER: 45000,
};

export const TEMPLATE_POSTS = [
  { href: 'https://txt.dev/wwwjim/intdev-acceptable-use', label: 'Acceptable Use' },
  { href: 'https://txt.dev/wwwjim/intdev-privacy-policy', label: 'Privacy Policy' },
  { href: 'https://txt.dev/wwwjim/intdev-terms-of-service', label: 'Terms of Service' },
];

export const TEMPLATE_LINKS = [
  { href: 'https://bsky.app/profile/internetstudio.bsky.social', label: 'Bluesky' },
  { href: 'https://github.com/internet-development/nextjs-sass-starter', label: 'Github' },
  { href: 'https://internet.dev', label: 'internet.dev' },
  { href: 'https://read.cv/teams/intdev', label: 'ReadCV' },
  { href: 'https://x.com/internetxstudio', label: 'X (formerly Twitter)' },
];
