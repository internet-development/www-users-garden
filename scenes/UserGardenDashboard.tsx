import styles from '@scenes/UserGardenDashboard.module.scss';

import * as React from 'react';

import AnyTextHeader from '@components/AnyTextHeader';
import DashboardWithSidebarLayout from '@system/layouts/DashboardWithSidebarLayout';
import UserGardenAuthenticatedNavigation from '@components/UserGardenAuthenticatedNavigation';
import UserGardenDashboardProfile from '@components/UserGardenDashboardProfile';
import UserGardenUpgrade from '@components/UserGardenUpgrade';
import UserGardenOrganizations from '@components/UserGardenOrganizations';

// TODO(jimmylee)
import UserGardenGrants from '@components/UserGardenGrants';
import UserGardenApplications from '@components/UserGardenApplications';
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
    />
  );

  const CHILD_ELEMENT_MAP = {
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
    USER_ORGANIZATIONS: (
      <UserGardenOrganizations
        isPotentialAdmin={props.isPotentialAdmin}
        onChangeOrganizations={props.onChangeOrganizations}
        organizations={props.organizations}
        onOrganizationAddUser={props.onOrganizationAddUser}
        onOrganizationSetCustomVerifyEmail={props.onOrganizationSetCustomVerifyEmail}
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
    USER_WALLET: <UserGardenWallet onChangeTransactions={props.onChangeTransactions} viewer={props.viewer} />,
    USER_UPGRADE: <UserGardenUpgrade viewer={props.viewer} />,
  };

  return (
    <div className={styles.root}>
      <AnyTextHeader>USERS.GARDEN</AnyTextHeader>
      <DashboardWithSidebarLayout sidebar={sidebarElement}>{CHILD_ELEMENT_MAP[props.active]}</DashboardWithSidebarLayout>
    </div>
  );
}
