import styles from '@components/UserGardenGetStarted.module.css';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import Input from '@system/Input';
import MonospacePreview from '@system/MonospacePreview';
import StandardLayout from '@components/StandardLayout';
import StandardHeader from '@components/StandardHeader';
import StandardLayoutSection from '@components/StandardLayoutSection';

import { P } from '@system/typography';

export default function UserDanger(props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <StandardLayout>
      <StandardHeader
        title="Welcome"
        footerElement={
          <div className={styles.actions}>
            <ButtonPrimary onClick={() => props.onNavigate({ active: 'USER_OFFICE', nextOrganization: null })} style={{ margin: `0 24px 16px 0` }}>
              Get workspace
            </ButtonPrimary>
            <Button onClick={() => props.onNavigate({ active: 'USER_PROFILE', nextOrganization: null })}>Settings</Button>
          </div>
        }
      >
        Welcome! You can manage your account, organization, and physical workspace from here.
      </StandardHeader>

      <StandardLayoutSection title="Get started">
        <P style={{ marginTop: 6, paddingBottom: 88 }}>Here is everything you need to start using our API for authentication, user management, and more.</P>
      </StandardLayoutSection>

      <StandardLayoutSection title="Tell your agent how to use our API">
        <P style={{ marginTop: 6 }}>
          If you're building with an AI agent or coding assistant, you can give it our skills file. It has everything your agent needs to understand every endpoint, including authentication, user management, credits, organizations, and more.
        </P>
        <ButtonPrimary
          style={{ marginTop: 24 }}
          href="https://api.internet.dev/SKILL.md"
          target="_blank"
        >
          View skills file
        </ButtonPrimary>
      </StandardLayoutSection>

      <StandardLayoutSection title="How does a user sign in?">
        <P style={{ marginTop: 6 }}>
          You can authenticate users by making a simple request to our API. Here's an example using fetch. You can do the same thing from any language or tool that supports HTTP requests.
        </P>
        <MonospacePreview title="api/users/authenticate" style={{ marginTop: 24 }}>{`
const email = '${props.viewer.email}';
const password = '****-****-****-****';
const source = 'your-app.com';

const response = await fetch('https://api.internet.dev/api/users/authenticate', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password, source }),
});

const json = await response.json();
console.log(json);
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          Here's the same request using cURL. The source field is optional but recommended — it tags the user's account so you and your users can see which app they signed in from.
        </P>
        <MonospacePreview title="api/users/authenticate" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/users/authenticate" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "${props.viewer.email}", "password": "****-****-****-****", "source": "your-app.com"}'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          When the sign-in succeeds, you'll get back a user object with an API key. Use this key to authenticate all future requests. Check out{' '}
          <a href="https://github.com/internet-development/www-users-garden/blob/main/common/queries.ts" style={{ color: `var(--theme-primary)` }}>
            our reference
          </a>{' '}
          to see all the things you can do with it.
        </P>
        <MonospacePreview style={{ marginTop: 24 }} title="api/users/authenticate">{`
{
  "user":{
    "id" : "${props.viewer.id}",
    "email" : "${props.viewer.email}",
    "key" : "********-****-****-****",
    "level" : "${props.viewer.level}",
    "data" : {},
    "created_at" : "${props.viewer.created_at}",
    "updated_at" : "${props.viewer.updated_at}",
    "deleted_at" : null,
    "username" : "${props.viewer.username}"
  },
  "existing":true
}
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          After a successful sign-in, you'll probably want to save the API key in a cookie so the user stays logged in. Here's a quick example — just swap out the cookie name for something that fits your app.
        </P>
        <MonospacePreview style={{ marginTop: 24 }} title="import Cookies from 'js-cookie'">{`
Cookies.set(
  'your-cookie-key',
  '********-****-****-****',
  {
    secure: true
  }
);
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          To check if someone is already signed in, you can read the cookie on the server and verify it against our API. Here's how that looks with Next.js and getServerSideProps.
        </P>

        <MonospacePreview style={{ marginTop: 24 }} title="getServerSideProps">{`
export async function getServerSideProps(context) {
  let viewer;
  let sessionKey = context.req.cookies['your-cookie-key'] || '';

  try {
    const response = await fetch('https://api.internet.dev/api/users/viewer', {
      method: 'POST',
      headers: {
        'X-API-KEY': sessionKey,
        'Content-Type': 'application/json'
      },
    });
    const result = await response.json();
    if (result && result.viewer) {
      viewer = result.viewer;
    }
  } catch (e) {}

  return {
    props: {
      viewer,
    },
  };
}
        `}</MonospacePreview>
      </StandardLayoutSection>

      <StandardLayoutSection title="How do I customize the emails my users receive?">
        <P style={{ marginTop: 6 }}>
          When users sign up or reset their password through your app, we send them an email on your behalf. By default, these come from API.INTERNET.DEV. If you have an organization set up, you can customize the sender, subject, and body so your users see your branding instead.
        </P>

        <P style={{ marginTop: 88 }}>
          To set a custom verification email, update your organization with the email field. This is the email your users receive when they create a new account and need to verify their address.
        </P>
        <MonospacePreview title="api/organizations/update" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/organizations/update" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ********-****-****-****" \\
  -d '{
    "domain": "your-org.com",
    "data": {
      "email": {
        "from": "YourApp <no-reply@yourapp.com>",
        "subject": "Verify your email for YourApp",
        "text": "Thanks for signing up! Click the link below to verify your email."
      }
    }
  }'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          You can also customize the email that gets sent when a user resets their password.
        </P>
        <MonospacePreview title="api/organizations/update" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/organizations/update" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ********-****-****-****" \\
  -d '{
    "domain": "your-org.com",
    "data": {
      "email_reset_password": {
        "from": "YourApp <no-reply@yourapp.com>",
        "subject": "Reset your YourApp password",
        "text": "We received a request to reset your password. Click the link below to sign in and change it."
      }
    }
  }'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          If a user signs up through OAuth (Google, Apple, or Bluesky), we generate a password for them and send it by email. You can customize that email too.
        </P>
        <MonospacePreview title="api/organizations/update" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/organizations/update" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ********-****-****-****" \\
  -d '{
    "domain": "your-org.com",
    "data": {
      "email_send_password": {
        "from": "YourApp <no-reply@yourapp.com>",
        "subject": "Your new YourApp account",
        "text": "Welcome! Here is your password. Please sign in and change it as soon as possible."
      }
    }
  }'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          For any of these custom emails to take effect, pass your organization's domain as the source field when authenticating users. The API looks up your organization by that domain and uses your templates if they exist.
        </P>
        <MonospacePreview title="api/users/authenticate" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/users/authenticate" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "${props.viewer.email}", "password": "****-****-****-****", "source": "your-org.com"}'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          The same applies to password resets — pass the source field so the reset email uses your custom template.
        </P>
        <MonospacePreview title="api/users/reset-password" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/users/reset-password" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "${props.viewer.email}", "source": "your-org.com"}'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          Each email object supports three fields: from (the sender name and address), subject (the subject line), and text (the body). The verification link or password is appended to the body automatically — you don't need to include it yourself. You can also manage these settings from the{' '}
          <a
            style={{ color: `var(--theme-primary)`, cursor: 'pointer' }}
            onClick={() => props.onNavigate({ active: 'USER_ORGANIZATIONS', nextOrganization: null })}
          >
            Organizations
          </a>{' '}
          page.
        </P>
      </StandardLayoutSection>
    </StandardLayout>
  );
}
