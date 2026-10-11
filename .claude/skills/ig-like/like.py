#!/usr/bin/env python3
"""Build and send official Instagram Like API requests."""

import argparse
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.parse import urlencode
from urllib.request import Request, urlopen


GRAPH_VERSION = "v25.0"
GRAPH_ROOT = "https://graph.instagram.com"


def build_request(action, ig_user_id, media_id=None, comment_id=None):
    """Return an API request description without credentials or side effects."""
    if action not in {"like", "unlike"}:
        raise ValueError("action must be like or unlike")
    if bool(media_id) == bool(comment_id):
        raise ValueError("provide exactly one of media_id or comment_id")
    if not ig_user_id:
        raise ValueError("ig_user_id is required")

    method = "POST" if action == "like" else "DELETE"
    url = f"{GRAPH_ROOT}/{GRAPH_VERSION}/{quote(str(ig_user_id), safe='')}/likes"
    form = {"media_id": str(media_id)} if media_id else {"comment_id": str(comment_id)}
    return method, url, form


def send_request(method, url, form, access_token):
    """Perform the credentialed HTTP request without printing secrets."""
    payload = dict(form)
    payload["access_token"] = access_token
    request = Request(
        url,
        data=urlencode(payload).encode("utf-8"),
        method=method,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        raise RuntimeError(f"Instagram API returned HTTP {error.code}") from None
    except URLError:
        raise RuntimeError("Instagram API request failed") from None


def run_action(
    action,
    ig_user_id,
    *,
    media_id=None,
    comment_id=None,
    execute=False,
    assume_yes=False,
    input_fn=input,
    transport=send_request,
    environ=None,
    output_fn=print,
):
    """Preview or execute a like action, with a human approval gate."""
    environ = os.environ if environ is None else environ
    method, url, form = build_request(action, ig_user_id, media_id, comment_id)
    target_type, target_id = next(iter(form.items()))

    if not execute:
        output_fn(f"DRY RUN: {method} {url} for {target_type}={target_id}")
        output_fn("Nothing was sent. Add --execute to continue.")
        return 0

    access_token = environ.get("INSTAGRAM_ACCESS_TOKEN", "")
    if not access_token:
        output_fn("INSTAGRAM_ACCESS_TOKEN is required for --execute.")
        return 2

    expected = action.upper()
    if not assume_yes:
        answer = input_fn(f"Type {expected} to confirm this action: ").strip()
        if answer != expected:
            output_fn("Cancelled. Nothing was sent.")
            return 2

    try:
        result = transport(method, url, form, access_token)
    except RuntimeError as error:
        output_fn(f"Request failed: {error}")
        return 1

    output_fn(f"Instagram API accepted {action}: {json.dumps(result, ensure_ascii=False)}")
    return 0


def make_parser():
    parser = argparse.ArgumentParser(
        description="Like or unlike Instagram media/comments through the official API."
    )
    parser.add_argument("action", choices=("like", "unlike"))
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("--media-id")
    target.add_argument("--comment-id")
    parser.add_argument(
        "--user-id",
        help="Instagram user id; defaults to INSTAGRAM_USER_ID",
    )
    parser.add_argument("--execute", action="store_true", help="send the request")
    parser.add_argument("--yes", action="store_true", help="skip the typed confirmation")
    return parser


def main(argv=None):
    args = make_parser().parse_args(argv)
    ig_user_id = args.user_id or os.environ.get("INSTAGRAM_USER_ID", "")
    try:
        return run_action(
            args.action,
            ig_user_id,
            media_id=args.media_id,
            comment_id=args.comment_id,
            execute=args.execute,
            assume_yes=args.yes,
        )
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
