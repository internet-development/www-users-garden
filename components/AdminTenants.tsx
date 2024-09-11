import styles from '@components/AdminTenants.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import Input from '@system/Input';
import Table from '@system/Table';
import SmallButton from '@system/documents/SmallButton';

import { P, SubTitle } from '@system/typography';

const Item = (props) => {
  if (props.href) {
    return (
      <a className={styles.item} style={props.style} href={props.href} target={props.target}>
        <span className={styles.left}>⎯</span>
        <span className={styles.right}>{props.children}</span>
      </a>
    );
  }

  return (
    <li className={styles.item} style={props.style} onClick={props.onClick}>
      <span className={styles.left}>⎯</span>
      <span className={styles.right}>{props.children}</span>
    </li>
  );
};

const Group = (props) => {
  return (
    <div className={styles.child}>
      <div className={styles.left}>
        <figure className={styles.line} />
      </div>
      <div className={styles.right}>
        <SubTitle style={{ marginTop: 24 }}>{props.title}</SubTitle>
        {props.children}
      </div>
    </div>
  );
};

const TableText = (props) => {
  return <div style={{ paddingTop: 1, ...props.style }}>{props.children}</div>;
};

function AdminTenantCandidates(props) {
  return (
    <Group title="USERS">
      <ul className={styles.list}>
        <li>Manage applicants from this section.</li>
        <li>Select "Grant" to assign desk access based on the applicant's payment plan. You can see if they are paying or not in the table below.</li>
        <li>Select "Revoke" to remove their desk access.</li>
        <li>Select "Remove" to delete an applicant from the list.</li>
      </ul>

      <Table
        data={props.tenants.map((each) => {
          const isVerified = Number(each.level) >= Constants.Users.tiers.VERIFIED;
          const isCoWorking = Number(each.level) >= Constants.Users.tiers.GENERAL_CO_WORKING;
          const isPartner = Number(each.level) >= Constants.Users.tiers.PARTNER;
          const isApproved = Number(each.tier) == 2;
          const isApplying = Number(each.tier) == 1;

          return {
            id: each.id,
            data: [
              <TableText>{each.email}</TableText>,
              <TableText style={{ color: `var(--theme-success)` }}>{isCoWorking ? '✓' : ''}</TableText>,
              <TableText style={{ color: `var(--theme-success)` }}>{isPartner ? '✓' : ''}</TableText>,
              <TableText style={{ color: `var(--theme-success)` }}>{isApproved ? '✓' : ''}</TableText>,
              <div>
                {isApplying ? (
                  <SmallButton
                    onClick={async () => {
                      const confirm = window.confirm(`Are you sure you want to grant ${each.email} office space?`);
                      if (!confirm) {
                        return;
                      }

                      const response = await props.onTenantUpdate({ id: each.tenant_id, updates: { tier: 2 } });

                      if (!response) {
                        alert('Something went wrong');
                        return;
                      }

                      const next = await props.onGetAllTenants();
                      if (next && next.data) {
                        props.onSetTenants(next.data);
                      }
                    }}
                    style={{ margin: `0 8px 4px 0` }}
                  >
                    Grant
                  </SmallButton>
                ) : null}
                {isApproved ? (
                  <SmallButton
                    onClick={async () => {
                      const confirm = window.confirm(`Are you sure you want to remove ${each.email} from having office space?`);

                      if (!confirm) {
                        return;
                      }

                      const response = await props.onTenantUpdate({ id: each.tenant_id, updates: { tier: 1 } });

                      if (!response) {
                        alert('Something went wrong');
                        return;
                      }

                      const next = await props.onGetAllTenants();
                      if (next && next.data) {
                        props.onSetTenants(next.data);
                      }
                    }}
                    style={{ margin: `0 8px 2px 0` }}
                  >
                    Revoke
                  </SmallButton>
                ) : null}
                &nbsp;
                <SmallButton
                  onClick={async () => {
                    const confirm = window.confirm(`Are you sure you want to delete ${each.email}'s application?`);

                    if (!confirm) {
                      return;
                    }

                    const response = await props.onTenantRemove({ id: each.tenant_id });
                    if (!response) {
                      alert('Something went wrong');
                      return;
                    }

                    const next = await props.onGetAllTenants();
                    if (next && next.data) {
                      props.onSetTenants(next.data);
                    }
                  }}
                  style={{ margin: `0 8px 2px 0` }}
                >
                  Remove
                </SmallButton>
              </div>,
            ],
          };
        })}
        headings={['EMAIL', 'COLLABORATOR', 'PARTNER', 'APPROVED', 'ACTIONS']}
        style={{ marginTop: 24 }}
      />
    </Group>
  );
}

export default function AdminTenants(props) {
  const [tenants, setTenants] = React.useState([]);

  React.useEffect(() => {
    async function init() {
      const response = await props.onGetAllTenants();
      if (response && response.data) {
        setTenants(response.data);
      }
    }

    init();
  }, [props]);

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SubTitle>TENANTS</SubTitle>
        <P style={{ marginTop: 6 }}>As an administrator, you can view the current office space tenants, including those paying for entire zones or individual desks.</P>
      </div>

      <AdminTenantCandidates
        onGetAllTenants={props.onGetAllTenants}
        onSetTenants={setTenants}
        onTenantRemove={props.onTenantRemove}
        onTenantUpdate={props.onTenantUpdate}
        tenants={tenants}
      />
    </div>
  );
}
