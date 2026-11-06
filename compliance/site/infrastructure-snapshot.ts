import type { InfrastructureSnapshot } from '@root/compliance/site/types';

export const INFRASTRUCTURE_SNAPSHOT: InfrastructureSnapshot | null = {
  "captured_at": "2026-11-06T04:58:31Z",
  "aws": {
    "regions": [
      {
        "region": "us-east-1",
        "guardduty": "enabled",
        "alerts": {
          "rule": "enabled",
          "targets_topic": true,
          "confirmed": [
            "eng@internet.dev"
          ],
          "pending": 0
        },
        "flow_logs": {
          "vpcs": 1,
          "logged": 1
        },
        "ebs_encryption_by_default": false,
        "unencrypted_ebs_snapshots": 0,
        "unencrypted_rds_snapshots": 0,
        "security_groups": [
          {
            "group": "default",
            "inbound": [
              "All traffic from members of the same group"
            ],
            "outbound": [
              "All traffic to any IPv4 address"
            ],
            "open_to_internet": false,
            "attached": 0,
            "instances": {
              "running": 0,
              "stopped": 0
            }
          }
        ]
      },
      {
        "region": "us-east-2",
        "guardduty": "enabled",
        "alerts": {
          "rule": "enabled",
          "targets_topic": true,
          "confirmed": [
            "eng@internet.dev"
          ],
          "pending": 0
        },
        "flow_logs": {
          "vpcs": 1,
          "logged": 1
        },
        "ebs_encryption_by_default": false,
        "unencrypted_ebs_snapshots": 0,
        "unencrypted_rds_snapshots": 0,
        "security_groups": [
          {
            "group": "default",
            "inbound": [
              "All traffic from members of the same group"
            ],
            "outbound": [
              "All traffic to any IPv4 address"
            ],
            "open_to_internet": false,
            "attached": 0,
            "instances": {
              "running": 0,
              "stopped": 0
            }
          }
        ]
      },
      {
        "region": "us-west-1",
        "guardduty": "enabled",
        "alerts": {
          "rule": "enabled",
          "targets_topic": true,
          "confirmed": [
            "eng@internet.dev"
          ],
          "pending": 0
        },
        "flow_logs": {
          "vpcs": 1,
          "logged": 1
        },
        "ebs_encryption_by_default": false,
        "unencrypted_ebs_snapshots": 0,
        "unencrypted_rds_snapshots": 0,
        "security_groups": [
          {
            "group": "default",
            "inbound": [
              "All traffic from members of the same group"
            ],
            "outbound": [
              "All traffic to any IPv4 address"
            ],
            "open_to_internet": false,
            "attached": 0,
            "instances": {
              "running": 0,
              "stopped": 0
            }
          }
        ]
      },
      {
        "region": "us-west-2",
        "guardduty": "enabled",
        "alerts": {
          "rule": "enabled",
          "targets_topic": true,
          "confirmed": [
            "eng@internet.dev"
          ],
          "pending": 0
        },
        "flow_logs": {
          "vpcs": 1,
          "logged": 1
        },
        "ebs_encryption_by_default": false,
        "unencrypted_ebs_snapshots": 0,
        "unencrypted_rds_snapshots": 0,
        "security_groups": [
          {
            "group": "default",
            "inbound": [
              "All traffic from members of the same group"
            ],
            "outbound": [
              "All traffic to any IPv4 address"
            ],
            "open_to_internet": false,
            "attached": 0,
            "instances": {
              "running": 0,
              "stopped": 0
            }
          },
          {
            "group": "rds-launch-wizard",
            "inbound": [
              "TCP 5432 from 1 named address and 1 private network range"
            ],
            "outbound": [
              "All traffic to any IPv4 address"
            ],
            "open_to_internet": false,
            "attached": 0,
            "instances": {
              "running": 0,
              "stopped": 0
            }
          }
        ]
      }
    ],
    "buckets": {
      "total": 7,
      "https_only": 7,
      "owner_tagged": 7,
      "data": [
        {
          "name": "intdev-global",
          "https_only": true,
          "owner_tagged": true,
          "versioning": "Enabled",
          "noncurrent_days": null,
          "expires_current_versions": false,
          "malware_protection": "ACTIVE"
        },
        {
          "name": "txtdev",
          "https_only": true,
          "owner_tagged": true,
          "versioning": "Enabled",
          "noncurrent_days": null,
          "expires_current_versions": false,
          "malware_protection": "ACTIVE"
        }
      ]
    },
    "trails": [
      {
        "name": "management-events-trail",
        "multi_region": true,
        "logging": true,
        "delivery_error": false,
        "bucket_versioning": true,
        "bucket_object_lock": true
      }
    ],
    "iam_users": [
      {
        "name": "admin",
        "console": true,
        "mfa": true,
        "active_keys": 1,
        "unused_keys": 0,
        "last_used": "2026-11-06",
        "last_used_service": "s3",
        "owner_tagged": true
      },
      {
        "name": "intdev",
        "console": false,
        "mfa": false,
        "active_keys": 1,
        "unused_keys": 0,
        "last_used": "2026-11-06",
        "last_used_service": "s3",
        "owner_tagged": true
      },
      {
        "name": "nexts3",
        "console": false,
        "mfa": false,
        "active_keys": 2,
        "unused_keys": 1,
        "last_used": "2020-10-10",
        "last_used_service": "s3",
        "owner_tagged": true
      },
      {
        "name": "nicole",
        "console": false,
        "mfa": false,
        "active_keys": 1,
        "unused_keys": 0,
        "last_used": "2025-03-31",
        "last_used_service": "s3",
        "owner_tagged": true
      },
      {
        "name": "readingsupply",
        "console": false,
        "mfa": false,
        "active_keys": 1,
        "unused_keys": 0,
        "last_used": "2025-08-24",
        "last_used_service": "sts",
        "owner_tagged": true
      },
      {
        "name": "txtdev",
        "console": false,
        "mfa": false,
        "active_keys": 1,
        "unused_keys": 0,
        "last_used": "2023-08-26",
        "last_used_service": "s3",
        "owner_tagged": true
      }
    ],
    "roles": {
      "total": 2,
      "owner_tagged": 2
    }
  },
  "tls": [
    {
      "host": "api.internet.dev",
      "http": "301 to HTTPS",
      "protocol": "TLSv1.3",
      "cipher": "TLS_AES_256_GCM_SHA384",
      "tls_1_1": "refused",
      "issuer": "Google Trust Services WE1",
      "valid_to": "2026-12-26T04:59:02.000Z",
      "error": null
    },
    {
      "host": "users.garden",
      "http": "301 to HTTPS",
      "protocol": "TLSv1.3",
      "cipher": "TLS_AES_256_GCM_SHA384",
      "tls_1_1": "refused",
      "issuer": "Google Trust Services WE1",
      "valid_to": "2026-12-08T07:06:28.000Z",
      "error": null
    },
    {
      "host": "terminalgraph.com",
      "http": "301 to HTTPS",
      "protocol": "TLSv1.3",
      "cipher": "TLS_AES_256_GCM_SHA384",
      "tls_1_1": "refused",
      "issuer": "Google Trust Services WE1",
      "valid_to": "2027-02-03T11:04:58.000Z",
      "error": null
    },
    {
      "host": "internet.dev",
      "http": "301 to HTTPS",
      "protocol": "TLSv1.3",
      "cipher": "TLS_AES_256_GCM_SHA384",
      "tls_1_1": "refused",
      "issuer": "Google Trust Services WE1",
      "valid_to": "2026-12-21T03:54:57.000Z",
      "error": null
    }
  ]
};
