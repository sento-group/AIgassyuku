"""
SNS情報レポート生成システム
各クライアントのSNS情報を月次でレポート生成
"""
import sqlite3
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os

class SNSReportGenerator:
    def __init__(self, db_path: str = "sns_reports.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """データベースの初期化"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # クライアント情報テーブル
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL UNIQUE,
                company_url TEXT,
                industry TEXT,
                contact_person TEXT,
                contact_email TEXT,
                contact_phone TEXT,
                contract_start_date TEXT,
                contract_end_date TEXT,
                monthly_fee REAL,
                notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ''')
        
        # SNSアカウント情報テーブル
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sns_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                platform TEXT NOT NULL,
                account_name TEXT,
                account_url TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES clients (id)
            )
        ''')
        
        # SNSデータテーブル（月次）
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sns_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id INTEGER NOT NULL,
                report_date TEXT NOT NULL,
                followers INTEGER DEFAULT 0,
                following INTEGER DEFAULT 0,
                posts INTEGER DEFAULT 0,
                engagement_rate REAL DEFAULT 0.0,
                reach INTEGER DEFAULT 0,
                impressions INTEGER DEFAULT 0,
                likes_avg INTEGER DEFAULT 0,
                comments_avg INTEGER DEFAULT 0,
                stories_views INTEGER DEFAULT 0,
                reels_views INTEGER DEFAULT 0,
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (account_id) REFERENCES sns_accounts (id),
                UNIQUE(account_id, report_date)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_client(self, client_name: str, company_url: str = "",
                   industry: str = "", contact_person: str = "",
                   contact_email: str = "", contact_phone: str = "",
                   monthly_fee: float = 0.0, notes: str = "") -> int:
        """クライアントを追加"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO clients 
            (client_name, company_url, industry, contact_person, contact_email,
             contact_phone, monthly_fee, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
                    COALESCE((SELECT created_at FROM clients WHERE client_name = ?), ?), ?)
        ''', (client_name, company_url, industry, contact_person, contact_email,
              contact_phone, monthly_fee, notes, client_name, now, now))
        
        client_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return client_id
    
    def add_sns_account(self, client_id: int, platform: str, 
                       account_name: str = "", account_url: str = "") -> int:
        """SNSアカウントを追加"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO sns_accounts 
            (client_id, platform, account_name, account_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, 
                    COALESCE((SELECT created_at FROM sns_accounts 
                             WHERE client_id = ? AND platform = ?), ?), ?)
        ''', (client_id, platform, account_name, account_url,
              client_id, platform, now, now))
        
        account_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return account_id
    
    def add_sns_data(self, account_id: int, report_date: str,
                    followers: int = 0, following: int = 0, posts: int = 0,
                    engagement_rate: float = 0.0, reach: int = 0,
                    impressions: int = 0, likes_avg: int = 0,
                    comments_avg: int = 0, stories_views: int = 0,
                    reels_views: int = 0, notes: str = ""):
        """SNSデータを追加（月次）"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO sns_data 
            (account_id, report_date, followers, following, posts,
             engagement_rate, reach, impressions, likes_avg, comments_avg,
             stories_views, reels_views, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (account_id, report_date, followers, following, posts,
              engagement_rate, reach, impressions, likes_avg, comments_avg,
              stories_views, reels_views, notes, now))
        
        conn.commit()
        conn.close()
    
    def generate_monthly_report(self, client_name: str, year: int, month: int) -> Dict:
        """月次レポートを生成"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # クライアント情報を取得
        cursor.execute('SELECT * FROM clients WHERE client_name = ?', (client_name,))
        client = cursor.fetchone()
        
        if not client:
            conn.close()
            return {"error": "クライアントが見つかりません"}
        
        client_id = client[0]
        
        # 該当月のデータを取得
        report_date = f"{year}-{month:02d}"
        
        # アカウント情報とデータを取得
        cursor.execute('''
            SELECT a.id, a.platform, a.account_name, a.account_url,
                   d.followers, d.following, d.posts, d.engagement_rate,
                   d.reach, d.impressions, d.likes_avg, d.comments_avg,
                   d.stories_views, d.reels_views, d.notes
            FROM sns_accounts a
            LEFT JOIN sns_data d ON a.id = d.account_id AND d.report_date = ?
            WHERE a.client_id = ?
        ''', (report_date, client_id))
        
        accounts_data = cursor.fetchall()
        
        # 前月のデータを取得（比較用）
        prev_month = month - 1
        prev_year = year
        if prev_month == 0:
            prev_month = 12
            prev_year = year - 1
        
        prev_report_date = f"{prev_year}-{prev_month:02d}"
        
        cursor.execute('''
            SELECT account_id, followers, engagement_rate, reach
            FROM sns_data
            WHERE account_id IN (SELECT id FROM sns_accounts WHERE client_id = ?)
            AND report_date = ?
        ''', (client_id, prev_report_date))
        
        prev_data = {row[0]: row[1:] for row in cursor.fetchall()}
        
        conn.close()
        
        # レポートを構築
        report = {
            "client_name": client_name,
            "report_period": f"{year}年{month}月",
            "generated_at": datetime.now().isoformat(),
            "accounts": []
        }
        
        for acc_data in accounts_data:
            account_id = acc_data[0]
            platform = acc_data[1]
            account_name = acc_data[2]
            account_url = acc_data[3]
            
            account_report = {
                "platform": platform,
                "account_name": account_name,
                "account_url": account_url,
                "metrics": {
                    "followers": acc_data[4] or 0,
                    "following": acc_data[5] or 0,
                    "posts": acc_data[6] or 0,
                    "engagement_rate": acc_data[7] or 0.0,
                    "reach": acc_data[8] or 0,
                    "impressions": acc_data[9] or 0,
                    "likes_avg": acc_data[10] or 0,
                    "comments_avg": acc_data[11] or 0,
                    "stories_views": acc_data[12] or 0,
                    "reels_views": acc_data[13] or 0
                },
                "notes": acc_data[14] or ""
            }
            
            # 前月比較
            if account_id in prev_data:
                prev_followers, prev_engagement, prev_reach = prev_data[account_id]
                account_report["comparison"] = {
                    "followers_change": (acc_data[4] or 0) - (prev_followers or 0),
                    "engagement_change": (acc_data[7] or 0.0) - (prev_engagement or 0.0),
                    "reach_change": (acc_data[8] or 0) - (prev_reach or 0)
                }
            
            report["accounts"].append(account_report)
        
        return report
    
    def save_report(self, report: Dict, output_dir: str = None) -> str:
        """レポートを保存"""
        if output_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            output_dir = os.path.join(base_dir, "資料", "04_月次レポート")
        os.makedirs(output_dir, exist_ok=True)
        
        client_name = report["client_name"]
        safe_name = client_name.replace(" ", "_").replace("/", "_")
        period = report["report_period"].replace("年", "").replace("月", "")
        
        # JSON形式
        json_filename = f"{safe_name}_レポート_{period}.json"
        json_path = os.path.join(output_dir, json_filename)
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        # Markdown形式
        md_filename = f"{safe_name}_レポート_{period}.md"
        md_path = os.path.join(output_dir, md_filename)
        
        md_content = self._report_to_markdown(report)
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        return json_path, md_path
    
    def _report_to_markdown(self, report: Dict) -> str:
        """レポートをMarkdown形式に変換"""
        md = f"# {report['client_name']} SNS運用レポート\n\n"
        md += f"**レポート期間**: {report['report_period']}\n\n"
        md += f"**作成日**: {datetime.fromisoformat(report['generated_at']).strftime('%Y年%m月%d日')}\n\n"
        md += "---\n\n"
        
        for account in report['accounts']:
            md += f"## {account['platform']} アカウント\n\n"
            if account['account_name']:
                md += f"**アカウント名**: {account['account_name']}\n\n"
            if account['account_url']:
                md += f"**URL**: {account['account_url']}\n\n"
            
            metrics = account['metrics']
            md += "### 主要指標\n\n"
            md += f"- **フォロワー数**: {metrics['followers']:,}人\n"
            md += f"- **フォロー中**: {metrics['following']:,}人\n"
            md += f"- **投稿数**: {metrics['posts']:,}件\n"
            md += f"- **エンゲージメント率**: {metrics['engagement_rate']:.2f}%\n"
            md += f"- **リーチ**: {metrics['reach']:,}人\n"
            md += f"- **インプレッション**: {metrics['impressions']:,}回\n"
            md += f"- **平均いいね数**: {metrics['likes_avg']:,}件\n"
            md += f"- **平均コメント数**: {metrics['comments_avg']:,}件\n"
            md += f"- **ストーリーズ視聴数**: {metrics['stories_views']:,}回\n"
            md += f"- **リール視聴数**: {metrics['reels_views']:,}回\n\n"
            
            if 'comparison' in account:
                comp = account['comparison']
                md += "### 前月比較\n\n"
                md += f"- **フォロワー数変化**: {comp['followers_change']:+,}人\n"
                md += f"- **エンゲージメント率変化**: {comp['engagement_change']:+.2f}%\n"
                md += f"- **リーチ変化**: {comp['reach_change']:+,}人\n\n"
            
            if account['notes']:
                md += f"**備考**: {account['notes']}\n\n"
            
            md += "---\n\n"
        
        return md

