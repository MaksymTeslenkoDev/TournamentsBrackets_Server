import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Competitor } from "src/competitors/competitors.model";
import { MatchCompetitors } from "src/competitors/match-competitors.model";
import { Tournament } from "src/tournaments/tournaments.model";

/*Mandatory fields to create match object*/
interface MatchCreationAttrs {
  tournament_id: number;
  round: number;
  winner_mid: number;
  external_id: number;
}

@Table({ tableName: "matches" })
export class Match extends Model<Match, MatchCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Tournament)
  @Column({ type: DataType.INTEGER })
  tournament_id: number;

  @BelongsTo(() => Tournament, "tournament_id")
  tournament: Tournament;

  @Column({
    type: DataType.STRING,
  })
  comment: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  round: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: -1,
  })
  winner: number;

  @Column({
    type: DataType.INTEGER,
  })
  external_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  winner_mid: number;

  @Column({
    type: DataType.INTEGER,
  })
  looser_mid: number;

  @Column({
    type: DataType.INTEGER,
  })
  position_0: number;

  @Column({
    type: DataType.INTEGER,
  })
  position_1: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  startAt: null;

  @BelongsToMany(() => Competitor, () => MatchCompetitors)
  competitors: Competitor[];
}
