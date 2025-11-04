"""
支社長データベース管理システム
47都道府県の支社長情報を管理
"""
import sqlite3
import json
from datetime import datetime
from typing import Optional, Dict, List
import os

class BranchManagerDB:
    def __init__(self, db_path: str = "branch_managers.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """データベースの初期化"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS branch_managers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prefecture TEXT NOT NULL UNIQUE,
                prefecture_code INTEGER NOT NULL UNIQUE,
                name TEXT NOT NULL,
                experience TEXT,
                background TEXT,
                achievements TEXT,
                contact_email TEXT,
                contact_phone TEXT,
                notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ''')
        
        # 都道府県マスタデータの初期化
        self._init_prefectures(cursor)
        
        conn.commit()
        conn.close()
    
    def _init_prefectures(self, cursor):
        """47都道府県のマスタデータを初期化"""
        prefectures = [
            (1, "北海道"), (2, "青森県"), (3, "岩手県"), (4, "宮城県"), (5, "秋田県"),
            (6, "山形県"), (7, "福島県"), (8, "茨城県"), (9, "栃木県"), (10, "群馬県"),
            (11, "埼玉県"), (12, "千葉県"), (13, "東京都"), (14, "神奈川県"), (15, "新潟県"),
            (16, "富山県"), (17, "石川県"), (18, "福井県"), (19, "山梨県"), (20, "長野県"),
            (21, "岐阜県"), (22, "静岡県"), (23, "愛知県"), (24, "三重県"), (25, "滋賀県"),
            (26, "京都府"), (27, "大阪府"), (28, "兵庫県"), (29, "奈良県"), (30, "和歌山県"),
            (31, "鳥取県"), (32, "島根県"), (33, "岡山県"), (34, "広島県"), (35, "山口県"),
            (36, "徳島県"), (37, "香川県"), (38, "愛媛県"), (39, "高知県"), (40, "福岡県"),
            (41, "佐賀県"), (42, "長崎県"), (43, "熊本県"), (44, "大分県"), (45, "宮崎県"),
            (46, "鹿児島県"), (47, "沖縄県")
        ]
        
        now = datetime.now().isoformat()
        for code, name in prefectures:
            cursor.execute('''
                INSERT OR IGNORE INTO branch_managers 
                (prefecture, prefecture_code, name, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, code, "", now, now))
    
    def add_branch_manager(self, prefecture: str, name: str, 
                          experience: str = "", background: str = "",
                          achievements: str = "", contact_email: str = "",
                          contact_phone: str = "", notes: str = "") -> bool:
        """支社長情報を追加・更新"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        # 都道府県コードを取得
        prefecture_code = self._get_prefecture_code(prefecture)
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO branch_managers 
                (prefecture, prefecture_code, name, experience, background, 
                 achievements, contact_email, contact_phone, notes, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
                        COALESCE((SELECT created_at FROM branch_managers WHERE prefecture = ?), ?), ?)
            ''', (prefecture, prefecture_code, name, experience, background,
                  achievements, contact_email, contact_phone, notes,
                  prefecture, now, now))
            
            conn.commit()
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
        finally:
            conn.close()
    
    def get_branch_manager(self, prefecture: str) -> Optional[Dict]:
        """指定都道府県の支社長情報を取得"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM branch_managers WHERE prefecture = ?
        ''', (prefecture,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'id': row[0],
                'prefecture': row[1],
                'prefecture_code': row[2],
                'name': row[3],
                'experience': row[4],
                'background': row[5],
                'achievements': row[6],
                'contact_email': row[7],
                'contact_phone': row[8],
                'notes': row[9],
                'created_at': row[10],
                'updated_at': row[11]
            }
        return None
    
    def get_all_branch_managers(self) -> List[Dict]:
        """全支社長情報を取得"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM branch_managers ORDER BY prefecture_code
        ''')
        
        rows = cursor.fetchall()
        conn.close()
        
        return [{
            'id': row[0],
            'prefecture': row[1],
            'prefecture_code': row[2],
            'name': row[3],
            'experience': row[4] or "",
            'background': row[5] or "",
            'achievements': row[6] or "",
            'contact_email': row[7] or "",
            'contact_phone': row[8] or "",
            'notes': row[9] or "",
            'created_at': row[10],
            'updated_at': row[11]
        } for row in rows]
    
    def _get_prefecture_code(self, prefecture: str) -> int:
        """都道府県名からコードを取得"""
        prefecture_map = {
            "北海道": 1, "青森県": 2, "岩手県": 3, "宮城県": 4, "秋田県": 5,
            "山形県": 6, "福島県": 7, "茨城県": 8, "栃木県": 9, "群馬県": 10,
            "埼玉県": 11, "千葉県": 12, "東京都": 13, "神奈川県": 14, "新潟県": 15,
            "富山県": 16, "石川県": 17, "福井県": 18, "山梨県": 19, "長野県": 20,
            "岐阜県": 21, "静岡県": 22, "愛知県": 23, "三重県": 24, "滋賀県": 25,
            "京都府": 26, "大阪府": 27, "兵庫県": 28, "奈良県": 29, "和歌山県": 30,
            "鳥取県": 31, "島根県": 32, "岡山県": 33, "広島県": 34, "山口県": 35,
            "徳島県": 36, "香川県": 37, "愛媛県": 38, "高知県": 39, "福岡県": 40,
            "佐賀県": 41, "長崎県": 42, "熊本県": 43, "大分県": 44, "宮崎県": 45,
            "鹿児島県": 46, "沖縄県": 47
        }
        return prefecture_map.get(prefecture, 0)
    
    def export_to_json(self, output_path: str = "branch_managers.json"):
        """データをJSON形式でエクスポート"""
        data = self.get_all_branch_managers()
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return output_path

