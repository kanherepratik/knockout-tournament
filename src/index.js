import "./scss/main.scss";
import teams from "./data/teams";
import StorageUtil from "./utils/StorageUtil";

document.addEventListener("DOMContentLoaded", function(event) {
  init();
  document.getElementById("startBtn").addEventListener("click", () => {
    roundExecutor(currentRound); // first round
    document.getElementById("startBtn").className = "hidden";
  });
});
const TEAMS = "teams";
const TOURNAMENT_WINNER = "tournamentWinner";
let currentRound = 0;
let numberOfRounds = null;
let defaultWidth = "100";

const renderCurrentRoundTeams = currentRoundTeams => {
  const roundDiv = document.createElement("div");
  roundDiv.className = "round-cnt flex-hbox";
  if (currentRound && currentRoundTeams.length !== 1) {
    defaultWidth = defaultWidth / 2;
    roundDiv.setAttribute("style", `width: ${defaultWidth}%; margin: 0 auto`);
  }

  for (let i = 0; i < currentRoundTeams.length; i = i + 2) {
    const matchDiv = document.createElement("div");
    const matchSpan = document.createElement("span");
    if (currentRoundTeams.length === 1) {
      roundDiv.className = "round-cnt flex-hbox winner";
      matchSpan.innerHTML = `Winner is: ${currentRoundTeams[i].abbreviation}`;
    } else {
      matchSpan.innerHTML = `${currentRoundTeams[i].abbreviation} vs ${
        currentRoundTeams[i + 1].abbreviation
      }`;
    }
    matchDiv.appendChild(matchSpan);
    roundDiv.appendChild(matchDiv);
  }
  document.getElementById("matchArea").appendChild(roundDiv);
};

const shuffleTeams = teamStats => {
  for (let i = teamStats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teamStats[i], teamStats[j]] = [teamStats[j], teamStats[i]];
  }
  StorageUtil.setLocalStorage(TEAMS, teamStats);
};
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
  shuffleTeams(teamStats);
  numberOfRounds = Math.log2(teamStats.length);
};

const updateTeamStats = gameWinner => {
  const teamStats = StorageUtil.getLocalStorage(TEAMS);
  const gameWinnerIndex = teamStats.findIndex(
    team => team.teamId === gameWinner.teamId
  );
  teamStats[gameWinnerIndex] = {
    ...teamStats[gameWinnerIndex],
    round: teamStats[gameWinnerIndex].round + 1
  };

  StorageUtil.setLocalStorage(TEAMS, teamStats);
};

const startGame = (team1, team2) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const winnerTeam = Math.random() < 0.5 ? team1 : team2;
      updateTeamStats(winnerTeam);
      resolve();
    }, (Math.floor((10 - 4) * Math.random()) + 5) * 1000);
  });
};

const startCurrentRound = currentRoundTeams => {
  const promises = [];
  for (let i = 0; i < currentRoundTeams.length; i = i + 2) {
    promises.push(startGame(currentRoundTeams[i], currentRoundTeams[i + 1]));
  }

  Promise.all([...promises]).then(() => {
    currentRound++;
    roundExecutor(currentRound);
  });
};

const roundExecutor = currentRound => {
  const teamStats = StorageUtil.getLocalStorage(TEAMS);
  const currentRoundTeams = currentRound
    ? teamStats.filter(team => {
        return team.round === currentRound;
      })
    : teamStats;
  renderCurrentRoundTeams(currentRoundTeams);
  if (currentRoundTeams.length > 1) {
    startCurrentRound(currentRoundTeams);
  } else {
    StorageUtil.setLocalStorage(TOURNAMENT_WINNER, currentRoundTeams[0]);
    const winner = StorageUtil.getLocalStorage(TOURNAMENT_WINNER);
  }
};

const init = () => {
  StorageUtil.setLocalStorage(TOURNAMENT_WINNER, null);
  prepareTeamStats();
};
