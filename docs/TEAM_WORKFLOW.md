# Team workflow

## Before coding
1. Confirm the stack and module owners.
2. Agree on package names, API routes and shared data models.
3. Do not edit another member's owned files without coordinating.

## Suggested module ownership
- Member 1: authentication, users and roles
- Member 2: products, variants, plans and taxes
- Member 3: quotations, subscriptions and discounts
- Member 4: invoices, recurring billing, payments and reports

## Commit examples
- `chore: add initial project scaffold`
- `feat(auth): add customer registration endpoint`
- `feat(catalog): add product model`
- `fix(billing): prevent duplicate invoice generation`

## Shared branch safety
The organizer's instructions require the submitted code to exist in a single
branch. Until the organizer confirms whether temporary branches are allowed,
coordinate pushes to `main`. Pull before pushing and avoid simultaneous edits
to shared files.
