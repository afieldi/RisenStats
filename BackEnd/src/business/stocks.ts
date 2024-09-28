import TeamModel from '../../../Common/models/team.model';
import { GetDbTeamsByTeamId } from '../db/teams';
import { InvalidRequestError } from '../../../Common/errors';
import { AuthUser } from './auth';
import { buyDbStockForUser, getDbLatestStockValue, withdrawDbFunds } from '../db/stocks';

export async function updateStocksValueAfterMatch(seasonId: number, winningTeamId: number, losingTeamId: number ) {
  // Get the value of both teams, this is their ELO
  // If team doesnt exist calculate the baseline based off their ranks
  // Calcualte new value of teams
  // insert new value in timeline for both teams
}

export async function buyStock(user: AuthUser, seasonId: number, teamId: number, amountToBuy: number) {
  let team: TeamModel = await GetDbTeamsByTeamId(teamId, seasonId);
  if(!team) {
    throw new InvalidRequestError(`Could not find team with id ${teamId} and season ${seasonId}`);
  }

  let userWallet = await getUserWallet(user);
  let priceOfStock = (await getDbLatestStockValue(seasonId, teamId)).dollar_value;
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