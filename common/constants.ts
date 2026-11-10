export const MAX_SIZE_BYTES = 15728640;

export const HOST = `https://api.internet.dev`;
// export const HOST = `http://localhost:10001`;

export const LINKS = !HOST.startsWith('https')
  ? {
      PAYING: 'https://buy.stripe.com/test_9AQ9AQ5jdf42axWeUU',
      GENERAL_CO_WORKING: 'https://buy.stripe.com/test_3cs28oeTNaNMbC0145',
      PARTNER: 'https://buy.stripe.com/test_3cs8wMfXR1dcgWkaEG',
    }
  : {
      PAYING: 'https://buy.stripe.com/28og0B2f9eIj8Io9AA',
      GENERAL_CO_WORKING: 'https://buy.stripe.com/14A3cugRqaR99AQd0y6Zy04',
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

// NOTE(claude)
// Links such as https://users.garden/#device-check open a compliance view
// directly, so the device check script and the compliance pages can send a
// signed-in team member straight to the step they need.
export const DASHBOARD_HASHES: Record<string, string> = {
  compliance: 'USER_COMPLIANCE',
  'device-check': 'USER_DEVICE_CHECK',
  training: 'USER_TRAINING',
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

// NOTE(@caidanw)
// Sizes on the office floor plan, in inches. Estimates until the desks are measured; change them
// here. Desks are about twice as wide as they are deep (two desks back to back match one desk's
// width), like the common 48 x 24 (or 120 x 60 cm) desk. A desk is its depth, then the chair, then
// the walkway behind the chair, which is as deep as the chair: room to push back and stand up.
export const Office = {
  DESK_WIDTH_IN: 48,
  DESK_DEPTH_IN: 24,
  CHAIR_IN: 26,
  WALKWAY_IN: 26,
  NUDGE_IN: 6,
  NUDGE_SHIFT_IN: 36,
  // Places named on the plan to help people find their way, centered at these points. `rotate`
  // turns a label (in degrees) to fit a narrow room. Labels are LABEL_IN tall on the plan, so they
  // zoom with it, but never smaller than LABEL_MIN_PX on screen.
  LABEL_IN: 18,
  LABEL_MIN_PX: 10,
  LABELS: [
    { text: 'Entrance', x_in: 63, y_in: 95, rotate: -90 },
    { text: 'Kitchen', x_in: 793, y_in: 252, rotate: 0 },
    { text: 'Kitchenette', x_in: 630, y_in: 468, rotate: 0 },
    { text: 'Restrooms', x_in: 946, y_in: 573, rotate: 0 },
    { text: 'Garage', x_in: 84, y_in: 567, rotate: 0 },
  ],
};
