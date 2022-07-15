import { TournamentAccessType } from "../tournaments.model";
export enum OrderDirection {
  asc = "ASC",
  desc = "DESC",
}
export class FiltrationSortingTournamentDto {
  readonly skip: number = 0;
  readonly limit: number = 20;
  readonly orderBy: string;
  readonly orderDirection: OrderDirection;
  readonly game: string;
  readonly accessType: TournamentAccessType;
  readonly search: string;
}
