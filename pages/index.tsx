import * as Constants from '@common/constants';
import * as Queries from '@common/queries';
import * as React from 'react';
import * as Server from '@common/server';
import * as Utilities from '@common/utilities';

import ActionItem from '@system/documents/ActionItem';
import AnyTextHeader from '@components/AnyTextHeader';
import Apple from '@root/system/svg/social/Apple';
import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import Cookies from 'js-cookie';
import GlobalModalManager from '@system/modals/GlobalModalManager';
import Google from '@system/svg/social/Google';
import Input from '@system/Input';
import MonospacePreview from '@system/MonospacePreview';
import Page from '@components/Page';
import ThinAppLayout from '@system/layouts/ThinAppLayout';
import UserGardenDashboard from '@scenes/UserGardenDashboard';

import { P, H3, H4, SubTitle } from '@system/typography';
import { FormHeading, FormSubHeading, FormParagraph, InputLabel } from '@system/typography/forms';
import { useModal } from '@system/providers/ModalContextProvider';
import Bluesky from '@root/system/svg/social/Bluesky';
import ButtonWarning from '@system/ButtonPrimary';

function ExampleRootSinglePageApplication(props) {
  const { showModal } = useModal();

  // NOTE(jimmylee)
  // Page state.
  const [active, setActive] = React.useState<string>('USER_GET_STARTED');
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

  const [blueskyHandle, setBlueskyHandle] = React.useState<string>('');
  const [showBlueskyInput, setShowBlueskyInput] = React.useState<boolean>(false);

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

  const handleBlueskySubmit = () => {
    if (Utilities.isEmpty(blueskyHandle)) {
      showModal({
        name: 'ERROR',
        message: 'You must provide a Bluesky handle.',
      });
      return;
    }
    window.location.href = `${Constants.HOST}/authenticate-bluesky?domain=REDIRECT_USERS_GARDEN&handle=${encodeURIComponent(blueskyHandle)}`;
  };

  const children = props.viewer ? (
    <>
      <UserGardenDashboard
        active={active}
        currentOrganization={currentOrganization}
        isPotentialAdmin={isPotentialAdmin}
        onCheckAccountOwner={async ({ id }) => {
          const response = await Queries.onCheckAccountOwner({ key, id });
          return response;
        }}
        onGetAllTransactions={async () => {
          const response = await Queries.onGetAllTransactions({ key });
          return response;
        }}
        onSendTransactionByEmail={async ({ amount, email }) => {
          const response = await Queries.onSendTransactionByEmail({ amount, email, key });
          return response;
        }}
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
        onGetAllTenants={async () => {
          return await Queries.onGetAllTenants({ key });
        }}
        onTenantUpdate={async ({ id, updates }) => {
          return await Queries.onTenantUpdate({ key, id, updates });
        }}
        onTenantRemove={async ({ id }) => {
          return await Queries.onTenantRemove({ key, id });
        }}
        onChangeGrants={() => {}}
        onChangeOrganizations={(org) => {
          setCurrentOrganization(org);
        }}
        onChangeTransactions={() => {}}
        onOrganizationTogglePublic={async ({ organizationId }) => {
          return await Queries.onOrganizationTogglePublic({ organizationId, key });
        }}
        onGetAllOrganizationMembers={async (selectedOrganization) => {
          return await Queries.onGetAllOrganizationMembers({ domain: selectedOrganization.domain, key });
        }}
        onOrganizationPromoteUser={async ({ userId, organizationId }) => {
          return await Queries.onOrganizationPromoteUser({ userId, organizationId, key });
        }}
        onOrganizationDemoteUser={async ({ userId, organizationId }) => {
          return await Queries.onOrganizationDemoteUser({ userId, organizationId, key });
        }}
        onOrganizationRemoveUser={async ({ userId, organizationId }) => {
          return await Queries.onOrganizationRemoveUser({ userId, organizationId, key });
        }}
        onOrganizationSetCustomEmail={async ({ data, domain }) => {
          return await Queries.onOrganizationSetCustomEmail({ data, domain, key });
        }}
        onOrganizationAddUser={async (next) => {
          return await Queries.onOrganizationAddUser({ email: next.email, domain: next.domain, key });
        }}
        onOrganizationSourceUsers={async ({ organizationId }) => {
          return await Queries.onOrganizationSourceUsers({ organizationId, key });
        }}
        onUserApplyOfficeSpace={async ({ email }) => {
          return await Queries.onUserApplyOfficeSpace({ email, key });
        }}
        onUserGetOfficeState={async () => {
          return await Queries.onUserGetOfficeState({ key });
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
          return await Queries.onUserUnsubscribeFromAllServices({ key });
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
    </>
  ) : (
    <>
      <AnyTextHeader>USERS.GARDEN</AnyTextHeader>
      <ThinAppLayout>
        <img
          style={{ display: 'block', width: '100%' }}
          src="https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/f908a250-6899-419b-988d-ae906876ec85.jpg"
          alt="Home Page Image"
        />

        <H3 style={{ marginTop: 24 }}>Auth + API for your applications.</H3>
        <H4 style={{ marginTop: 16 }}>Manage all of your users, applications, and physical co-working space.</H4>

        <Button style={{ width: '100%', minHeight: 48, marginTop: 48 }} href={`${Constants.HOST}/authenticate-google?domain=REDIRECT_USERS_GARDEN`} target="_blank">
          <Google height="24px" style={{ marginRight: 16 }} />
          Sign in with Google
        </Button>

        <Button style={{ width: '100%', minHeight: 48, marginTop: 24 }} href={`${Constants.HOST}/authenticate-apple?domain=REDIRECT_USERS_GARDEN`} target="_blank">
          <Apple height="24px" style={{ marginRight: 16 }} />
          Sign in with Apple
        </Button>

        {!showBlueskyInput && <Button
          style={{ width: '100%', minHeight: 48, marginTop: 24 }}
          onClick={() => setShowBlueskyInput(true)}
        >
          <Bluesky height="24px" style={{ marginRight: 16 }} />
          Sign in with Bluesky
        </Button>}


        <div
          style={{
            transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
            maxHeight: showBlueskyInput ? 500 : 0,
            opacity: showBlueskyInput ? 1 : 0,
            marginTop: showBlueskyInput ? 16 : 0,
            overflow: 'hidden',
          }}
        > 
          <InputLabel>Bluesky Handle</InputLabel>
          {/* NOTE(binaryfiddler): padding around input is to allow room for the input's box shadow to show up when placed in a parent with overflow: hidden  */}
          <div style={{
            paddingLeft: 1,
            paddingRight: 1,
          }}>
            <Input
              onChange={(e) => setBlueskyHandle(e.target.value)}
              name="blueskyHandle"
              style={{ marginTop: 8}}
              type="text"
              placeholder="e.g. @handle.bsky.social"
              value={blueskyHandle}
            />
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'row', gap: 8 }}>
            <ButtonPrimary
              onClick={handleBlueskySubmit}
              style={{ flex: 1, minHeight: 48 }}
            >
              Sign in with Bluesky
            </ButtonPrimary>
            <ButtonWarning
              onClick={() => setShowBlueskyInput(false)}
              style={{ flex: 1, minHeight: 48 }}
            >
              Cancel
            </ButtonWarning>
          </div>
        </div>

        <InputLabel style={{ marginTop: 48 }}>E-mail</InputLabel>
        <Input onChange={(e) => setEmail(e.target.value)} name="email" style={{ marginTop: 8 }} type="text" placeholder="Type your e-mail" value={email} />
        <InputLabel style={{ marginTop: 24 }}>Password</InputLabel>

        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password"
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

        {!Utilities.isEmpty(email) ? (
          <div style={{ marginTop: 16 }}>
            <ActionItem
              icon={`⊹`}
              onClick={async () => {
                if (Utilities.isEmpty(email)) {
                  showModal({
                    name: 'ERROR',
                    message: 'You must provide an e-mail.',
                  });
                  return;
                }

                const response = await Queries.onUserForgotPassword({ email });

                if (response && response.success) {
                  alert('Check your inbox or spam for an e-mail from us.');
                } else {
                  alert('Something went wrong, try again later.');
                }
              }}
            >
              Forgot password
            </ActionItem>
          </div>
        ) : null}

        <ButtonPrimary
          id="SUBMIT_SIGN_IN_OR_SIGN_UP"
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
            Cookies.remove('gardening_session');
            setKey('');
            const response = await Queries.onUserAuthenticate({ email, password });
            setLoading(false);
            if (!response) {
              showModal({
                name: 'ERROR',
                message: 'Something went wrong. This is also a lazy message. Ideally the error message would have told you that you forgot to put your email or password.',
              });
              return;
            }

            // NOTE(jimmylee) // Authenticate
            setKey(response.user.key);
            Cookies.set('gardening_session', response.user.key, { secure: true });
            setUser(response.user);
            window.location.reload();
          }}
          style={{ width: '100%', minHeight: 48, marginTop: 16 }}
        >
          Sign in or create account
        </ButtonPrimary>

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
        </div>
      </ThinAppLayout>
      <GlobalModalManager viewer={currentUser} />
    </>
  );

  return (
    <Page title="Users" description="Manage your account, organization, websites, and other API features" url="https://users.garden">
      {children}
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
