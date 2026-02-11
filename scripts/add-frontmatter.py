"""授業セッションのMarkdownファイルにフロントマターを自動付与するスクリプト"""
import os
import re
import glob

SESSIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "授業セッション")

def extract_meta(filename: str) -> dict:
    """ファイル名から日付とタイトルを抽出"""
    name = os.path.splitext(os.path.basename(filename))[0]

    # パターン: YYYYMMDD_タイトル or YYYYMMDD（アンダースコアなし）タイトル
    match = re.match(r"^(\d{4})(\d{2})(\d{2})[_]?(.*)", name)
    if match:
        y, m, d, title = match.groups()
        title = title.replace("_", " ").strip()
        return {
            "title": title or name,
            "date": f"{y}-{m}-{d}",
        }

    return {"title": name.replace("_", " "), "date": ""}

def has_frontmatter(content: str) -> bool:
    return content.strip().startswith("---")

def add_frontmatter(filepath: str):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if has_frontmatter(content):
        print(f"  SKIP (already has frontmatter): {os.path.basename(filepath)}")
        return

    meta = extract_meta(filepath)
    fm_lines = ["---"]
    fm_lines.append(f'title: "{meta["title"]}"')
    if meta["date"]:
        fm_lines.append(f'date: {meta["date"]}')
    fm_lines.append("---")
    fm_lines.append("")

    new_content = "\n".join(fm_lines) + content

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  ADDED: {os.path.basename(filepath)} → {meta['title']}")

def main():
    md_files = sorted(glob.glob(os.path.join(SESSIONS_DIR, "*.md")))
    print(f"Found {len(md_files)} files in 授業セッション/\n")

    for f in md_files:
        add_frontmatter(f)

    # ボツ授業
    botsu_dir = os.path.join(SESSIONS_DIR, "ボツ授業")
    if os.path.isdir(botsu_dir):
        botsu_files = sorted(glob.glob(os.path.join(botsu_dir, "*.md")))
        print(f"\nFound {len(botsu_files)} files in ボツ授業/")
        for f in botsu_files:
            add_frontmatter(f)

    # AI合宿v2
    camp_dir = os.path.join(os.path.dirname(__file__), "..", "AI合宿v2")
    if os.path.isdir(camp_dir):
        camp_files = sorted(glob.glob(os.path.join(camp_dir, "*.md")))
        print(f"\nFound {len(camp_files)} files in AI合宿v2/")
        for f in camp_files:
            meta = extract_meta(f)
            with open(f, "r", encoding="utf-8") as fh:
                content = fh.read()
            if has_frontmatter(content):
                print(f"  SKIP: {os.path.basename(f)}")
                continue
            name = os.path.splitext(os.path.basename(f))[0].replace("_", " ")
            fm = f'---\ntitle: "{name}"\n---\n\n'
            with open(f, "w", encoding="utf-8") as fh:
                fh.write(fm + content)
            print(f"  ADDED: {os.path.basename(f)}")

    print("\nDone!")

if __name__ == "__main__":
    main()
