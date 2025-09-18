#!/usr/bin/env python3
"""CLI helper to update keys inside COMMUNAL.status.json."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict


def parse_value(raw: str) -> Any:
    """Attempt to coerce the provided string into JSON, fallback to string."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def set_nested(data: Dict[str, Any], dotted_key: str, value: Any) -> None:
    parts = dotted_key.split(".")
    cursor = data
    for part in parts[:-1]:
        if part not in cursor or not isinstance(cursor[part], dict):
            cursor[part] = {}
        cursor = cursor[part]
    cursor[parts[-1]] = value


def main() -> None:
    parser = argparse.ArgumentParser(description="Update COMMUNAL.status.json values")
    parser.add_argument("pairs", nargs="+", help="key=value pairs (dot notation for nested keys)")
    parser.add_argument("--file", default="COMMUNAL.status.json", help="Target status file (relative to repo root)")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    target_path = Path(args.file)
    if not target_path.is_absolute():
        target_path = repo_root / target_path

    if not target_path.exists():
        raise SystemExit(f"Status file not found: {target_path}")

    with target_path.open("r", encoding="utf-8") as fh:
        status = json.load(fh)

    for pair in args.pairs:
        if "=" not in pair:
            raise SystemExit(f"Invalid pair '{pair}'. Use key=value format.")
        key, raw_value = pair.split("=", 1)
        value = parse_value(raw_value)
        set_nested(status, key, value)
        print(f"Set {key} -> {value!r}")

    with target_path.open("w", encoding="utf-8") as fh:
        json.dump(status, fh, indent=2)
        fh.write("\n")

    print(f"Updated {target_path.relative_to(repo_root)}")


if __name__ == "__main__":  # pragma: no cover
    main()
