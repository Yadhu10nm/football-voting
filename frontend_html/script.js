const apiOverride = new URLSearchParams(window.location.search).get('api');
const defaultApiUrl = 'http://127.0.0.1:8000';
let API_BASE = defaultApiUrl;

const totalVotesEl = document.getElementById('totalVotes');
const teamCountEl = document.getElementById('teamCount');
const topTeamEl = document.getElementById('topTeam');
const teamGrid = document.getElementById('teamGrid');
const leaderboardList = document.getElementById('leaderboardList');
const resultsList = document.getElementById('resultsList');
const searchInput = document.getElementById('searchInput');
const refreshButton = document.getElementById('refreshButton');
const toast = document.getElementById('toast');
let teamData = [];

const apiPath = (path) => `${API_BASE}${path}`;

window.__envReady = window.__envReady || Promise.resolve();

async function init() {
  await window.__envReady;
  const envApiUrl = window.__ENV?.API_BASE || defaultApiUrl;
  API_BASE = apiOverride || envApiUrl;
  await loadData();
}

async function fetchJson(path, options = {}) {
  const response = await fetch(apiPath(path), options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  toast.classList.remove('hidden');

  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove('visible');
    toast.classList.add('hidden');
  }, 2600);
}

function buildTeamCard(team) {
  const card = document.createElement('div');
  card.className = 'team-card';

  card.innerHTML = `
    <div class="team-meta">
      <div>
        <h3>${team.team}</h3>
        <p>${team.votes} votes</p>
      </div>
    </div>
    <button type="button">Vote</button>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => voteForTeam(team.team, button));

  return card;
}

function buildLeaderboardCard(item, rank) {
  const card = document.createElement('div');
  card.className = 'leader-card';
  card.innerHTML = `
    <div class="leader-meta">
      <div>
        <h3>#${rank} ${item.team}</h3>
        <p>${item.votes} votes</p>
      </div>
      <span>${item.percentage.toFixed(1)}%</span>
    </div>
  `;
  return card;
}

function buildResultCard(item) {
  const card = document.createElement('div');
  card.className = 'result-card';
  const percentage = item.percentage ?? 0;

  card.innerHTML = `
    <div class="result-meta">
      <h3>${item.team}</h3>
      <span>${percentage.toFixed(1)}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>
  `;
  return card;
}

async function voteForTeam(teamName, button) {
  button.disabled = true;
  button.textContent = 'Submitting...';

  try {
    await fetchJson('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team: teamName }),
    });

    showToast(`Vote recorded for ${teamName}`);
    await loadData();
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = 'Vote';
  }
}

function renderTeams(teams) {
  teamData = teams;
  teamGrid.innerHTML = '';

  if (!teams.length) {
    teamGrid.innerHTML = '<p class="status-label">No teams found.</p>';
    return;
  }

  const filterText = searchInput.value.trim().toLowerCase();
  let filtered = teams.filter((team) => team.team.toLowerCase().includes(filterText));

  if (!filtered.length) {
    teamGrid.innerHTML = '<p class="status-label">No teams match that search.</p>';
    return;
  }

  if (!filterText) {
    filtered = filtered.slice(0, 5);
  }

  filtered.forEach((team) => teamGrid.appendChild(buildTeamCard(team)));
}

function renderLeaderboard(leaderboard) {
  leaderboardList.innerHTML = '';
  if (!leaderboard.length) {
    leaderboardList.innerHTML = '<p class="status-label">Leaderboard data is unavailable.</p>';
    return;
  }

  leaderboard.slice(0, 6).forEach((item, index) => leaderboardList.appendChild(buildLeaderboardCard(item, index + 1)));
}

function renderResults(results) {
  resultsList.innerHTML = '';
  if (!results.length) {
    resultsList.innerHTML = '<p class="status-label">No results yet.</p>';
    return;
  }

  results.slice(0, 8).forEach((item) => resultsList.appendChild(buildResultCard(item)));
}

function renderStats(stats) {
  totalVotesEl.textContent = stats.total_votes?.toString() || '0';
  teamCountEl.textContent = stats.total_teams?.toString() || '0';
  topTeamEl.textContent = stats.highest_voted_team?.team || 'TBD';
}

async function loadData() {
  try {
    const [teams, results, leaderboard, stats] = await Promise.all([
      fetchJson('/api/teams'),
      fetchJson('/api/results'),
      fetchJson('/api/leaderboard'),
      fetchJson('/api/stats'),
    ]);

    renderTeams(teams);
    renderResults(results.teams || results);
    renderLeaderboard(leaderboard);
    renderStats(stats);
  } catch (error) {
    teamGrid.innerHTML = `<p class="status-label">Unable to load data: ${error.message}</p>`;
    leaderboardList.innerHTML = '';
    resultsList.innerHTML = '';
    showToast('Unable to connect to backend API');
  }
}

searchInput.addEventListener('input', () => {
  renderTeams(teamData);
});

refreshButton.addEventListener('click', loadData);

init();
