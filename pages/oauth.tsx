import * as React from 'react';
import * as Utilities from '@common/utilities';
import * as Server from '@common/server';

import AnyTextHeader from '@components/AnyTextHeader';
import Cookies from '@modules/cookies';

function OAuthPage(props) {
  React.useEffect(() => {
    if (Utilities.isEmpty(props.code)) {
      window.location.replace('/');
    }

    Cookies.set('gardening_session', props.code, { secure: true });
    window.location.replace('/');
  });

  return <AnyTextHeader>REDIRECTING ...</AnyTextHeader>;
}

export async function getServerSideProps(context) {
  if (Utilities.isEmpty(context.query.key)) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  const code = Server.decrypt(String(context.query.key));

  return {
    props: {
      code,
    },
  };
}

export default OAuthPage;
