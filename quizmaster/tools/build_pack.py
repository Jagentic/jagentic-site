#!/usr/bin/env python3
import json, os, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(ROOT, ".."))
PRIMARY_OUT = os.path.join(PROJECT_ROOT, "content", "compiled")
WEB_OUT = os.path.join(PROJECT_ROOT, "web", "content", "compiled")

for path in (PRIMARY_OUT, WEB_OUT):
  os.makedirs(path, exist_ok=True)
def merge(mode):
  files = sorted(glob.glob(os.path.join(ROOT, "packs", mode, "*.json")))
  qs=[]
  for fp in files:
    d=json.load(open(fp,"r",encoding="utf-8"))
    if isinstance(d,dict) and "questions" in d: qs+=d["questions"]
    elif isinstance(d,list): qs+=d
  out={"pack_id":f"{mode}-compiled","mode":mode,"version":"r1","questions":qs}
  payload = json.dumps(out, ensure_ascii=False, indent=2)
  for target in (PRIMARY_OUT, WEB_OUT):
    with open(os.path.join(target, f"pack.{mode}.json"), "w", encoding="utf-8") as fh:
      fh.write(payload)
  print(f"Wrote {mode}: {len(qs)} questions → {PRIMARY_OUT} & {WEB_OUT}")
for m in ("biz","buzz"): merge(m)
