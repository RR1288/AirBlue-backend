# Standards
- Create a task/issue on Jira
- Assign the task/issue to yourself
- Create a branch from the Jira issue (e.g., `AIRBLUE-123-description`).
- Locally:
  ```bash
  git fetch
  git checkout <branch-name>
  ```
- Make your changes.
- Before pushing your code, pull the latest changes from `main`:
  ```bash
  git pull origin main
  ```
- Push your branch:
  ```bash
  git push
  ```
- Create a pull request

### Notes
- Always create a new branch for every task, feature, or bug fix.
- Never merge directly to `main` or create branches directly from GitHub.
- Write descriptive commit messages.
