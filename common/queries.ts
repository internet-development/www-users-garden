import * as Constants from '@common/constants';
import * as Server from '@common/server';
import * as Utilities from '@common/utilities';

const REQUEST_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const getHeaders = (key) => {
  return { ...REQUEST_HEADERS, Authorization: `Bearer ${key}` };
};

export async function fetchAndExpect({ route, key, body }: Record<string, any>, qualifer: string = 'data'): Promise<Record<string, any> | null> {
  let result: Record<string, any>;
  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'X-API-KEY': key, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body ? body : undefined,
    });
    result = await response.json();
  } catch (e) {
    return null;
  }

  if (!result) {
    return null;
  }

  if (!result[qualifer]) {
    return null;
  }

  return result;
}

export async function onSetUsername({ username, key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/update-viewer-username`, key, body: JSON.stringify({ username }) }, 'data');
  return result;
}

export async function onSetUserData({ updates, id, key, forcePush = false }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/update`, key, body: JSON.stringify({ id, updates, forcePush }) }, 'data');
  return result;
}

export async function onOrganizationSourceUsers({ key, organizationId }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/list-by-source`, key, body: JSON.stringify({ organizationId }) }, 'data');
  return result;
}

export async function onResendEmailVerification({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/verify-resend`, key, body: JSON.stringify({}) }, 'email');
  return result;
}

export async function onUserChangePassword({ key, password }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/update-viewer-password`, key, body: JSON.stringify({ password }) });
  return result;
}

export async function onUserRegenerateAPIKey({ email, key, password }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/regenerate-key`, key, body: JSON.stringify({ email, password }) }, 'user');
  return result;
}

export async function onGetAllOrganizations({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations`, key, body: JSON.stringify({}) }, 'data');
  return result;
}

export async function onGetAllOrganizationMembers({ key, domain }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/users`, key, body: JSON.stringify({ domain }) }, 'data');
  return result;
}

export async function onGetViewerOrganizations({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/viewer/organizations`, key, body: JSON.stringify({}) }, 'data');
  return result;
}

export async function onOrganizationTogglePublic({ key, organizationId }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/toggle-public-access`, key, body: JSON.stringify({ organizationId }) }, 'data');
  return result;
}

export async function onOrganizationAddUser({ key, email, domain }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/users/add`, key, body: JSON.stringify({ email, domain }) }, 'data');
  return result;
}

export async function onOrganizationPromoteUser({ key, userId, organizationId }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/users/promote`, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
  return result;
}

export async function onOrganizationDemoteUser({ key, userId, organizationId }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/users/demote`, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
  return result;
}

export async function onOrganizationSetCustomVerifyEmail({ key, customEmail, domain }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/update`, key, body: JSON.stringify({ domain, updates: { email: customEmail } }) }, 'data');
  return result;
}

export async function onOrganizationRemoveUser({ key, userId, organizationId }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/users/remove`, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
  return result;
}

export async function onAutomaticOrganizationMembership({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/membership/automatic`, key });
  return result;
}

export async function checkDefaultOrganizationForMembers({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/organizations/membership`, key });
  return result;
}

export async function onUserAuthenticate({ email, password }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/authenticate`, body: JSON.stringify({ email, password, source: 'users.garden' }) }, 'user');

  return result;
}

export async function onUserUnsubscribeFromAllServices({ key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/subscriptions/unsubscribe`, key, body: JSON.stringify({}) }, 'success');

  return result;
}

export async function onUserDeleteAccount({ id, key }) {
  const result = await fetchAndExpect({ route: `${Constants.HOST}/api/users/delete`, key, body: JSON.stringify({ id }) }, 'success');

  return result;
}

export async function onGetViewer({ key }) {
  const { viewer } = await Server.tryKeyWithoutCookie(key);
  return viewer;
}
