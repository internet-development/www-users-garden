import styles from '@components/UserGardenWallet.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';
import * as Utilities from '@common/utilities';

import Button from '@system/Button';
import Input from '@system/Input';
import Table from '@system/Table';

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

function UserGardenWalletTransactions(props) {
  return (
    <Group title="Your transaction history">
      <ul className={styles.list}>
        <li>All your account transactions are listed here.</li>
        <li>All your monthly subscription deposits are listed here.</li>
      </ul>

      <Table data={props.transactions} headings={['ACTOR', 'DATE', 'AMOUNT']} style={{ marginTop: 24 }} />
    </Group>
  );
}

const UserText = (props) => {
  const [email, setEmail] = React.useState<string>('');

  const grab = React.useCallback(async () => {
    const response = await props.onCheckAccountOwner({ id: props.id });
    if (response && response.data && response.data.email) {
      setEmail(response.data.email);
    }
  }, [props]);

  React.useEffect(() => {
    grab();
  }, [grab]);

  let source = email;
  if (Utilities.isEmpty(props.id)) {
    source = 'INTDEV TREASURY';
  }

  return <div style={{ paddingTop: 1, ...props.style }}>{source}</div>;
};

export default function UserGardenWallet(props) {
  const [transactions, setTransactions] = React.useState<Record<string, any>[]>([]);
  const [balance, setBalance] = React.useState<string | number>('0');

  const grab = React.useCallback(async () => {
    const response = await props.onGetAllTransactions();
    let nextBalance = 0;

    setTransactions([
      ...response.data.map((each) => {
        nextBalance += Number(each.amount_cents);

        let amountStyle: Record<string, any> = { color: `var(--theme-success)`, fontWeight: 600 };
        if (Number(each.amount_cents) < 0) {
          amountStyle = { color: `var(--theme-error)` };
        }

        return {
          id: each.id,
          data: [
            <UserText onCheckAccountOwner={props.onCheckAccountOwner} id={each.source_account_id} />,
            <TableText>{Utilities.toDateISOString(each.created_at)}</TableText>,
            <TableText style={amountStyle}>{each.amount_cents} ▚▚</TableText>,
          ],
        };
      }),
    ]);

    setBalance(nextBalance);
  }, [props]);

  React.useEffect(() => {
    grab();
  }, [grab]);

  const [amount, setAmount] = React.useState(0);
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SubTitle>Your credits</SubTitle>
        <P style={{ marginTop: 6 }}>
          Manage your INTDEV credits. INTDEV credits ▚▚ are used to pay for premium features in applications, games, and services. You can also exchange credits with other users on
          the platform.
        </P>
      </div>

      <Group title="Your total balance">
        <ul className={styles.list}>
          <li>
            <strong>{balance.toLocaleString()} ▚▚</strong>
          </li>
        </ul>
      </Group>

      <UserGardenWalletTransactions transactions={transactions} />

      <Group title="Send credits">
        <ul className={styles.list}>
          <li>Enter an e-mail address to send credits to any premium user.</li>
          <li>Only premium users have credits; if they are not subscribed, they do not have an account.</li>
          <li>Please note that you cannot send more credits than you have.</li>
        </ul>

        <Input autoComplete="off" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Type an e-mail" style={{ marginTop: 24 }} value={email} />

        <Input autoComplete="off" name="amount" onChange={(e) => setAmount(e.target.value)} placeholder="Type your amount" style={{ marginTop: 16 }} value={amount} type="number" />

        <div className={styles.actions}>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const isValidAmount = Number(amount) > 0;
              if (!isValidAmount) {
                window.alert('Please enter a valid amount');
                setLoading(false);
                return;
              }

              if (Utilities.isEmpty(email)) {
                window.alert('Please enter a valid e-mail');
                setLoading(false);
                return;
              }

              const confirm = window.confirm(`Are you sure you want to send ${email} ${amount} ▚▚? This action is irreversible and you will not be able to get your credits back.`);
              if (!confirm) {
                setLoading(false);
                return;
              }

              const response = await props.onSendTransactionByEmail({ email, amount });
              if (!response || response.error) {
                window.alert('Something went wrong, try again.');
                setLoading(false);
                return;
              }

              await grab();

              setLoading(false);
            }}
          >
            Send {amount} ▚▚
          </Button>
        </div>
      </Group>
    </div>
  );
}
