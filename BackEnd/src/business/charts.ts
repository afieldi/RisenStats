import { GetDbPlayerGamesByPlayerPuuid } from "../db/games";
import PlayerModel from "../../../Common/models/player.model";
import { getDbPlayerByname } from "../db/player";
import { GetAveragesFromObjects } from "../../../Common/utils";

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400; //px
const height = 400; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

export async function CreatePlayerRadarWithPlayer(playerObject: PlayerModel, games: number = 20): Promise<String> {
  const dbGames = await GetDbPlayerGamesByPlayerPuuid(playerObject.puuid, false, undefined, games);
  const averages = GetAveragesFromObjects(dbGames, [
    "kda", "damageShare", "damageTakenOnTeamPercentage",
    "visionScorePerMinute", "killParticipation"
  ]);
  const data = {
    labels: [
      "KDA", "DD%", "DT%", "VSPM", "KP%"
    ],
    datasets: [
      {
        label: playerObject.name,
        data: Object.values(averages),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }
    ]
  };
  const config = {
    type: 'radar',
    data,
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      }
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config);
}

export async function CreatePlayerRadarWithName(playerName: string, games: number = 20): Promise<String> {
  const player = await getDbPlayerByname(playerName);
  return await CreatePlayerRadarWithPlayer(player, games);
}