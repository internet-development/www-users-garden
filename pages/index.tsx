import * as Constants from '@common/constants';
import * as Queries from '@common/queries';
import * as React from 'react';
import * as Server from '@common/server';
import * as Utilities from '@common/utilities';

import ActionItem from '@system/documents/ActionItem';
import AnyTextHeader from '@components/AnyTextHeader';
import Button from '@system/Button';
import Cookies from 'js-cookie';
import GlobalModalManager from '@system/modals/GlobalModalManager';
import Input from '@system/Input';
import MonospacePreview from '@system/MonospacePreview';
import Page from '@components/Page';
import ThinAppLayout from '@system/layouts/ThinAppLayout';
import UserGardenDashboard from '@scenes/UserGardenDashboard';

import { P, SubTitle } from '@system/typography';
import { FormHeading, FormSubHeading, FormParagraph, InputLabel } from '@system/typography/forms';
import { useModal } from '@system/providers/ModalContextProvider';

const Group = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SubTitle style={{ marginTop: 24, opacity: 0.6 }}>{props.title}</SubTitle>
      <div style={{ lineHeight: 1.2, marginTop: 8 }}>{props.children}</div>
    </div>
  );
};

function ExampleRootSinglePageApplication(props) {
  const { showModal } = useModal();

  // NOTE(jimmylee)
  // Page state.
  const [active, setActive] = React.useState<string>('USER_PROFILE');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<Record<string, any>>({
    username: null,
  });
  const [isPotentialAdmin, setPotentialAdmin] = React.useState<boolean>(false);

  // NOTE(jimmylee)
  // Authentication state.
  const [key, setKey] = React.useState<string>(props.sessionKey);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  // NOTE(jimmylee)
  // User data.
  const [currentUser, setUser] = React.useState<Record<string, any> | null>(props.viewer);
  const [currentOrganization, setCurrentOrganization] = React.useState<Record<string, any> | null>(null);
  const [grants, setGrants] = React.useState<Record<string, any>[]>([]);
  const [organizations, setOrganizations] = React.useState<Record<string, any>[]>([]);
  const [yourOrganizations, setYourOrganizations] = React.useState<Record<string, any>[]>([]);
  const [transactions, setTransactions] = React.useState<Record<string, any>[]>([]);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    async function init() {
      if (Utilities.isEmpty(key)) {
        return;
      }

      const organizationResults = await Queries.onGetAllOrganizations({ key });
      if (organizationResults && organizationResults.data) {
        setOrganizations(organizationResults.data);
      }

      const yourOrganizationPieces = await Queries.onGetViewerOrganizations({ key });
      if (yourOrganizationPieces && yourOrganizationPieces.data) {
        setYourOrganizations(yourOrganizationPieces.data);
      }

      const checkOrganization = await Queries.checkDefaultOrganizationForMembers({ key });
      const doesDefaultOrganizationHaveMemberships = checkOrganization && checkOrganization.data && checkOrganization.data.length > 0;
      setPotentialAdmin(!doesDefaultOrganizationHaveMemberships);
    }

    init();
  }, [key]);

  if (props.viewer) {
    return (
      <Page title="Users" description="Manage your account, organization, websites, and other API features" url="https://users.garden">
        <UserGardenDashboard
          active={active}
          currentOrganization={currentOrganization}
          isPotentialAdmin={isPotentialAdmin}
          onNavigate={({ active, nextOrganization }) => {
            setActive(active);
            setCurrentOrganization(nextOrganization);
          }}
          onChangeUserPassword={async ({ password }) => {
            const response = await Queries.onUserChangePassword({ key, password });
            return response;
          }}
          onChangeCurrentUser={(event) => {
            if (!currentUser) return;

            setUser({ ...currentUser, [event.target.name]: event.target.value });
          }}
          onChangeCurrentUserData={(event) => {
            if (!currentUser) return;

            setUser({ ...currentUser, data: { ...currentUser.data, [event.target.name]: event.target.value } });
          }}
          onChangeGrants={() => {}}
          onChangeOrganizations={(org) => {
            setCurrentOrganization(org);
          }}
          onChangeTransactions={() => {}}
          onOrganizationTogglePublic={async ({ organizationId }) => {
            const response = await Queries.onOrganizationTogglePublic({ organizationId, key });
            return response;
          }}
          onGetAllOrganizationMembers={async (selectedOrganization) => {
            const response = await Queries.onGetAllOrganizationMembers({ domain: selectedOrganization.domain, key });
            return response;
          }}
          onOrganizationPromoteUser={async ({ userId, organizationId }) => {
            const response = await Queries.onOrganizationPromoteUser({ userId, organizationId, key });
            return response;
          }}
          onOrganizationDemoteUser={async ({ userId, organizationId }) => {
            const response = await Queries.onOrganizationDemoteUser({ userId, organizationId, key });
            return response;
          }}
          onOrganizationRemoveUser={async ({ userId, organizationId }) => {
            const response = await Queries.onOrganizationRemoveUser({ userId, organizationId, key });
            return response;
          }}
          onOrganizationSetCustomVerifyEmail={async ({ customEmail, domain }) => {
            const response = await Queries.onOrganizationSetCustomVerifyEmail({ key, customEmail, domain });
            return response;
          }}
          onOrganizationAddUser={async (next) => {
            const response = await Queries.onOrganizationAddUser({ email: next.email, domain: next.domain, key });
            return response;
          }}
          onOrganizationSourceUsers={async ({ organizationId }) => {
            const response = await Queries.onOrganizationSourceUsers({ organizationId, key });
            return response;
          }}
          onUserRegenerateAPIKey={async ({ email, password }) => {
            const response = await Queries.onUserRegenerateAPIKey({ email, key, password });

            if (response && response.user) {
              Cookies.remove('gardening_session');
              Cookies.set('gardening_session', response.user.key, { secure: true });
              setKey(response.user.key);
            }

            return response;
          }}
          onJoinOrganizationAutomatically={async () => {
            const automaticMembershipResult = await Queries.onAutomaticOrganizationMembership({ key });
            if (!automaticMembershipResult) {
              alert('Something went wrong, most likely your e-mail was not verified.');
              return;
            }

            if (automaticMembershipResult.success) {
              setPotentialAdmin(false);
            }

            const yourOrganizationPieces = await Queries.onGetViewerOrganizations({ key });
            if (yourOrganizationPieces && yourOrganizationPieces.data) {
              setYourOrganizations(yourOrganizationPieces.data);
            }
          }}
          onSaveCurrentUserDataField={async ({ name, value }) => {
            const nextData = Utilities.sanitizeObject({ [name]: value });
            if (!nextData) {
              alert('You must provide an object');
              return;
            }

            const response = await Queries.onSetUserData({ key, id: props.viewer.id, updates: nextData });
            if (!response) {
              alert('Something went wrong, try again later.');
              return;
            }

            const nextUser = await Queries.onGetViewer({ key });
            if (!nextUser) {
              alert('Unable to ensure update, please refresh.');
              return;
            }

            setUser(nextUser);
          }}
          onSaveCurrentUserData={async () => {
            if (!currentUser) return;

            const nextData = Utilities.sanitizeObject(currentUser.data);
            if (!nextData) {
              alert('You must provide an object');
              return;
            }

            const response = await Queries.onSetUserData({ key, id: props.viewer.id, updates: nextData, forcePush: true });
            if (!response) {
              alert('Something went wrong, try again later.');
              return;
            }

            const nextUser = await Queries.onGetViewer({ key });
            if (!nextUser) {
              alert('Unable to ensure update, please refresh.');
              return;
            }

            setUser(nextUser);
          }}
          onSaveCurrentUser={async () => {
            if (!currentUser) return;

            let candidate = Utilities.createSlugWithUnderscore(currentUser.username);

            if (Utilities.isEmpty(candidate)) {
              alert('You pust provide a username');
              return;
            }

            if (candidate.length < 2) {
              alert('Your username must be at least 2 characters long');
              return;
            }

            const response = await Queries.onSetUsername({ username: candidate, key });
            if (!response) {
              setStatus({ ...status, username: null });
              alert('Something went wrong, try again later.');
              return;
            }

            const nextUser = await Queries.onGetViewer({ key });
            if (!nextUser) {
              setStatus({ ...status, username: null });
              alert('Unable to ensure update, please refresh.');
              return;
            }

            setUser(nextUser);
            setStatus({ ...status, username: `Your username was set to ${nextUser.username}` });
          }}
          onSendVerifyEmail={async () => {
            const response = await Queries.onResendEmailVerification({ key });
            if (!response) {
              setStatus({ ...status, email: null });
              alert('Something went wrong, try again later.');
              return;
            }

            setStatus({ ...status, email: 'Please check your e-mail for a response.' });
          }}
          onSignOut={() => {
            const confirm = window.confirm('Are you sure?');
            if (!confirm) {
              return;
            }

            Cookies.remove('gardening_session');
            window.location.reload();
          }}
          onUserUnsubscribeFromAllServices={async () => {
            const response = await Queries.onUserUnsubscribeFromAllServices({ key });
            return response;
          }}
          onUserDeleteAccount={async () => {
            if (!currentUser) return;

            const response = await Queries.onUserDeleteAccount({ id: currentUser.id, key });
            if (response && response.success) {
              Cookies.remove('gardening_session');
            }
            return response;
          }}
          organizations={organizations}
          sessionKey={key}
          status={status}
          viewer={currentUser}
          yourOrganizations={yourOrganizations}
        />
        <GlobalModalManager viewer={currentUser} />
      </Page>
    );
  }

  return (
    <Page title="Users" description="Manage your account, organization, websites, and other API features" url="https://users.garden">
      <AnyTextHeader>USERS.GARDEN</AnyTextHeader>
      <ThinAppLayout>
        <img
          style={{ display: 'block', width: '100%' }}
          src="https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/ccb2bcf8-9ba4-4976-9403-f3dac8ce0047.png"
          alt="Home Page Image"
        />

        <Group title="MANAGE">Manage your account, organization, and websites.</Group>

        <Group title="DEBUG">Ensure every user has the correct permissions.</Group>

        <Group title="UPGRADE">Pay for more API access or get office space in Seattle, WA.</Group>

        <InputLabel style={{ marginTop: 48 }}>E-mail</InputLabel>
        <Input onChange={(e) => setEmail(e.target.value)} name="email" style={{ marginTop: 8 }} type="text" placeholder="Your e-mail" value={email} />
        <InputLabel style={{ marginTop: 24 }}>Password</InputLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          name="password"
          style={{ marginTop: 8 }}
          type="password"
          value={password}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const submitButton = document.getElementById('SUBMIT_SIGN_IN_OR_SIGN_UP');

              if (submitButton) {
                submitButton.click();
              }
            }
          }}
        />
        <div style={{ marginTop: 24 }}>
          <ActionItem icon={`⊹`} href="https://txt.dev/wwwjim/intdev-acceptable-use" target="_blank">
            Acceptable Use Policy
          </ActionItem>
          <ActionItem icon={`⊹`} href="https://txt.dev/wwwjim/intdev-terms-of-service" target="_blank">
            Terms of Service
          </ActionItem>
          <ActionItem icon={`⊹`} href="https://txt.dev/wwwjim/intdev-privacy-policy" target="_blank">
            Privacy Policy
          </ActionItem>

          <ActionItem icon={`⊹`} href={`${Constants.HOST}/authenticate-google?domain=REDIRECT_USERS_GARDEN`} target="_blank">
            Sign in with Google
          </ActionItem>

          <ActionItem
            icon={`⭢`}
            id={`SUBMIT_SIGN_IN_OR_SIGN_UP`}
            onClick={async () => {
              if (Utilities.isEmpty(email)) {
                showModal({
                  name: 'ERROR',
                  message: 'You must provide an e-mail.',
                });
                return;
              }

              if (Utilities.isEmpty(password)) {
                showModal({
                  name: 'ERROR',
                  message: 'You must provide a password.',
                });
                return;
              }

              if (password.length < 4) {
                showModal({
                  name: 'ERROR',
                  message: 'You must use at least 4 characters for your password.',
                });
                return;
              }

              setLoading(true);
              const response = await Queries.onUserAuthenticate({ email, password });
              setLoading(false);
              if (!response) {
                showModal({
                  name: 'ERROR',
                  message: 'Something went wrong. This is also a lazy message. Ideally the error message would have told you that you forgot to put your email or password.',
                });
                return;
              }
              Cookies.remove('gardening_session');
              setKey('');

              const confirm = window.confirm('Would you like to save your Cookie to maintain a session?');
              if (confirm) {
                setKey(response.user.key);
                Cookies.set('gardening_session', response.user.key, { secure: true });
              }

              setUser(response.user);
              window.location.reload();
            }}
          >
            Sign in
          </ActionItem>
        </div>
      </ThinAppLayout>
      <GlobalModalManager viewer={currentUser} />
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { sessionKey, viewer } = await Server.setup(context);
  return {
    props: { sessionKey, viewer },
  };
}

export default ExampleRootSinglePageApplication;
