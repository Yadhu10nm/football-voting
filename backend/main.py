import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db, fetch_teams, fetch_leaderboard, fetch_total_votes, record_vote, TEAMS

app = FastAPI(
    title='FIFA World Cup 2026 Prediction API',
    description='Backend API for vote tracking, results, leaderboard and stats.',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class VoteRequest(BaseModel):
    team: str


@app.on_event('startup')
async def startup_event():
    init_db()


@app.get('/api/teams')
async def get_teams():
    teams = fetch_teams()
    return teams


@app.post('/api/vote')
async def vote_team(payload: VoteRequest):
    if not payload.team:
        raise HTTPException(status_code=400, detail='Team name is required.')

    success = record_vote(payload.team)
    if not success:
        raise HTTPException(status_code=404, detail='Team not found.')

    return {'success': True, 'team': payload.team}


@app.get('/api/results')
async def get_results():
    leaderboard = fetch_leaderboard()
    total_votes = fetch_total_votes()
    teams = []

    for item in leaderboard:
        votes = item['votes']
        pct = round((votes / total_votes) * 100, 1) if total_votes else 0.0
        teams.append({'team': item['team'], 'votes': votes, 'percentage': pct})

    return {'total_votes': total_votes, 'teams': teams}


@app.get('/api/leaderboard')
async def get_leaderboard():
    leaderboard = fetch_leaderboard()
    total_votes = fetch_total_votes()
    return [
        {
            'team': team['team'],
            'votes': team['votes'],
            'percentage': round((team['votes'] / total_votes) * 100, 1) if total_votes else 0.0,
        }
        for team in leaderboard
    ]


@app.get('/api/stats')
async def get_stats():
    leaderboard = fetch_leaderboard()
    total_votes = fetch_total_votes()
    highest = leaderboard[0] if leaderboard else {'team': None, 'votes': 0}

    percentages = [
        {
            'team': team['team'],
            'votes': team['votes'],
            'percentage': round((team['votes'] / total_votes) * 100, 1) if total_votes else 0.0,
        }
        for team in leaderboard
    ]

    return {
        'total_votes': total_votes,
        'total_teams': len(TEAMS),
        'highest_voted_team': highest,
        'percentages': percentages,
    }
