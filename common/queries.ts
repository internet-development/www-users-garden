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
  const route = `${Constants.HOST}/api/users/update-viewer-username`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ username }) }, 'data');
}

export async function onSetUserData({ updates, id, key, forcePush = false }) {
  const route = `${Constants.HOST}/api/users/update`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ id, updates, forcePush }) }, 'data');
}

export async function onOrganizationSourceUsers({ key, organizationId }) {
  const route = `${Constants.HOST}/api/users/list-by-source`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ organizationId }) }, 'data');
}

export async function onResendEmailVerification({ key }) {
  const route = `${Constants.HOST}/api/users/verify-resend`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ source: 'users.garden' }) }, 'email');
}

export async function onUserChangePassword({ key, password }) {
  const route = `${Constants.HOST}/api/users/update-viewer-password`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ password }) });
}

export async function onUserRegenerateAPIKey({ email, key, password }) {
  const route = `${Constants.HOST}/api/users/regenerate-key`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ email, password }) }, 'user');
}

export async function onGetAllOrganizations({ key }) {
  const route = `${Constants.HOST}/api/organizations`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({}) }, 'data');
}

export async function onGetAllOrganizationMembers({ key, domain }) {
  const route = `${Constants.HOST}/api/organizations/users`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ domain }) }, 'data');
}

export async function onGetViewerOrganizations({ key }) {
  const route = `${Constants.HOST}/api/users/viewer/organizations`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({}) }, 'data');
}

export async function onOrganizationTogglePublic({ key, organizationId }) {
  const route = `${Constants.HOST}/api/organizations/toggle-public-access`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ organizationId }) }, 'data');
}

export async function onOrganizationAddUser({ key, email, domain }) {
  const route = `${Constants.HOST}/api/organizations/users/add`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ email, domain }) }, 'data');
}

export async function onOrganizationPromoteUser({ key, userId, organizationId }) {
  const route = `${Constants.HOST}/api/organizations/users/promote`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
}

export async function onOrganizationDemoteUser({ key, userId, organizationId }) {
  const route = `${Constants.HOST}/api/organizations/users/demote`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
}

export async function onOrganizationSetCustomEmail({ domain, key, updates }) {
  const route = `${Constants.HOST}/api/organizations/update`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ domain, updates }) }, 'data');
}

export async function onOrganizationRemoveUser({ key, userId, organizationId }) {
  const route = `${Constants.HOST}/api/organizations/users/remove`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ organizationId, userId }) }, 'data');
}

export async function onAutomaticOrganizationMembership({ key }) {
  const route = `${Constants.HOST}/api/organizations/membership/automatic`;
  return await fetchAndExpect({ route, key });
}

export async function checkDefaultOrganizationForMembers({ key }) {
  const route = `${Constants.HOST}/api/organizations/membership`;
  return await fetchAndExpect({ route, key });
}

export async function onUserUnsubscribeFromAllServices({ key }) {
  const route = `${Constants.HOST}/api/users/subscriptions/unsubscribe`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({}) }, 'success');
}

export async function onUserDeleteAccount({ id, key }) {
  const route = `${Constants.HOST}/api/users/delete`;
  return await fetchAndExpect({ route, key, body: JSON.stringify({ id }) }, 'success');
}

export async function onUserForgotPassword({ email }) {
  const route = `${Constants.HOST}/api/users/reset-password`;
  return await fetchAndExpect({ route, key: null, body: JSON.stringify({ email, source: 'users.garden' }) }, 'success');
}

export async function onUserAuthenticate({ email, password }) {
  const route = `${Constants.HOST}/api/users/authenticate`;
  return await fetchAndExpect({ route, key: null, body: JSON.stringify({ email, password, source: 'users.garden' }) }, 'user');
}

export async function onGetViewer({ key }) {
  const { viewer } = await Server.tryKeyWithoutCookie(key);
  return viewer;
}
