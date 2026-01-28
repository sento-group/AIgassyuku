"""
支社長データベース管理CLI
"""
import sys
from database import BranchManagerDB

def main():
    db = BranchManagerDB()
    
    if len(sys.argv) < 2:
        print("使用方法:")
        print("  python cli.py add <都道府県> <名前> [その他の情報]")
        print("  python cli.py get <都道府県>")
        print("  python cli.py list")
        print("  python cli.py export")
        return
    
    command = sys.argv[1]
    
    if command == "add":
        if len(sys.argv) < 4:
            print("エラー: 都道府県と名前を指定してください")
            return
        
        prefecture = sys.argv[2]
        name = sys.argv[3]
        
        # その他の情報は入力を受け付ける
        experience = input("経歴: ") if len(sys.argv) <= 4 else sys.argv[4]
        background = input("背景: ") if len(sys.argv) <= 5 else sys.argv[5]
        achievements = input("実績: ") if len(sys.argv) <= 6 else sys.argv[6]
        contact_email = input("メール: ") if len(sys.argv) <= 7 else sys.argv[7]
        contact_phone = input("電話: ") if len(sys.argv) <= 8 else sys.argv[8]
        
        if db.add_branch_manager(prefecture, name, experience, background,
                                achievements, contact_email, contact_phone):
            print(f"✓ {prefecture}の支社長情報を追加しました: {name}")
        else:
            print("エラー: 追加に失敗しました")
    
    elif command == "get":
        if len(sys.argv) < 3:
            print("エラー: 都道府県を指定してください")
            return
        
        prefecture = sys.argv[2]
        manager = db.get_branch_manager(prefecture)
        
        if manager:
            print(f"\n=== {manager['prefecture']} 支社長情報 ===")
            print(f"名前: {manager['name']}")
            print(f"経歴: {manager['experience']}")
            print(f"背景: {manager['background']}")
            print(f"実績: {manager['achievements']}")
            print(f"メール: {manager['contact_email']}")
            print(f"電話: {manager['contact_phone']}")
            print(f"備考: {manager['notes']}")
        else:
            print(f"{prefecture}の支社長情報が見つかりません")
    
    elif command == "list":
        managers = db.get_all_branch_managers()
        print("\n=== 全支社長一覧 ===")
        for m in managers:
            status = "✓" if m['name'] else "未登録"
            print(f"{status} {m['prefecture']}: {m['name'] or '(未登録)'}")
    
    elif command == "export":
        output_path = db.export_to_json()
        print(f"✓ データをエクスポートしました: {output_path}")
    
    else:
        print(f"不明なコマンド: {command}")

if __name__ == "__main__":
    main()

