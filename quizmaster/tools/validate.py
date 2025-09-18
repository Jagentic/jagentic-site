#!/usr/bin/env python3
import json, sys, os, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
def load(p): return json.load(open(p, "r", encoding="utf-8"))
def vq(q):
  for k in ("id","type","category","difficulty","question","choices","answer_index"):
    if k not in q: raise ValueError(f"Question missing {k}")
  if q["type"] not in ("mcq","picture_mcq"): raise ValueError("type invalid")
  if q["difficulty"] not in ("easy","medium","hard"): raise ValueError("difficulty invalid")
  if not isinstance(q["choices"], list) or len(q["choices"])!=4: raise ValueError("choices must be 4")
  if not (0 <= int(q["answer_index"]) <= 3): raise ValueError("answer_index out of range")
  if q["type"]=="picture_mcq":
    if "image" not in q or "alt" not in q: raise ValueError("picture_mcq requires image and alt")
    if not q["image"].startswith("/assets/people/"): raise ValueError("image must be under /assets/people/")
    if q["alt"] != "Portrait photo.": raise ValueError("alt must be 'Portrait photo.'")
def vp(p):
  d = load(p)
  for k in ("pack_id","mode","version","questions"):
    if k not in d: raise ValueError(f"Pack missing {k} in {p}")
  if d["mode"] not in ("biz","buzz"): raise ValueError("mode invalid")
  for i,q in enumerate(d["questions"]):
    try: vq(q)
    except Exception as e: raise ValueError(f"{p} q[{i}]: {e}")
  print(f"OK: {p}")
def main():
  ps = [p for p in glob.glob(os.path.join(ROOT, "packs", "*", "*.json"))
        if os.path.basename(p) != "people_photo_index.json"]
  if not ps:
    print("No packs found.", file=sys.stderr); sys.exit(2)
  bad=0
  for p in ps:
    try: vp(p)
    except Exception as e: print("ERROR:", e, file=sys.stderr); bad+=1
  sys.exit(1 if bad else 0)
if __name__=="__main__": main()
