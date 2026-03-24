# Branch Protection: main

Recommended required rules for `main`:

1. Require a pull request before merging.
2. Require 1 approval.
3. Dismiss stale pull request approvals when new commits are pushed.
4. Require review from code owners.
5. Require status checks to pass before merging:
   - `Frontend CI / build`
   - `Backend CI / quality`
6. Require conversation resolution before merging.
7. Require linear history.
8. Include administrators.
9. Disable force pushes.
10. Disable branch deletions.
