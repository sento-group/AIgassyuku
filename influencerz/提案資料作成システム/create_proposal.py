"""
提案資料作成スクリプト
キャプテンズグループ様向け提案資料を作成
"""
from proposal_generator import ProposalGenerator

def create_captains_group_proposal():
    """キャプテンズグループ様向け提案資料を作成"""
    generator = ProposalGenerator()
    
    # クライアント情報
    client_info = generator.analyze_client(
        client_name="キャプテンズグループ",
        client_url="https://www.captains-g.co.jp/",
        instagram_url="https://www.instagram.com/captain_yoshiji/",
        notes="高江洲様の個人アカウントで現在発信している。インスタグラムに興味あり。"
    )
    
    # 提案資料を生成
    proposal = generator.generate_proposal_content(client_info)
    
    # キャプテンズグループ特有の情報を追加
    proposal["sections"]["1_アカウント方向性"] = {
        "コンセプト": "キャプテンズグループのホテル・リゾートの魅力を伝え、観光客への訴求を強化",
        "ターゲット": "リゾートホテルを検討している20-50代の男女、特に家族連れやカップル",
        "トーン": "親しみやすく、リゾートの魅力と楽しさを伝える",
        "現在の状況": "高江洲様の個人アカウント（@captain_yoshiji）で発信中。法人アカウントへの移行も検討可能。",
        "推奨戦略": "個人アカウントの良さを活かしつつ、法人としての信頼性も高めるハイブリッド運用"
    }
    
    proposal["sections"]["2_投稿内容"]["投稿タイプ"] = [
        "ホテル・リゾートの施設紹介",
        "客室・アメニティの紹介",
        "レストラン・食事の紹介",
        "アクティビティ・体験の紹介",
        "スタッフ紹介",
        "お客様の声・レビュー",
        "季節のイベント情報",
        "ストーリーズ（日常の様子、リアルタイム情報）"
    ]
    
    proposal["sections"]["3_参考アカウント"]["業種別参考アカウント"] = [
        "同業ホテル・リゾートの成功事例",
        "観光地の公式アカウント",
        "地域密着型のホテルアカウント"
    ]
    
    # 保存
    json_path = generator.save_proposal(proposal, format="json")
    md_path = generator.save_proposal(proposal, format="markdown")
    
    print(f"✓ 提案資料を作成しました:")
    print(f"  JSON: {json_path}")
    print(f"  Markdown: {md_path}")
    
    return proposal

if __name__ == "__main__":
    create_captains_group_proposal()

