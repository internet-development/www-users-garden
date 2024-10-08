import styles from '@components/UserGardenOrganizations.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';
import * as Utilities from '@common/utilities';

import Button from '@system/Button';
import ButtonWarning from '@system/ButtonWarning';
import Input from '@system/Input';
import Table from '@system/Table';
import TextArea from '@system/TextArea';
import SmallButton from '@system/documents/SmallButton';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';

import { P, SubTitle } from '@system/typography';

const TABLE_HEADINGS_ORGANIZATION = ['USERNAME', 'EMAIL', 'STATUS', ''];

const TableText = (props) => {
  return <div style={{ paddingTop: 1 }}>{props.children}</div>;
};

function UserGardenUserTable(props) {
  return (
    <StandardLayoutSection title={`Manage ${props.selectedOrganization.domain.toUpperCase()} users`}>
      {Number(props.selectedOrganizationMembership.level) === Constants.Users.tiers.ADMIN ? (
        <>
          <ul className={styles.list}>
            <li>You are an administrator.</li>
            <li>You can manage rights and membership.</li>
          </ul>
        </>
      ) : (
        <>
          <ul className={styles.list}>
            <li>You are a member.</li>
            <li>You can manage your membership.</li>
          </ul>
        </>
      )}
      <Table data={props.data} headings={TABLE_HEADINGS_ORGANIZATION} style={{ marginTop: 24 }} />
    </StandardLayoutSection>
  );
}

function UserGardenUserEmptyTable(props) {
  return (
    <StandardLayoutSection title={`Manage ${props.selectedOrganization.domain.toUpperCase()} users`}>
      <ul className={styles.list}>
        <li>Changes are being processed.</li>
      </ul>

      <Table data={[{ id: 1, data: ['Please wait...'] }]} headings={['STATUS']} style={{ marginTop: 24 }} />
    </StandardLayoutSection>
  );
}

function UserGardenUserAdd(props) {
  const [email, setEmail] = React.useState<string>('');

  return (
    <StandardLayoutSection title="Add a new member">
      <ul className={styles.list}>
        <li>Add any user by e-mail.</li>
        <li>They can see all members in the organization.</li>
      </ul>
      <Input autoComplete="off" style={{ marginTop: 16 }} value={email} name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Type someone's e-mail" />
      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            props.onSetLoading(true);
            await props.onSubmit({ email });
            setEmail('');
            props.onSetLoading(false);
          }}
        >
          Add
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenUserDanger(props) {
  return (
    <StandardLayoutSection title="Remove yourself">
      <ul className={styles.list}>
        <li>Remove yourself from your organization.</li>
        <li>If you are an admin, you must give admin rights to someone else before leaving.</li>
      </ul>
      <div className={styles.actions}>
        <ButtonWarning
          loading={props.loading}
          onClick={async () => {
            props.onSetLoading(true);
            await props.onSubmit();
            props.onSetLoading(false);
          }}
        >
          Leave
        </ButtonWarning>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenOrganizationPublicAccess(props) {
  return (
    <StandardLayoutSection title="Give public access">
      <ul className={styles.list}>
        <li>Your organization is PRIVATE</li>
        <li>If you make your organization public, everyone can access your organization's API and data.</li>
        <li>You may want to do this if you're using our API to build a public application instead of an internal tool.</li>
      </ul>
      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            await props.onSubmit();
          }}
        >
          Make public
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenOrganizationPrivateAccess(props) {
  return (
    <StandardLayoutSection title="Revoke public access">
      <ul className={styles.list}>
        <li>Your organization is PUBLIC</li>
        <li>If you make your organization private, only members of your organization can access your organization's API and data.</li>
      </ul>
      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            await props.onSubmit();
          }}
        >
          Make private
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenOrganizationCustomVerifyEmail(props) {
  const [from, setFrom] = React.useState<string>(props.organization.data && props.organization.data.email ? props.organization.data.email.from : '');
  const [subject, setSubject] = React.useState<string>(props.organization.data && props.organization.data.email ? props.organization.data.email.subject : '');
  const [text, setText] = React.useState<string>(props.organization.data && props.organization.data.email ? props.organization.data.email.text : '');

  return (
    <StandardLayoutSection title="Create a custom verify e-mail">
      <ul className={styles.list}>
        <li>You can customize the content of your verification e-mail to your users.</li>
      </ul>

      <Input
        autoComplete="off"
        placeholder="API.INTERET.DEV <no-reply@mail.internet.dev>"
        style={{ marginTop: 16 }}
        value={from}
        name="from"
        onChange={(e) => setFrom(e.target.value)}
      />

      <Input
        autoComplete="off"
        placeholder="Verify your e-mail to use the API"
        style={{ marginTop: 16 }}
        value={subject}
        name="subject"
        onChange={(e) => setSubject(e.target.value)}
      />

      <TextArea
        autoComplete="off"
        placeholder="If you did not make this request, please ignore this e-mail. Follow this link to verify your e-mail (within the next 30 minutes)"
        style={{ marginTop: 16 }}
        value={text}
        name="text"
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            await props.onSubmit({ from, subject, text });
          }}
        >
          Save
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenOrganizationCustomResetPasswordEmail(props) {
  const [from, setFrom] = React.useState<string>(props.organization.data && props.organization.data.email_reset_password ? props.organization.data.email_reset_password.from : '');
  const [subject, setSubject] = React.useState<string>(
    props.organization.data && props.organization.data.email_reset_password ? props.organization.data.email_reset_password.subject : ''
  );
  const [text, setText] = React.useState<string>(props.organization.data && props.organization.data.email_reset_password ? props.organization.data.email_reset_password.text : '');

  return (
    <StandardLayoutSection title="Create a custom reset password e-mail">
      <ul className={styles.list}>
        <li>You can customize the content of your reset password e-mail to your users.</li>
      </ul>

      <Input
        autoComplete="off"
        placeholder="API.INTERET.DEV <no-reply@mail.internet.dev>"
        style={{ marginTop: 16 }}
        value={from}
        name="from"
        onChange={(e) => setFrom(e.target.value)}
      />

      <Input
        autoComplete="off"
        placeholder="Change your password in your settings"
        style={{ marginTop: 16 }}
        value={subject}
        name="subject"
        onChange={(e) => setSubject(e.target.value)}
      />

      <TextArea
        autoComplete="off"
        placeholder="If you did not make this request, please ignore this e-mail. Follow this link to sign in to your account and change your password (within the next 30 minutes)"
        style={{ marginTop: 16 }}
        value={text}
        name="text"
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            await props.onSubmit({ from, subject, text });
          }}
        >
          Save
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserGardenOrganizationCustomSendPasswordEmail(props) {
  const [from, setFrom] = React.useState<string>(props.organization.data && props.organization.data.email_send_password ? props.organization.data.email_send_password.from : '');
  const [subject, setSubject] = React.useState<string>(
    props.organization.data && props.organization.data.email_send_password ? props.organization.data.email_send_password.subject : ''
  );
  const [text, setText] = React.useState<string>(props.organization.data && props.organization.data.email_send_password ? props.organization.data.email_send_password.text : '');

  return (
    <StandardLayoutSection title="Create a custom send password e-mail">
      <ul className={styles.list}>
        <li>You can customize the content of your e-mail when we send your users their password.</li>
      </ul>

      <Input
        autoComplete="off"
        placeholder="API.INTERET.DEV <no-reply@mail.internet.dev>"
        style={{ marginTop: 16 }}
        value={from}
        name="from"
        onChange={(e) => setFrom(e.target.value)}
      />

      <Input autoComplete="off" placeholder="Your new account password" style={{ marginTop: 16 }} value={subject} name="subject" onChange={(e) => setSubject(e.target.value)} />

      <TextArea
        autoComplete="off"
        placeholder="If you did not create a new account, please ignore this e-mail. Here is your new password for your account, please sign in and change it as soon as possible"
        style={{ marginTop: 16 }}
        value={text}
        name="text"
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            await props.onSubmit({ from, subject, text });
          }}
        >
          Save
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

const TABLE_HEADINGS = [`DOMAIN`, `ID`];

export default function UserGardenOrganizations(props) {
  const [selected, setSelected] = React.useState<any[]>([]);
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  const [users, setUsers] = React.useState<any[]>([]);

  const data = [
    ...props.yourOrganizations.map((each, index) => {
      const match = props.organizations.find((one) => one.id === each.organization_id);
      return { id: each.id, data: [<TableText>{match.domain}</TableText>, <TableText>{each.organization_id}</TableText>] };
    }),
  ];

  const selectedOrganizationMembership = selected && selected.length ? props.yourOrganizations.find((each) => each.id === selected[0]) : null;
  const selectedOrganization = selected && selected.length ? props.organizations.find((each) => each.id === selectedOrganizationMembership.organization_id) : null;

  const updateMembersLazy = React.useCallback(async () => {
    setUsers([]);
    const isAdminViewer = Number(selectedOrganizationMembership.level) === Constants.Users.tiers.ADMIN;
    const members = await props.onGetAllOrganizationMembers(selectedOrganization);
    if (!members) {
      return;
    }

    setUsers(
      members.data.map((member) => {
        const isAdmin = Number(member.level) === Constants.Users.tiers.ADMIN;
        const isYou = member.user_id === props.viewer.id;

        return {
          id: member.user_id,
          data: [
            <TableText>{member.user?.username}</TableText>,
            <TableText>{member.user.email}</TableText>,
            <TableText>{isAdmin ? 'Administrator' : 'Member'}</TableText>,
            <div>
              {isAdminViewer && !isAdmin && !isYou ? (
                <SmallButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const confirm = window.confirm(`Are you sure you want to promote ${member.user.email}?`);
                    if (!confirm) {
                      setLoading(false);
                      return;
                    }

                    const response = await props.onOrganizationPromoteUser({
                      userId: member.user_id,
                      organizationId: selectedOrganization.id,
                    });

                    if (!response) {
                      alert('Promotion failed for some reason.');
                      setLoading(false);
                      return;
                    }

                    await updateMembersLazy();
                    setLoading(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  promote
                </SmallButton>
              ) : null}
              {isAdminViewer && isAdmin && !isYou ? (
                <SmallButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const confirm = window.confirm(`Are you sure you want to demote ${member.user.email}?`);
                    if (!confirm) {
                      setLoading(false);
                      return;
                    }

                    const response = await props.onOrganizationDemoteUser({ userId: member.user_id, organizationId: selectedOrganization.id });

                    if (!response) {
                      alert('Demotion failed for some reason.');
                      setLoading(false);
                      return;
                    }

                    await updateMembersLazy();
                    setLoading(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  demote
                </SmallButton>
              ) : null}
              {isAdminViewer && !isYou && !isAdmin ? (
                <SmallButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const confirm = window.confirm(`Are you sure you want to remove ${member.user.email} from ${selectedOrganization.domain}?`);
                    if (!confirm) {
                      setLoading(false);
                      return;
                    }

                    const response = await props.onOrganizationRemoveUser({ userId: member.user_id, organizationId: selectedOrganization.id });

                    if (!response) {
                      alert('Something went wrong, please try again later.');
                      setLoading(false);
                      return;
                    }

                    await updateMembersLazy();
                    setLoading(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  remove
                </SmallButton>
              ) : null}
            </div>,
          ],
        };
      })
    );
  }, [props, selectedOrganization, selectedOrganizationMembership, loading]);

  React.useEffect(() => {
    if (!selectedOrganization) {
      return;
    }

    updateMembersLazy();
  }, [selectedOrganization, updateMembersLazy]);

  React.useEffect(() => {
    if (!selectedOrganization) {
      return;
    }

    setOpen(selectedOrganization.data && selectedOrganization.data.public);
  }, [selectedOrganization]);

  return (
    <StandardLayout>
      <StandardHeader title="Your organizations">
        Manage your organization and its external members. Adding members allows the root user to grant access to anyone they select. The first person to create an organization
        automatically receives administrative privileges.
      </StandardHeader>

      {props.isPotentialAdmin && (
        <StandardLayoutSection title="Join your default organization">
          <ul className={styles.list}>
            <li>Because of your e-mail, you can automatically join "{Utilities.getDomainFromEmail(props.viewer.email)}"</li>
            <li>You must verify your e-mail first.</li>
            <li>The organization associated with your e-mail does not have any members yet. You can join this organization by clicking below.</li>
            <li>Anyone else who wants to be an administrator must get your approval.</li>
          </ul>

          <div className={styles.actions}>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await props.onJoinOrganizationAutomatically();
                setLoading(false);
              }}
            >
              Join {Utilities.getDomainFromEmail(props.viewer.email)}
            </Button>
          </div>
        </StandardLayoutSection>
      )}

      <StandardLayoutSection title="Your memberships">
        <Table
          data={data}
          headings={TABLE_HEADINGS}
          isInteractive
          onChange={(each) => {
            // NOTE(jimmylee)
            // onChange only passes one back.
            Object.keys(each).forEach(async (id) => {
              if (selected.length && selected[0] === id) {
                setSelected([]);
                return;
              }

              setSelected([id]);
            });
          }}
          style={{ marginTop: 24 }}
          value={selected}
        />
      </StandardLayoutSection>

      {selectedOrganization ? (
        <UserGardenUserAdd
          loading={loading}
          onSubmit={async (next) => {
            const confirm = window.confirm(`Are you sure you to add a new user to your organization?`);
            if (!confirm) {
              return;
            }

            const response = await props.onOrganizationAddUser({ ...next, domain: selectedOrganization.domain });
            if (!response) {
              alert('Something went wrong, either the user does not exist, or is already a part of your organization.');
              return;
            }

            await updateMembersLazy();
          }}
          onSetLoading={setLoading}
        />
      ) : null}

      {selectedOrganization && !loading ? (
        <UserGardenUserTable data={users} selectedOrganization={selectedOrganization} selectedOrganizationMembership={selectedOrganizationMembership} />
      ) : null}

      {selectedOrganization && loading ? <UserGardenUserEmptyTable selectedOrganization={selectedOrganization} /> : null}

      {selectedOrganization && !open ? (
        <UserGardenOrganizationPublicAccess
          loading={loading}
          onSubmit={async () => {
            setLoading(true);

            const confirm = window.confirm(`Are you sure you want to make your organization public?`);
            if (!confirm) {
              setLoading(false);
              return;
            }

            const response = await props.onOrganizationTogglePublic({ organizationId: selectedOrganization.id });

            if (!response) {
              alert('Something went wrong, try again');
              setLoading(false);
              return;
            }

            setOpen(true);
            setLoading(false);
          }}
        />
      ) : null}

      {selectedOrganization && open ? (
        <UserGardenOrganizationPrivateAccess
          loading={loading}
          onSubmit={async () => {
            setLoading(true);

            const response = await props.onOrganizationTogglePublic({ organizationId: selectedOrganization.id });

            if (!response) {
              alert('Something went wrong, try again');
              setLoading(false);
              return;
            }

            setOpen(false);
            setLoading(false);
          }}
        />
      ) : null}

      {selectedOrganization ? (
        <UserGardenOrganizationCustomVerifyEmail
          loading={loading}
          organization={selectedOrganization}
          onSubmit={async (nextCustomEmail) => {
            setLoading(true);

            const response = await props.onOrganizationSetCustomEmail({ data: { email: nextCustomEmail }, domain: selectedOrganization.domain });

            if (!response) {
              alert('Something went wrong, try again');
              setLoading(false);
              return;
            }

            setLoading(false);
          }}
        />
      ) : null}

      {selectedOrganization ? (
        <UserGardenOrganizationCustomSendPasswordEmail
          loading={loading}
          organization={selectedOrganization}
          onSubmit={async (nextCustomEmail) => {
            setLoading(true);

            const response = await props.onOrganizationSetCustomEmail({ data: { email_send_password: nextCustomEmail }, domain: selectedOrganization.domain });

            if (!response) {
              alert('Something went wrong, try again');
              setLoading(false);
              return;
            }

            setLoading(false);
          }}
        />
      ) : null}

      {selectedOrganization ? (
        <UserGardenOrganizationCustomResetPasswordEmail
          loading={loading}
          organization={selectedOrganization}
          onSubmit={async (nextCustomEmail) => {
            setLoading(true);

            const response = await props.onOrganizationSetCustomEmail({ data: { email_reset_password: nextCustomEmail }, domain: selectedOrganization.domain });

            if (!response) {
              alert('Something went wrong, try again');
              setLoading(false);
              return;
            }

            setLoading(false);
          }}
        />
      ) : null}

      {selectedOrganization ? (
        <UserGardenUserDanger
          loading={loading}
          onSubmit={async () => {
            const confirm = window.confirm(`Are you sure you want to leave?`);
            if (!confirm) {
              return;
            }

            const response = await props.onOrganizationRemoveUser({ organizationId: selectedOrganization.id, userId: props.viewer.id });
            if (!response) {
              setLoading(false);
              alert('Something went wrong, you may still be an admin, or there was an error on our end.');
              return;
            }

            window.location.reload();
          }}
          onSetLoading={setLoading}
        />
      ) : null}
    </StandardLayout>
  );
}
