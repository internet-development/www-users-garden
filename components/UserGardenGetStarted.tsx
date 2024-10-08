import styles from '@components/UserGardenGetStarted.module.scss';

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
        Welcome! You can manage your account, organization, and physical workspace on this website.
      </StandardHeader>

      <StandardLayoutSection title="Get started">
        <P style={{ marginTop: 6, paddingBottom: 88 }}>Follow these steps to leverage our API as a centralized authentication for your service.</P>
      </StandardLayoutSection>

      <StandardLayoutSection title="How does a user sign in?">
        <P style={{ marginTop: 6 }}>
          We offer two methods for performing authentication: one using a TypeScript request with fetch, and the other with cURL. Regardless of the programming language you use,
          you can make a network request to our API for authentication and receive the necessary information in return.
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
          In both the cURL and fetch requests, the source field plays an important role. It adds a custom data field to the user’s account, helping both you and the user recognize
          that they are signing into your website. While the source field is optional, we highly recommend using it to clearly identify your web application.
        </P>
        <MonospacePreview title="api/users/authenticate" style={{ marginTop: 24 }}>{`
curl -X POST "https://api.internet.dev/api/users/authenticate" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "${props.viewer.email}", "password": "****-****-****-****", "source": "your-app.com"}'
        `}</MonospacePreview>

        <P style={{ marginTop: 88 }}>
          Upon successfully signing in, you will receive a response containing a user object that includes an API key. This key is essential for authenticating future requests.
          Please refer to{' '}
          <a href="https://github.com/internet-development/www-users-garden/blob/main/common/queries.ts" style={{ color: `var(--theme-primary)` }}>
            our temporary reference
          </a>{' '}
          for further details on how to use this key and the capabilities it unlocks.
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
          You may want to store the API key in a cookie immediately after sign-in for future use. Below is a quick example of how to do this. Make sure to update the cookie name to
          something appropriate for your web application.
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
          To verify if a user is signed in, below is an example of how we use cookies and getServerSideProps in Next.js to check for an existing session. In this example, we assume
          the API key has been securely stored in a cookie, which can then be accessed for authentication purposes.
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
    </StandardLayout>
  );
}
