import './scss/main.scss';
import teams from './data/teams';

window.onload = () => {
  init();
};
let currentRound = 0;
const numberOfRounds = Math.log2(teams.length);

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
  localStorage.setItem('teams', JSON.stringify(teamStats));
};

const updateTeamStats = (winner, looser) => {
  const teamStats = JSON.parse(localStorage.getItem('teams'));
  const winnerIndex = teamStats.findIndex(
    team => team.teamId === winner.teamId
  );
  const looserIndex = teamStats.findIndex(
    team => team.teamId === looser.teamId
  );
  teamStats[winnerIndex] = {
    ...teamStats[winnerIndex],
    round: teamStats[winnerIndex].round + 1
  };
  teamStats[looserIndex] = {
    ...teamStats[looserIndex]
  };

  localStorage.setItem('teams', JSON.stringify(teamStats));
};

const startGame = (team1, team2) => {
  const winnerTeam = Math.random() < 0.5 ? team1 : team2;

  winnerTeam === team1
    ? updateTeamStats(winnerTeam, team2)
    : updateTeamStats(winnerTeam, team1);
};

const startRound = currentRoundTeams => {
  for (let i = 0; i < currentRoundTeams.length; i = i + 2) {
    startGame(currentRoundTeams[i], currentRoundTeams[i + 1]);
  }
  currentRound++;
};

const init = () => {
  localStorage.setItem('tournamentWinner', null);

  prepareTeamStats();

  for (let i = 0; i <= numberOfRounds; i++) {
    const teamStats = JSON.parse(localStorage.getItem('teams'));
    const currentRoundTeams = currentRound
      ? teamStats.filter(team => {
          return team.round === currentRound;
        })
      : teamStats;
    if (currentRoundTeams.length > 1) {
      startRound(currentRoundTeams);
    } else {
      localStorage.setItem(
        'tournamentWinner',
        JSON.stringify(currentRoundTeams[0])
      );
      const winner = JSON.parse(localStorage.getItem('tournamentWinner'));
      alert(`winner is ${winner.teamName}`);
    }
    console.log('currentRoundTeams', currentRoundTeams);
  }
};
