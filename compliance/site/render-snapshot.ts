import type { DeployStatus } from '@root/compliance/site/types';

export const DEPLOY_SNAPSHOT_CAPTURED_AT = '2026-11-05T00:52:01Z';

export const RENDER_MEMBERSHIP_CHECKED_AT: string | null = '2026-11-05T00:52:01Z';

export const RENDER_MEMBERSHIP_SNAPSHOT: Record<string, boolean | null> = {
  '3b1bda59-6474-4cb4-9883-63772d575992': false,
  '729f61e8-085e-4954-b5e6-06047a8cb029': false,
  'b8abafa4-6c7b-4e6c-9db2-ab146ecfaaad': false,
  'fa784f8d-5410-4f51-8dd1-4c6afb7d22a1': false,
};

export const DEPLOY_SNAPSHOT: Record<string, DeployStatus> = {
  'internet-apis': {
    service: { name: 'internet-apis', label: 'INTDEV API', url: 'https://api.internet.dev', provider: 'render', type: 'web_service', region: 'oregon', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-dblstulckfvc739qhbf0',
    fetched_at: '2026-11-05T00:52:01Z',
    deploys: [
      { id: 'dep-dblstulckfvc739qhbf0', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: '876edfa', message: '2.0.25' }, created_at: '2026-11-05T00:34:02.110746Z', started_at: '2026-11-05T00:34:02.076171Z', finished_at: '2026-11-05T00:38:10.552263Z', duration_seconds: 248 },
      { id: 'dep-dblshu49v7es73bucln0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'f015322', message: '2.0.24' }, created_at: '2026-11-05T00:08:24.401895Z', started_at: '2026-11-05T00:08:24.367524Z', finished_at: '2026-11-05T00:12:44.131601Z', duration_seconds: 260 },
      { id: 'dep-dbli7fvavr4c73ctclk0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'a3f79a5', message: '2.0.22' }, created_at: '2026-11-04T12:23:27.250114Z', started_at: '2026-11-04T12:23:27.221401Z', finished_at: '2026-11-04T12:26:55.906278Z', duration_seconds: 209 },
      { id: 'dep-dblh4dnavr4c73crvrkg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '908bd00', message: '2.0.20' }, created_at: '2026-11-04T11:08:39.020989Z', started_at: '2026-11-04T11:08:38.983436Z', finished_at: '2026-11-04T11:12:36.816111Z', duration_seconds: 238 },
      { id: 'dep-dblgdv17lnhs739mn1dg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '42939b7', message: '2.0.19' }, created_at: '2026-11-04T10:20:44.734154Z', started_at: '2026-11-04T10:20:44.702986Z', finished_at: '2026-11-04T10:24:17.453617Z', duration_seconds: 213 },
      { id: 'dep-dblfis67bikc73akk55g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '23811ae', message: '2.0.18' }, created_at: '2026-11-04T09:22:57.020341Z', started_at: '2026-11-04T09:22:56.99054Z', finished_at: '2026-11-04T09:26:40.32976Z', duration_seconds: 223 },
      { id: 'dep-dblen5o473hc73b3targ', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '653b058', message: '2.0.17' }, created_at: '2026-11-04T08:23:51.610007Z', started_at: '2026-11-04T08:23:51.585257Z', finished_at: '2026-11-04T08:28:02.570913Z', duration_seconds: 251 },
      { id: 'dep-dbledtvb9u1s73bcac80', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '00bcf63', message: '2.0.16' }, created_at: '2026-11-04T08:04:07.303906Z', started_at: '2026-11-04T08:04:07.276853Z', finished_at: '2026-11-04T08:07:37.133416Z', duration_seconds: 210 },
      { id: 'dep-dblctvnlk1mc73eq9j2g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'b5ce55c', message: '2.0.15' }, created_at: '2026-11-04T06:21:50.914218Z', started_at: '2026-11-04T06:21:50.89059Z', finished_at: '2026-11-04T06:25:26.378916Z', duration_seconds: 215 },
      { id: 'dep-dblcj3u7bikc73ahalsg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'a32ad56', message: '2.0.13' }, created_at: '2026-11-04T05:58:39.498959Z', started_at: '2026-11-04T05:58:39.474868Z', finished_at: '2026-11-04T06:02:15.313394Z', duration_seconds: 216 },
    ],
  },
  'www-users-garden': {
    service: { name: 'www-users-garden', label: 'Users Garden', url: 'https://users.garden', provider: 'render', type: 'web_service', region: 'ohio', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-dblsi76q1p3s738uma20',
    fetched_at: '2026-11-05T00:52:01Z',
    deploys: [
      { id: 'dep-dblsi76q1p3s738uma20', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: 'e697840', message: '1.1.16' }, created_at: '2026-11-05T00:09:00.414754Z', started_at: '2026-11-05T00:09:00.386256Z', finished_at: '2026-11-05T00:10:06.886493Z', duration_seconds: 67 },
      { id: 'dep-dbli7iivcj2c738pcf4g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '18ff348', message: '1.1.15' }, created_at: '2026-11-04T12:23:38.202358Z', started_at: '2026-11-04T12:23:38.17398Z', finished_at: '2026-11-04T12:24:50.161207Z', duration_seconds: 72 },
      { id: 'dep-dblh4g67bikc73amaceg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'ebe67e4', message: '1.1.14' }, created_at: '2026-11-04T11:08:48.938386Z', started_at: '2026-11-04T11:08:48.911006Z', finished_at: '2026-11-04T11:09:56.228037Z', duration_seconds: 67 },
      { id: 'dep-dblfj7flk1mc73et63pg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '721cd60', message: '1.1.12' }, created_at: '2026-11-04T09:23:41.743162Z', started_at: '2026-11-04T09:23:41.71657Z', finished_at: '2026-11-04T09:24:57.376755Z', duration_seconds: 76 },
      { id: 'dep-dblemh97lnhs739kqi6g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '5523a47', message: '1.1.11' }, created_at: '2026-11-04T08:22:29.293937Z', started_at: '2026-11-04T08:22:29.26882Z', finished_at: '2026-11-04T08:23:29.225816Z', duration_seconds: 60 },
      { id: 'dep-dblee6p7lnhs739khob0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '748f47f', message: '1.1.10' }, created_at: '2026-11-04T08:04:43.674823Z', started_at: '2026-11-04T08:04:43.64814Z', finished_at: '2026-11-04T08:05:59.811999Z', duration_seconds: 76 },
      { id: 'dep-dblcit67bikc73ahadgg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'e7049ea', message: '1.1.9' }, created_at: '2026-11-04T05:58:12.095526Z', started_at: '2026-11-04T05:58:12.062811Z', finished_at: '2026-11-04T05:59:26.472158Z', duration_seconds: 74 },
      { id: 'dep-dblc6vfavr4c73cmog9g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '9f4e70b', message: '1.1.8' }, created_at: '2026-11-04T05:32:45.516384Z', started_at: '2026-11-04T05:32:45.493731Z', finished_at: '2026-11-04T05:33:45.812987Z', duration_seconds: 60 },
      { id: 'dep-dblbd9tckfvc73fbm2a0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'ab3ca72', message: '1.1.7' }, created_at: '2026-11-04T04:37:59.30005Z', started_at: '2026-11-04T04:37:59.273294Z', finished_at: '2026-11-04T04:39:19.110664Z', duration_seconds: 80 },
      { id: 'dep-dblanuivcj2c738h573g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'c857504', message: '1.1.6' }, created_at: '2026-11-04T03:52:26.470167Z', started_at: '2026-11-04T03:52:26.446975Z', finished_at: '2026-11-04T03:53:41.344817Z', duration_seconds: 75 },
    ],
  },
  'terminalgraph': {
    service: { name: 'terminalgraph', label: 'Terminal Graph', url: 'https://terminalgraph.com', provider: 'render', type: 'web_service', region: 'oregon', branch: 'main', auto_deploy: true, auto_deploy_trigger: 'commit', suspended: false },
    state: 'operational',
    live_deploy_id: 'dep-db456fjbc2fs73bdi7ag',
    fetched_at: '2026-11-05T00:52:01Z',
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
    live_deploy_id: 'dep-dblsi73bc2fs7395difg',
    fetched_at: '2026-11-05T00:52:01Z',
    deploys: [
      { id: 'dep-dblsi73bc2fs7395difg', status: 'live', trigger: 'new_commit', commit: { id: null, short_id: '735b96c', message: '0.0.36' }, created_at: '2026-11-05T00:09:00.505854Z', started_at: '2026-11-05T00:09:00.479163Z', finished_at: '2026-11-05T00:10:09.736192Z', duration_seconds: 69 },
      { id: 'dep-dbli9ss9v7es73d663ig', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'dd0dc1c', message: '0.0.35' }, created_at: '2026-11-04T12:28:35.311718Z', started_at: '2026-11-04T12:28:35.283563Z', finished_at: '2026-11-04T12:29:52.714284Z', duration_seconds: 77 },
      { id: 'dep-dblhe02vcj2c738oad2g', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '6a21f52', message: '0.0.34' }, created_at: '2026-11-04T11:29:04.683965Z', started_at: '2026-11-04T11:29:04.661296Z', finished_at: '2026-11-04T11:30:12.364439Z', duration_seconds: 68 },
      { id: 'dep-dblgfd7lk1mc73eu5k50', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1cab8ed', message: '0.0.33' }, created_at: '2026-11-04T10:23:48.937725Z', started_at: '2026-11-04T10:23:48.913714Z', finished_at: '2026-11-04T10:24:56.483987Z', duration_seconds: 68 },
      { id: 'dep-dblfj65bedkc73a8lsfg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '8b54675', message: '0.0.32' }, created_at: '2026-11-04T09:23:36.866934Z', started_at: '2026-11-04T09:23:36.83887Z', finished_at: '2026-11-04T09:24:53.332168Z', duration_seconds: 76 },
      { id: 'dep-dblemmg473hc73b3sukg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '28934c3', message: '0.0.31' }, created_at: '2026-11-04T08:22:51.028727Z', started_at: '2026-11-04T08:22:51.000264Z', finished_at: '2026-11-04T08:24:07.370068Z', duration_seconds: 76 },
      { id: 'dep-dblee8avcj2c738kusq0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '1b88397', message: '0.0.30' }, created_at: '2026-11-04T08:04:49.197947Z', started_at: '2026-11-04T08:04:49.174111Z', finished_at: '2026-11-04T08:06:04.040125Z', duration_seconds: 75 },
      { id: 'dep-dblcit0473hc73b1mqr0', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'efb2298', message: '0.0.29' }, created_at: '2026-11-04T05:58:12.995038Z', started_at: '2026-11-04T05:58:12.972685Z', finished_at: '2026-11-04T05:59:23.01493Z', duration_seconds: 70 },
      { id: 'dep-dblc6u67bikc73agu670', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: 'c3a4dbb', message: '0.0.28' }, created_at: '2026-11-04T05:32:41.016104Z', started_at: '2026-11-04T05:32:40.992116Z', finished_at: '2026-11-04T05:33:45.223478Z', duration_seconds: 64 },
      { id: 'dep-dblbda67bikc73ag4rgg', status: 'deactivated', trigger: 'new_commit', commit: { id: null, short_id: '8859659', message: '0.0.27' }, created_at: '2026-11-04T04:38:00.144158Z', started_at: '2026-11-04T04:38:00.12324Z', finished_at: '2026-11-04T04:39:09.782141Z', duration_seconds: 70 },
    ],
  },
};
