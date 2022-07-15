import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Match } from "src/matches/matches.model";
import { Participant } from "src/participants/participants.model";
import { User } from "src/users/users.model";

export const TournamentsTypes = ["bracket", "round_robin", "ladder"];
export const brackeTorunamentTypeFormats = [
  "Single Elimination",
  "Double Elimination",
];
/*Mandatory fields to create tournament object*/
interface TournamentCreationAttrs {
  title: string;
  type: string;
  game: string;
  game_format: string;
  format: string;
  ownerEmail: string;
}
export enum TournamentAccessType {
  all = "all",
  private = "private",
  public = "public",
}

@Table({ tableName: "tournaments" })
export class Tournament extends Model<Tournament, TournamentCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @BelongsToMany(() => User, () => Participant)
  users: User[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ENUM({ values: TournamentsTypes }),
    defaultValue: "bracket",
  })
  type: string;

  @Column({
    type: DataType.ENUM({ values: brackeTorunamentTypeFormats }),
    defaultValue: "Single Elimination",
  })
  format: string;

  @Column({
    type: DataType.STRING,
  })
  game_format: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  bronze_match: boolean;

  @HasMany(() => Match, "tournament_id")
  matches: Match[];

  @Column({
    type: DataType.STRING,
  })
  game: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 8,
  })
  size: number;

  @Column({
    type: DataType.STRING,
    defaultValue: TournamentAccessType.public,
  })
  accessType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture_long: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture_small: string;

  @Column({
    type: DataType.STRING,
  })
  startAt: string;

  @Column({
    type: DataType.STRING,
  })
  finishAt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture_original: string;
}
