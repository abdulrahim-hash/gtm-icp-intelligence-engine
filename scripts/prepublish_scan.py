from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
skip = {".git","private","__pycache__"}
exts = {".md",".txt",".json",".js",".ts",".py",".sql",".yml",".yaml",".toml",".env"}

patterns = [
    ("real-email", re.compile(r"\b[A-Z0-9._%+-]+@(?!example\.com\b|saray\.invalid\b)[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)),
    ("supabase-project-ref", re.compile(r"\b[a-z0-9]{20}\.supabase\.co\b", re.I)),
    ("bearer-token", re.compile(r"\bBearer\s+[A-Za-z0-9._\-]{20,}", re.I)),
    ("api-key-assignment", re.compile(r"(api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]{12,}['\"]", re.I)),
]

hits=[]
for p in root.rglob("*"):
    if not p.is_file() or any(part in skip for part in p.parts) or p.suffix.lower() not in exts:
        continue
    txt=p.read_text(encoding="utf-8",errors="ignore")
    for label,pat in patterns:
        for m in pat.finditer(txt):
            hits.append((label,str(p),m.group(0)[:120]))

if hits:
    print("Potential secrets / identifiers found:")
    for label,path,preview in hits:
        print(f"- [{label}] {path}: {preview}")
    raise SystemExit(1)

print("Pre-publish scan passed.")
