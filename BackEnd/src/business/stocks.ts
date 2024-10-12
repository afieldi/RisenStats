import TeamModel from '../../../Common/models/team.model';
import { GetDbTeamsByTeamId } from '../db/teams';
import { InvalidRequestError } from '../../../Common/errors';
import { AuthUser } from './auth';
import { buyDbStockForUser, createDBNewStockValue, getDbLatestStockValue, withdrawDbFunds } from '../db/stocks';

export async function updateStocksValueAfterMatch(seasonId: number, winningTeamId: number, losingTeamId: number ) {
  // Get the value of both teams, this is their ELO
  let latestTimelineForWinner = await getDbLatestStockValue(seasonId, winningTeamId);
  let latestTimelineForLoser = await getDbLatestStockValue(seasonId, losingTeamId);

  let winnerStockValue = latestTimelineForWinner == null ? createBaselineForTeam(winningTeamId) : latestTimelineForWinner.dollarValue;
  let loserStockValue = latestTimelineForLoser == null ? createBaselineForTeam(losingTeamId) : latestTimelineForLoser.dollarValue;

  // Calculate new value of teams
  let updatedStockValues = calculateNewDollarValue(winnerStockValue, loserStockValue);

  //Sync the times
  let currentTimeStamp = new Date(Date.now());

  // insert new value in timeline for both teams
  await createDBNewStockValue(winningTeamId, seasonId, updatedStockValues.newWinnerDollarValue, currentTimeStamp);
  await createDBNewStockValue(losingTeamId, seasonId, updatedStockValues.newLoserDollarValue, currentTimeStamp);
}

export async function buyStock(user: AuthUser, seasonId: number, teamId: number, amountToBuy: number) {
  let team: TeamModel = await GetDbTeamsByTeamId(teamId, seasonId);
  if(!team) {
    throw new InvalidRequestError(`Could not find team with id ${teamId} and season ${seasonId}`);
  }

  let userWallet = await getUserWallet(user);
  let priceOfStock = (await getDbLatestStockValue(seasonId, teamId)).dollarValue;
  let price = priceOfStock * amountToBuy;
  if(price < userWallet) {
    throw new InvalidRequestError('User cant buy that stock');
  }

  let didWithdrawSucceed = await withdrawDbFunds(user, price);
  let didBuySucceed =  await buyDbStockForUser(user, seasonId, teamId, amountToBuy);
  // TODO some success messaging
  return;
}

async function getUserWallet(user: AuthUser): Promise<number> {
  return 0; // TODO
}

// TODO decouple from the model?
function calculateNewDollarValue(winnerDollarValue: number, loserDollarValue: number, kFactor: number = 32) {

  // Extract current ratings from the team objects
  const ratingWinner = winnerDollarValue;
  const ratingLoser = loserDollarValue;

  // Calculate the expected scores
  const expectedWinner = 1 / (1 + Math.pow(10, (ratingLoser - ratingWinner) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (ratingWinner - ratingLoser) / 400));

  // Update ratings based on the fixed result (winner gets 1, loser gets 0)
  const newRatingWinner = ratingWinner + kFactor * (1 - expectedWinner);
  const newRatingLoser = ratingLoser + kFactor * (0 - expectedLoser);

  return {
    newWinnerDollarValue: Math.round(newRatingWinner),
    newLoserDollarValue: Math.round(newRatingLoser)
  };
}

function createBaselineForTeam(teamId: number): number {
  // TODO fetch the ranks of the players and then make a baseline
  return 1000;
}