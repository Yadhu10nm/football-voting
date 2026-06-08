import os
import sqlite3
from typing import List, Dict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, os.getenv('DATABASE_URL', 'football.db'))

TEAMS =  [
    "Canada",
    "Mexico",
    "United States",
    "Japan",
    "New Zealand",
    "Iran",
    "Argentina",
    "Uzbekistan",
    "Jordan",
    "South Korea",
    "Australia",
    "Brazil",
    "Ecuador",
    "Paraguay",
    "Uruguay",
    "Colombia",
    "Morocco",
    "Tunisia",
    "Egypt",
    "Algeria",
    "Ghana",
    "Cape Verde",
    "Qatar",
    "Saudi Arabia",
    "Senegal",
    "South Africa",
    "Ivory Coast",
    "England",
    "France",
    "Croatia",
    "Portugal",
    "Norway",
    "Germany",
    "Netherlands",
    "Switzerland",
    "Scotland",
    "Spain",
    "Austria",
    "Belgium",
    "Panama",
    "Curaçao",
    "Haiti",
    "Bosnia and Herzegovina",
    "Sweden",
    "Turkey",
    "Czech Republic",
    "DR Congo",
    "Iraq"
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_name TEXT UNIQUE,
            votes INTEGER DEFAULT 0
        );
        '''
    )

    for team in TEAMS:
        cursor.execute(
            'INSERT OR IGNORE INTO teams (team_name, votes) VALUES (?, 0)',
            (team,),
        )

    conn.commit()
    conn.close()


def fetch_teams() -> List[Dict]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT team_name AS team, votes FROM teams ORDER BY team_name ASC')
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows


def fetch_leaderboard() -> List[Dict]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT team_name AS team, votes FROM teams ORDER BY votes DESC, team_name ASC')
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows


def fetch_total_votes() -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT SUM(votes) AS total FROM teams')
    result = cursor.fetchone()
    conn.close()
    return int(result['total'] or 0)


def record_vote(team: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT votes FROM teams WHERE team_name = ?', (team,))
    row = cursor.fetchone()
    if row is None:
        conn.close()
        return False

    cursor.execute('UPDATE teams SET votes = votes + 1 WHERE team_name = ?', (team,))
    conn.commit()
    conn.close()
    return True
