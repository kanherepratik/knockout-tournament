import './scss/main.scss';
import teams from './data/teams';

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});
const TEAMS = 'teams';
const TOURNAMENT_WINNER = 'tournamentWinner';
let currentRound = 0;
let numberOfRounds = null;

const prepareTeamStats = () => {
  const teamStats = [];
  teams.forEach(team => {
    const teamData = {
      teamId: team.teamId,
      abbreviation: team.abbreviation,
      teamName: team.teamName,
      round: 0
    };
    teamStats.push(teamData);
  });
  numberOfRounds = Math.log2(teamStats.length);
  localStorage.setItem(TEAMS, JSON.stringify(teamStats));
};

const updateTeamStats = gameWinner => {
  const teamStats = JSON.parse(localStorage.getItem(TEAMS));
  const gameWinnerIndex = teamStats.findIndex(
    team => team.teamId === gameWinner.teamId
  );
  teamStats[gameWinnerIndex] = {
    ...teamStats[gameWinnerIndex],
    round: teamStats[gameWinnerIndex].round + 1
  };

  localStorage.setItem(TEAMS, JSON.stringify(teamStats));
};

const startGame = (team1, team2) => {
  const winnerTeam = Math.random() < 0.5 ? team1 : team2;
  updateTeamStats(winnerTeam);
};

const startRound = async currentRoundTeams => {
  for (let i = 0; i < currentRoundTeams.length; i = i + 2) {
    startGame(currentRoundTeams[i], currentRoundTeams[i + 1]);

    if (i + 2 === currentRoundTeams.length) {
      currentRound++;
    }
  }
};

const init = () => {
  localStorage.setItem(TOURNAMENT_WINNER, null);
  prepareTeamStats();

  for (let i = 0; i <= numberOfRounds; i++) {
    const teamStats = JSON.parse(localStorage.getItem(TEAMS));
    const currentRoundTeams = currentRound
      ? teamStats.filter(team => {
          return team.round === currentRound;
        })
      : teamStats;
    if (currentRoundTeams.length > 1) {
      startRound(currentRoundTeams);
    } else {
      localStorage.setItem(
        TOURNAMENT_WINNER,
        JSON.stringify(currentRoundTeams[0])
      );
      const winner = JSON.parse(localStorage.getItem(TOURNAMENT_WINNER));
      alert(`winner is ${winner.teamName}`);
    }
    console.log('currentRoundTeams', currentRoundTeams);
  }
};
