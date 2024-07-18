export const MAX_SIZE_BYTES = 15728640;

export const HOST = `https://api.internet.dev`;
// export const HOST = `http://localhost:10001`;

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
