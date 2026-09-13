# Pulp Security Policy

## Goal

This document defines the official Security Policy for The Pulp Project.

## Commitment

This project is stewarded by **Red Hat, Inc.**, an open-source software steward as defined in Article 3(14) of the [EU Cyber Resilience Act (Regulation 2024/2847)].

Red Hat takes security seriously.
Red Hat is committed to maintaining the highest level of security and trust for all users.
Red Hat appreciates the Pulp community and security researchers' efforts in helping identify and address vulnerabilities responsibly.

Contact: [cra-steward@redhat.com]

## Scope

- Pulp Core (pulpcore)
- All maintained plugins under [the Pulp GitHub organization]
  - Includes plugins maintained by the core Red Hat team and community maintainers
- All contributors, maintainers, committers, and security researchers interacting with these projects

Third-party collections or plugins hosted outside the Pulp organization are out of scope but are encouraged to adopt compatible practices.

## Secure Development Practices

We follow established industry best practices for secure development including, but not limited to:

- Secured version control of source code with push restrictions
- Automated testing of security relevant features (e.g. authentication)
- Mandatory peer reviews and CI checks for integrating code into release branches
- Automated distribution of CI updates via [plugin-template]
- Semi-automatic updates of third-party dependencies via [Dependabot]
- Automated secret leak detection via [GitLeaks]

## Reporting a vulnerability

All reports MUST be submitted by email to: [pulp-security@redhat.com]

Security vulnerabilities MUST NOT be reported through any public or insecure method, including but not limited to
Public GitHub issues, Pull Requests, Pulp Discourse, Pulp Matrix, Public forums or social media.

Please refer to the [Vulnerability Management Policy] for full details on how to report a vulnerability.

## Incident response

A security incident is any event indicating that Pulp project infrastructure, build systems, distribution channels, or governance accounts have been compromised or are under active attack.
This is distinct from a vulnerability report (a flaw in code) and requires operational response.

The response steps are:

1. **Contain:** Isolate affected systems, revoke compromised credentials, and halt affected release pipelines
1. **Assess:** Determine the scope, impact, and root cause of the incident
1. **Remediate:** Apply fixes, rotate credentials, rebuild affected artifacts from verified sources
1. **Communicate:** Notify affected parties. For incidents affecting released artifacts, issue a public advisory
1. **Post-mortem:** Conduct a blameless post-incident review. Document lessons learned and update this policy if warranted

## Security Policy Hierarchy

The `SECURITY.md` file is the standard location where users, developers, and security researchers can find information on how to report a potential vulnerability for a particular repository.
Having this file ensures high visibility and automatic integration with GitHub's security features.

Each project SHOULD host a `SECURITY.md` file in the root directory of their GitHub repository.
The `SECURITY.md` file MAY be a copy of this policy.
If the file exists and is not an exact copy, it MUST point to this document as an authoritative policy.

## Policy governance

This policy may be updated periodically.
Suggestions for improvement can be submitted through issues or pull requests to the [pulp/governance] repository.

## Notes

The key words "MUST", "MUST NOT", and "SHOULD" in this document are to be interpreted as described in [RFC 2119].

<!-- links -->

[the pulp github organization]: https://github.com/pulp/
[vulnerability management policy]: docs/vulnerability-management-policy.md
[eu cyber resilience act (regulation 2024/2847)]: https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng
[cra-steward@redhat.com]: mailto:cra-steward@redhat.com
[pulp-security@redhat.com]: mailto:pulp-security@redhat.com
[pulp/governance]: https://github.com/pulp/governance
[rfc 2119]: https://www.rfc-editor.org/rfc/rfc2119.html
[gitleaks]: https://github.com/gitleaks/gitleaks
[dependabot]: https://github.com/dependabot
[plugin-template]: https://github.com/pulp/plugin_template/