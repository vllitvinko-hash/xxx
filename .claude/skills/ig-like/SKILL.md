---
name: ig-like
description: >-
  Like or unlike Instagram media and comments through Meta's official
  Instagram API. Use when the user explicitly asks to like or unlike a post,
  Reel, comment, or reply on their behalf and can provide the target ID.
---

# ig-like

This skill is the one intentionally narrow write action in the pack. It uses
Meta's official Instagram API, never browser automation, cookies, passwords,
or a private endpoint.

## Requirements

- A professional Instagram account connected to a Meta developer app.
- An access token with `instagram_manage_engagement`.
- `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID` in the local environment.
- A media ID or comment ID. Feed posts, Reels, comments, and replies are
  supported by the API; Stories and private-account targets are not.

Never paste or print the token. If credentials are missing, explain which
environment variable is required without asking the user to send its value in
chat.

## Approval flow

1. Resolve exactly one target: `--media-id` or `--comment-id`.
2. Show the dry-run command first.
3. State whether the action is a like or unlike and name the target ID.
4. Ask for explicit approval before running with `--execute`.
5. Do not add `--yes` unless the user explicitly asked to execute the action
   and the approval is already present in the same request.

Preview a like:

```bash
python3 skills/ig-like/like.py like --media-id MEDIA_ID
```

Execute after approval:

```bash
python3 skills/ig-like/like.py like --media-id MEDIA_ID --execute
```

Unlike a comment:

```bash
python3 skills/ig-like/like.py unlike --comment-id COMMENT_ID --execute
```

The command asks the human to type `LIKE` or `UNLIKE` before it sends
anything. Dry-run is the default. The `--yes` flag exists for already-approved
agent runs, but it must never be inferred from a vague request.

## Limits

This skill does not discover IDs, log into Instagram, scrape feeds, or bypass
Meta permissions and rate limits. If the official API rejects the account or
target, report the sanitized error and stop. Never fall back to browser
automation or an unofficial API.
