# PRD: Auth and Workspace Access

## Summary
Implement invite-based authentication for several users per workspace. 

## Goals
- Secure sign-in flow.
- Invite-based workspace membership.

## Non-Goals
- Public sign-up or multi-workspace admin tools.

## User Stories
- As a user, I can invite a second user by email.
- As an invited user, I can accept and join the workspace.

## Functional Requirements
- Auth provider integration and session management.
- Workspace entity with owner and member.
- Invite token creation, expiry, and acceptance.

## UX Notes
- Clear invite status with resend option.
- Simple account settings page.

## Data Model
- User, Workspace, WorkspaceMember, InviteToken.

## Dependencies
- Database schema.

## Milestones
1. Auth integration and session handling.
2. Workspace and membership schema.
3. Invite flow UI.

## Risks
- Token leakage or expired invite handling.
