import styles from '@scenes/UserGardenDashboard.module.scss';

import * as React from 'react';

import AdminTenants from '@components/AdminTenants';
import AnyTextHeader from '@components/AnyTextHeader';
import BlueCanvas from '@components/BlueCanvas';
import DashboardWithSidebarLayout from '@system/layouts/DashboardWithSidebarLayout';
import UserGardenGetStarted from '@components/UserGardenGetStarted';
import UserGardenAccess from '@components/UserGardenAccess';
import UserGardenAuthenticatedNavigation from '@components/UserGardenAuthenticatedNavigation';
import UserGardenApplications from '@components/UserGardenApplications';
import UserGardenDashboardProfile from '@components/UserGardenDashboardProfile';
import UserGardenDanger from '@components/UserGardenDanger';
import UserGardenOffice from '@components/UserGardenOffice';
import UserGardenOrganizations from '@components/UserGardenOrganizations';
import UserGardenUpgrade from '@components/UserGardenUpgrade';

// TODO(jimmylee)
import UserGardenGrants from '@components/UserGardenGrants';
import UserGardenWallet from '@components/UserGardenWallet';

export default function UserGardenDashboard(props) {
  const sidebarElement = (
    <UserGardenAuthenticatedNavigation
      active={props.active}
      currentOrganization={props.currentOrganization}
      onChangeOrganizations={props.onChangeOrganizations}
      onSignOut={props.onSignOut}
      onNavigate={props.onNavigate}
      organizations={props.organizations}
      yourOrganizations={props.yourOrganizations}
      viewer={props.viewer}
    />
  );

  const CHILD_ELEMENT_MAP = {
    ADMIN_TENANTS: <AdminTenants viewer={props.viewer} onGetAllTenants={props.onGetAllTenants} onTenantUpdate={props.onTenantUpdate} onTenantRemove={props.onTenantRemove} />,
    USER_GET_STARTED: <UserGardenGetStarted onNavigate={props.onNavigate} viewer={props.viewer} />,
    USER_PROFILE: (
      <UserGardenDashboardProfile
        viewer={props.viewer}
        onChange={props.onChangeCurrentUser}
        onChangeData={props.onChangeCurrentUserData}
        onNavigate={props.onNavigate}
        onSaveCurrentUser={props.onSaveCurrentUser}
        onSaveCurrentUserData={props.onSaveCurrentUserData}
        onSaveCurrentUserDataField={props.onSaveCurrentUserDataField}
        onSendVerifyEmail={props.onSendVerifyEmail}
        status={props.status}
      />
    ),
    USER_GRANTS: <UserGardenGrants onChangeGrants={props.onChangeGrants} viewer={props.viewer} />,
    USER_OFFICE: (
      <UserGardenOffice
        onNavigate={props.onNavigate}
        onUserApplyOfficeSpace={props.onUserApplyOfficeSpace}
        onUserGetInvoices={props.onUserGetInvoices}
        onUserGetOfficeState={props.onUserGetOfficeState}
        viewer={props.viewer}
      />
    ),
    USER_ORGANIZATIONS: (
      <UserGardenOrganizations
        isPotentialAdmin={props.isPotentialAdmin}
        onChangeOrganizations={props.onChangeOrganizations}
        organizations={props.organizations}
        onOrganizationAddUser={props.onOrganizationAddUser}
        onOrganizationSetCustomEmail={props.onOrganizationSetCustomEmail}
        onOrganizationDemoteUser={props.onOrganizationDemoteUser}
        onOrganizationPromoteUser={props.onOrganizationPromoteUser}
        onOrganizationRemoveUser={props.onOrganizationRemoveUser}
        onOrganizationTogglePublic={props.onOrganizationTogglePublic}
        onJoinOrganizationAutomatically={props.onJoinOrganizationAutomatically}
        onGetAllOrganizationMembers={props.onGetAllOrganizationMembers}
        viewer={props.viewer}
        yourOrganizations={props.yourOrganizations}
      />
    ),
    USER_APPLICATIONS: (
      <UserGardenApplications
        currentOrganization={props.currentOrganization}
        onOrganizationAddUser={props.onOrganizationAddUser}
        onOrganizationSourceUsers={props.onOrganizationSourceUsers}
        viewer={props.viewer}
      />
    ),
    USER_WALLET: (
      <UserGardenWallet
        onGetAllTransactions={props.onGetAllTransactions}
        onSendTransactionByEmail={props.onSendTransactionByEmail}
        onChangeTransactions={props.onChangeTransactions}
        onCheckAccountOwner={props.onCheckAccountOwner}
        viewer={props.viewer}
      />
    ),
    USER_UPGRADE: <UserGardenUpgrade onUserGetOfficeState={props.onUserGetOfficeState} onNavigate={props.onNavigate} viewer={props.viewer} />,
    USER_ACCESS: (
      <UserGardenAccess
        onChangeUserPassword={props.onChangeUserPassword}
        onUserRegenerateAPIKey={props.onUserRegenerateAPIKey}
        sessionKey={props.sessionKey}
        viewer={props.viewer}
      />
    ),
    USER_DANGER: (
      <UserGardenDanger onUserUnsubscribeFromAllServices={props.onUserUnsubscribeFromAllServices} onUserDeleteAccount={props.onUserDeleteAccount} viewer={props.viewer} />
    ),
  };

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <BlueCanvas />
        <div className={styles.content}>
          <h1 className={styles.text}></h1>
        </div>
      </nav>
      <DashboardWithSidebarLayout sidebar={sidebarElement}>{CHILD_ELEMENT_MAP[props.active]}</DashboardWithSidebarLayout>
    </div>
  );
}
