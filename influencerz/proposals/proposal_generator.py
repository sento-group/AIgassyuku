"""
提案資料作成システム
既存の提案資料をテンプレートとして使用し、新しいクライアント向け提案資料を生成
"""
import os
import json
from datetime import datetime
from typing import Dict, Optional
import re

class ProposalGenerator:
    def __init__(self, template_dir: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if template_dir is None:
            template_dir = os.path.join(base_dir, "資料", "01_提案資料")
        self.template_dir = template_dir
        self.proposals_dir = template_dir
        self.output_dir = template_dir
        os.makedirs(self.output_dir, exist_ok=True)
        
    def analyze_client(self, client_name: str, client_url: str = "", 
                      instagram_url: str = "", notes: str = "") -> Dict:
        """
        クライアント情報を分析して提案に必要な情報を抽出
        """
        client_info = {
            "client_name": client_name,
            "client_url": client_url,
            "instagram_url": instagram_url,
            "notes": notes,
            "analyzed_at": datetime.now().isoformat()
        }
        
        # URLからドメイン情報を抽出
        if client_url:
            client_info["domain"] = self._extract_domain(client_url)
        
        return client_info
    
    def generate_proposal_content(self, client_info: Dict, 
                                  template_client: Optional[str] = None) -> Dict:
        """
        提案資料の内容を生成
        """
        # 既存の提案資料を分析してテンプレート構造を取得
        template_structure = self._get_template_structure(template_client)
        
        proposal = {
            "client_name": client_info["client_name"],
            "created_at": datetime.now().strftime("%Y年%m月%d日"),
            "sections": {
                "1_アカウント方向性": self._generate_account_direction(client_info),
                "2_投稿内容": self._generate_content_plan(client_info),
                "3_参考アカウント": self._generate_reference_accounts(client_info),
                "4_運用プラン": self._generate_operation_plan(client_info),
                "5_費用": {
                    "基本料金": "270,000円（税抜）",
                    "備考": "SNS運用サービス"
                }
            },
            "client_info": client_info
        }
        
        return proposal
    
    def _generate_account_direction(self, client_info: Dict) -> Dict:
        """アカウントの方向性を生成"""
        client_name = client_info.get("client_name", "")
        
        # クライアント名から業種を推測
        industry_keywords = {
            "観光": ["観光", "ツーリズム", "リゾート", "ホテル", "旅"],
            "飲食": ["レストラン", "カフェ", "飲食", "グルメ"],
            "地方創生": ["地方", "創生", "地域", "村", "町"],
            "ホテル": ["ホテル", "ホテルズ", "リゾート"]
        }
        
        industry = "その他"
        for key, keywords in industry_keywords.items():
            if any(kw in client_name for kw in keywords):
                industry = key
                break
        
        directions = {
            "観光": {
                "コンセプト": f"{client_name}の魅力を発信し、観光客への訴求を強化",
                "ターゲット": "観光を検討している20-50代の男女",
                "トーン": "親しみやすく、地域の魅力を伝える"
            },
            "飲食": {
                "コンセプト": f"{client_name}の美味しさと雰囲気を伝える",
                "ターゲット": "グルメに興味のある20-40代",
                "トーン": "食欲をそそる、温かみのある"
            },
            "地方創生": {
                "コンセプト": f"{client_name}の地域資源と魅力を発信",
                "ターゲット": "移住・二拠点生活に関心のある30-50代",
                "トーン": "真摯で、地域への愛情が伝わる"
            },
            "その他": {
                "コンセプト": f"{client_name}の価値を伝える",
                "ターゲット": "一般的なSNSユーザー",
                "トーン": "親しみやすく、信頼感のある"
            }
        }
        
        return directions.get(industry, directions["その他"])
    
    def _generate_content_plan(self, client_info: Dict) -> Dict:
        """投稿内容プランを生成"""
        return {
            "投稿頻度": "週3-5回",
            "投稿タイプ": [
                "商品・サービス紹介",
                "スタッフ紹介",
                "お客様の声",
                "地域情報",
                "季節の話題",
                "ストーリーズ（日常の様子）"
            ],
            "ハッシュタグ戦略": "業種・地域・キーワードを組み合わせたハッシュタグを使用",
            "エンゲージメント向上": "質問形式の投稿、投票機能、リール動画の活用"
        }
    
    def _generate_reference_accounts(self, client_info: Dict) -> Dict:
        """参考アカウントを提案"""
        return {
            "業種別参考アカウント": [
                "同業他社の成功事例",
                "類似サービス提供企業",
                "地域密着型のアカウント"
            ],
            "参考ポイント": [
                "投稿頻度とタイミング",
                "コンテンツの構成",
                "エンゲージメント率",
                "ストーリーズの活用方法"
            ]
        }
    
    def _generate_operation_plan(self, client_info: Dict) -> Dict:
        """運用プランを生成"""
        return {
            "運用期間": "3ヶ月間（延長可能）",
            "サービス内容": [
                "アカウント運用戦略の策定",
                "投稿コンテンツの作成",
                "投稿スケジュール管理",
                "エンゲージメント分析",
                "月次レポート提供"
            ],
            "成果指標": [
                "フォロワー数増加",
                "エンゲージメント率向上",
                "リーチ数拡大",
                "コンバージョン率改善"
            ]
        }
    
    def _get_template_structure(self, template_client: Optional[str] = None) -> Dict:
        """既存の提案資料の構造を分析"""
        # 実際の実装では、PDFを解析してテンプレート構造を抽出
        # 現在は基本的な構造を返す
        return {
            "sections": [
                "アカウント方向性",
                "投稿内容",
                "参考アカウント",
                "運用プラン",
                "費用"
            ]
        }
    
    def _extract_domain(self, url: str) -> str:
        """URLからドメインを抽出"""
        match = re.search(r'https?://([^/]+)', url)
        return match.group(1) if match else ""
    
    def save_proposal(self, proposal: Dict, format: str = "json") -> str:
        """提案資料を保存"""
        client_name = proposal["client_name"]
        safe_name = re.sub(r'[^\w\s-]', '', client_name).strip()
        
        if format == "json":
            filename = f"【{safe_name}】提案資料_{datetime.now().strftime('%Y%m%d')}.json"
            filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(proposal, f, ensure_ascii=False, indent=2)
            
            return filepath
        elif format == "markdown":
            filename = f"【{safe_name}】提案資料_{datetime.now().strftime('%Y%m%d')}.md"
            filepath = os.path.join(self.output_dir, filename)
            
            content = self._proposal_to_markdown(proposal)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return filepath
    
    def _proposal_to_markdown(self, proposal: Dict) -> str:
        """提案をMarkdown形式に変換"""
        md = f"# {proposal['client_name']} 様向け SNS運用提案資料\n\n"
        md += f"作成日: {proposal['created_at']}\n\n"
        
        sections = proposal['sections']
        
        # アカウント方向性
        md += "## 1. アカウント方向性\n\n"
        direction = sections['1_アカウント方向性']
        md += f"- **コンセプト**: {direction['コンセプト']}\n"
        md += f"- **ターゲット**: {direction['ターゲット']}\n"
        md += f"- **トーン**: {direction['トーン']}\n"
        if '現在の状況' in direction:
            md += f"- **現在の状況**: {direction['現在の状況']}\n"
        if '推奨戦略' in direction:
            md += f"- **推奨戦略**: {direction['推奨戦略']}\n"
        md += "\n"
        
        # 投稿内容
        md += "## 2. 投稿内容\n\n"
        content = sections['2_投稿内容']
        md += f"- **投稿頻度**: {content['投稿頻度']}\n"
        md += "- **投稿タイプ**:\n"
        for post_type in content['投稿タイプ']:
            md += f"  - {post_type}\n"
        md += f"- **ハッシュタグ戦略**: {content['ハッシュタグ戦略']}\n"
        md += f"- **エンゲージメント向上**: {content['エンゲージメント向上']}\n\n"
        
        # 参考アカウント
        md += "## 3. 参考アカウント\n\n"
        ref = sections['3_参考アカウント']
        md += "- **業種別参考アカウント**:\n"
        for account in ref['業種別参考アカウント']:
            md += f"  - {account}\n"
        md += "- **参考ポイント**:\n"
        for point in ref['参考ポイント']:
            md += f"  - {point}\n"
        md += "\n"
        
        # 運用プラン
        md += "## 4. 運用プラン\n\n"
        plan = sections['4_運用プラン']
        md += f"- **運用期間**: {plan['運用期間']}\n"
        md += "- **サービス内容**:\n"
        for service in plan['サービス内容']:
            md += f"  - {service}\n"
        md += "- **成果指標**:\n"
        for metric in plan['成果指標']:
            md += f"  - {metric}\n"
        md += "\n"
        
        # 費用
        md += "## 5. 費用\n\n"
        fee = sections['5_費用']
        md += f"- **基本料金**: {fee['基本料金']}\n"
        md += f"- **備考**: {fee['備考']}\n\n"
        
        # クライアント情報
        md += "---\n\n"
        md += "## クライアント情報\n\n"
        client_info = proposal['client_info']
        if client_info.get('client_url'):
            md += f"- **企業URL**: {client_info['client_url']}\n"
        if client_info.get('instagram_url'):
            md += f"- **Instagram**: {client_info['instagram_url']}\n"
        if client_info.get('notes'):
            md += f"- **備考**: {client_info['notes']}\n"
        
        return md

