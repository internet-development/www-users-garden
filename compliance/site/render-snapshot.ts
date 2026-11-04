import type { DeployStatus } from '@root/compliance/site/types';

export const DEPLOY_SNAPSHOT_CAPTURED_AT = '2026-11-04T03:26:14Z';

export const RENDER_MEMBERSHIP_CHECKED_AT: string | null = null;

export const RENDER_MEMBERSHIP_SNAPSHOT: Record<string, boolean | null> = {};

export const DEPLOY_SNAPSHOT: Record<string, DeployStatus> = {
  'internet-apis': {
    service: { name: 'internet-apis', label: 'INTDEV API', url: 'https://api.internet.dev', provider: 'render', type: 'web_service', region: 'oregon', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-dbl7rd9srm7s73fm9te0',
    fetched_at: '2026-11-04T03:26:14Z',
    deploys: [
      { id: 'dep-dbl7rd9srm7s73fm9te0', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: '195333d', message: '2.0.8' }, created_at: '2026-11-04T00:35:01.522798Z', started_at: '2026-11-04T00:35:01.496815Z', finished_at: '2026-11-04T00:38:42.652872Z', duration_seconds: 221 },
      { id: 'dep-dbjasfjbc2fs73d9uq5g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '5119638', message: '2.0.6' }, created_at: '2026-11-01T03:13:02.699759Z', started_at: '2026-11-01T03:13:02.67229Z', finished_at: '2026-11-01T03:16:28.591233Z', duration_seconds: 206 },
      { id: 'dep-dbguekei0phs73csv9pg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'b5b432a', message: '2.0.5' }, created_at: '2026-10-28T12:15:13.788158Z', started_at: '2026-10-28T12:15:13.751047Z', finished_at: '2026-10-28T12:18:45.347106Z', duration_seconds: 212 },
      { id: 'dep-dbgbfcfavr4c73did2bg', status: 'deactivated', trigger: 'manual', commit: { id: null, short_id: '569da31', message: 'hotfix: slides' }, created_at: '2026-10-27T14:39:45.339683Z', started_at: '2026-10-27T14:39:45.30977Z', finished_at: '2026-10-27T14:43:51.725152Z', duration_seconds: 246 },
      { id: 'dep-dbgb6vvlk1mc73b8j770', status: 'deactivated', trigger: 'manual', commit: { id: null, short_id: '569da31', message: 'hotfix: slides' }, created_at: '2026-10-27T14:21:51.917033Z', started_at: '2026-10-27T14:21:51.886304Z', finished_at: '2026-10-27T14:25:36.590683Z', duration_seconds: 225 },
      { id: 'dep-das38q7f3r2c73ajicrg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '569da31', message: 'hotfix: slides' }, created_at: '2026-09-26T21:08:56.630478Z', started_at: '2026-09-26T21:08:56.607061Z', finished_at: '2026-09-26T21:12:25.798888Z', duration_seconds: 209 },
      { id: 'dep-das1of0473hc73ff7k80', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '04a9e28', message: 'hotfix: docs' }, created_at: '2026-09-26T19:25:48.875615Z', started_at: '2026-09-26T19:25:48.851495Z', finished_at: '2026-09-26T19:29:12.627587Z', duration_seconds: 204 },
      { id: 'dep-das1mirl550s738t3cog', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '4dcfbd8', message: 'hotfix: slides validation' }, created_at: '2026-09-26T19:21:47.24161Z', started_at: '2026-09-26T19:21:47.212674Z', finished_at: '2026-09-26T19:25:40.557259Z', duration_seconds: 233 },
      { id: 'dep-daq6jvnf3r2c7392c2ag', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1fd94f2', message: 'hotfix: a temporary patch' }, created_at: '2026-09-24T00:08:30.669928Z', started_at: '2026-09-24T00:08:30.649673Z', finished_at: '2026-09-24T00:12:21.24294Z', duration_seconds: 231 },
      { id: 'dep-daot8vm7bikc73b70bog', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'fea6ce1', message: 'hotfix' }, created_at: '2026-09-22T01:06:06.276316Z', started_at: '2026-09-22T01:06:06.25504Z', finished_at: '2026-09-22T01:09:54.148089Z', duration_seconds: 228 },
    ],
  },
  'www-users-garden': {
    service: { name: 'www-users-garden', label: 'Users Garden', url: 'https://users.garden', provider: 'render', type: 'web_service', region: 'ohio', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-dbl7rqnb9u1s73fphl80',
    fetched_at: '2026-11-04T03:26:14Z',
    deploys: [
      { id: 'dep-dbl7rqnb9u1s73fphl80', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: 'a93ae7e', message: '1.1.5' }, created_at: '2026-11-04T00:35:54.489274Z', started_at: '2026-11-04T00:35:54.449943Z', finished_at: '2026-11-04T00:37:04.262883Z', duration_seconds: 70 },
      { id: 'dep-dbh0qj942hec739g1gjg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'f266209', message: '1.1.3' }, created_at: '2026-10-28T14:57:17.51511Z', started_at: '2026-10-28T14:57:17.464256Z', finished_at: '2026-10-28T14:58:31.946238Z', duration_seconds: 74 },
      { id: 'dep-dbgpd6lg1s2s73e8erng', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'f69d833', message: '1.1.2' }, created_at: '2026-10-28T06:30:50.92646Z', started_at: '2026-10-28T06:30:50.890863Z', finished_at: '2026-10-28T06:32:13.964135Z', duration_seconds: 83 },
      { id: 'dep-db1ur1nlk1mc7389ca20', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'd7a207d', message: 'hotfix: water' }, created_at: '2026-10-05T18:33:42.442286Z', started_at: '2026-10-05T18:33:42.413052Z', finished_at: '2026-10-05T18:34:56.858955Z', duration_seconds: 74 },
      { id: 'dep-db1umc3ncjis73c06g4g', status: 'build_failed', trigger: 'new_commit', commit: { id: null, short_id: '4fd262c', message: 'hotfix: water' }, created_at: '2026-10-05T18:23:44.282826Z', started_at: '2026-10-05T18:23:44.247464Z', finished_at: '2026-10-05T18:24:15.902373Z', duration_seconds: 32 },
      { id: 'dep-db1uhnbncjis73bvu7ng', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '4adbdfd', message: 'hotfix: water' }, created_at: '2026-10-05T18:13:49.366504Z', started_at: '2026-10-05T18:13:49.294586Z', finished_at: '2026-10-05T18:14:53.049127Z', duration_seconds: 64 },
      { id: 'dep-db1sv4jtqb8s739pkcag', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'bb60213', message: 'hotfix: sms' }, created_at: '2026-10-05T16:25:54.145771Z', started_at: '2026-10-05T16:25:54.116904Z', finished_at: '2026-10-05T16:27:07.605654Z', duration_seconds: 73 },
      { id: 'dep-d6f3su1r0fns73fd6pt0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '9bc89dc', message: '1.1.0' }, created_at: '2026-02-25T00:12:40.836639Z', started_at: '2026-02-25T00:12:40.796204Z', finished_at: '2026-02-25T00:14:35.878278Z', duration_seconds: 115 },
      { id: 'dep-d5vuidp5pdvs73aju1eg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '7a247eb', message: 'NextJS 16.1.4' }, created_at: '2026-02-02T00:00:56.762076Z', started_at: '2026-02-02T00:00:56.704822Z', finished_at: '2026-02-02T00:05:06.719449Z', duration_seconds: 250 },
      { id: 'dep-d5vubo95pdvs73ajsiug', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'c85e859', message: 'NextJS 16.1.4' }, created_at: '2026-02-01T23:46:42.957816Z', started_at: '2026-02-01T23:46:42.912424Z', finished_at: '2026-02-01T23:48:18.116466Z', duration_seconds: 95 },
    ],
  },
  'terminalgraph': {
    service: { name: 'terminalgraph', label: 'Terminal Graph', url: 'https://terminalgraph.com', provider: 'render', type: 'web_service', region: 'oregon', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-db456fjbc2fs73bdi7ag',
    fetched_at: '2026-11-04T03:26:14Z',
    deploys: [
      { id: 'dep-db456fjbc2fs73bdi7ag', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: 'c736a16', message: 'chore(release): update beta appcast for v0.16.0-beta' }, created_at: '2026-10-09T02:36:46.809088Z', started_at: '2026-10-09T02:36:46.781831Z', finished_at: '2026-10-09T02:37:57.311141Z', duration_seconds: 71 },
      { id: 'dep-db3f2hbl550s73aemk5g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1398546', message: 'chore(release): update beta appcast for v0.15.0-beta' }, created_at: '2026-10-08T01:26:29.372272Z', started_at: '2026-10-08T01:26:29.341818Z', finished_at: '2026-10-08T01:27:38.93284Z', duration_seconds: 70 },
      { id: 'dep-dadnnfh7lnhs73e75ufg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '71b4cf8', message: 'chore(release): update beta appcast for v0.14.4-beta' }, created_at: '2026-09-05T02:17:34.282839Z', started_at: '2026-09-05T02:17:34.256476Z', finished_at: '2026-09-05T02:18:43.554886Z', duration_seconds: 69 },
      { id: 'dep-da73khflk1mc73eaps30', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'a74455d', message: 'chore(release): update beta appcast for v0.14.3-beta' }, created_at: '2026-08-26T00:58:45.632761Z', started_at: '2026-08-26T00:58:45.581972Z', finished_at: '2026-08-26T00:59:56.088279Z', duration_seconds: 71 },
      { id: 'dep-da6f6hjbc2fs73cib80g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'b3dbe66', message: 'chore(release): update beta appcast for v0.14.2-beta' }, created_at: '2026-08-25T01:43:34.436738Z', started_at: '2026-08-25T01:43:34.388194Z', finished_at: '2026-08-25T01:44:44.069872Z', duration_seconds: 70 },
      { id: 'dep-da4bkjcs728c73fggab0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '524c9e4', message: 'feat: add pricing and features routes' }, created_at: '2026-08-21T20:51:25.559351Z', started_at: '2026-08-21T20:51:25.523319Z', finished_at: '2026-08-21T20:52:44.556028Z', duration_seconds: 79 },
      { id: 'dep-da4b7ohsrm7s73dm1c40', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '080fc85', message: 'feat: publish developer resource index' }, created_at: '2026-08-21T20:24:02.182622Z', started_at: '2026-08-21T20:24:02.141026Z', finished_at: '2026-08-21T20:25:11.433829Z', duration_seconds: 69 },
      { id: 'dep-da4b10ss728c73bagr00', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'fcc3f4f', message: 'feat: add agent-friendly site responses' }, created_at: '2026-08-21T20:09:39.770156Z', started_at: '2026-08-21T20:09:39.726838Z', finished_at: '2026-08-21T20:10:50.902612Z', duration_seconds: 71 },
      { id: 'dep-da12oqp5efls73dooto0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'f559774', message: 'chore(release): update beta appcast for v0.14.1-beta' }, created_at: '2026-08-16T21:32:27.616432Z', started_at: '2026-08-16T21:32:27.576636Z', finished_at: '2026-08-16T21:33:38.980561Z', duration_seconds: 71 },
      { id: 'dep-d9vpbb0ae00c738qc4qg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'eb959ce', message: 'chore(release): update beta appcast for v0.14.0-beta' }, created_at: '2026-08-14T22:24:44.580481Z', started_at: '2026-08-14T22:24:44.543153Z', finished_at: '2026-08-14T22:25:54.006008Z', duration_seconds: 69 },
    ],
  },
  'www-internet-v3': {
    service: { name: 'www-internet-v3', label: 'INTDEV', url: 'https://internet.dev', provider: 'render', type: 'web_service', region: 'ohio', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-dbl7rke7bikc739lekfg',
    fetched_at: '2026-11-04T03:26:14Z',
    deploys: [
      { id: 'dep-dbl7rke7bikc739lekfg', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: 'ad097ff', message: '0.0.25' }, created_at: '2026-11-04T00:35:29.522588Z', started_at: '2026-11-04T00:35:29.495505Z', finished_at: '2026-11-04T00:36:59.37981Z', duration_seconds: 90 },
      { id: 'dep-dbhm7di9lscs739uh2pg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1ad3405', message: '0.0.23' }, created_at: '2026-10-29T15:18:15.038073Z', started_at: '2026-10-29T15:18:15.014078Z', finished_at: '2026-10-29T15:19:40.556755Z', duration_seconds: 86 },
      { id: 'dep-dbhm1gnlk1mc73d3tqn0', status: 'deactivated', trigger: 'manual', commit: { id: null, short_id: 'd78ebb1', message: '0.0.22' }, created_at: '2026-10-29T15:05:38.844443Z', started_at: '2026-10-29T15:05:38.814106Z', finished_at: '2026-10-29T15:07:58.221605Z', duration_seconds: 139 },
      { id: 'dep-dbhfto2vcj2c7381crtg', status: 'update_failed', trigger: 'new_commit', commit: { id: null, short_id: 'd78ebb1', message: '0.0.22' }, created_at: '2026-10-29T08:08:00.793608Z', started_at: '2026-10-29T08:08:00.769544Z', finished_at: '2026-10-29T08:23:52.157398Z', duration_seconds: 951 },
      { id: 'dep-db2s8hjrjlhs73fq884g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '427035c', message: 'Merge pull request #5 from internet-development/carrier-add-rishav' }, created_at: '2026-10-07T04:02:14.736052Z', started_at: '2026-10-07T04:02:14.71645Z', finished_at: '2026-10-07T04:03:27.754353Z', duration_seconds: 73 },
      { id: 'dep-dau90fff3r2c73elevc0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'd4b5fb8', message: 'hotfix: consent' }, created_at: '2026-09-30T04:29:49.763564Z', started_at: '2026-09-30T04:29:49.739824Z', finished_at: '2026-09-30T04:31:36.102742Z', duration_seconds: 106 },
      { id: 'dep-dagv418u01pc73cbboi0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '0d69e7f', message: 'Merge pull request #4 from internet-development/add-set-world-research-site' }, created_at: '2026-09-09T23:55:49.431411Z', started_at: '2026-09-09T23:55:49.409872Z', finished_at: '2026-09-09T23:56:53.329648Z', duration_seconds: 64 },
      { id: 'dep-daguvf7avr4c73dunl10', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1c6b5af', message: 'Merge pull request #3 from internet-development/add-set-world-research-site' }, created_at: '2026-09-09T23:46:04.12476Z', started_at: '2026-09-09T23:46:04.106073Z', finished_at: '2026-09-09T23:47:10.457057Z', duration_seconds: 66 },
      { id: 'dep-da89hclg1s2s7384cj60', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '3665c2c', message: '0.0.21' }, created_at: '2026-08-27T20:06:10.271693Z', started_at: '2026-08-27T20:06:10.242065Z', finished_at: '2026-08-27T20:07:30.696451Z', duration_seconds: 80 },
      { id: 'dep-da5s9gp5efls73a0amc0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '035c7f8', message: '0.0.20' }, created_at: '2026-08-24T04:12:52.070493Z', started_at: '2026-08-24T04:12:52.028345Z', finished_at: '2026-08-24T04:13:56.223783Z', duration_seconds: 64 },
    ],
  },
};
