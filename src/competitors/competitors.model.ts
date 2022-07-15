import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Match } from "src/matches/matches.model";
import { User } from "src/users/users.model";
import { MatchCompetitors } from "./match-competitors.model";

/*Mandatory fields to create participant object*/
interface CompetitorCreationAttrs {
  userId: number;
  position: number;
}

@Table({ tableName: "competitors" })
export class Competitor extends Model<Competitor, CompetitorCreationAttrs> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User, "userId")
  user: User;

  @BelongsToMany(() => Match, () => MatchCompetitors)
  tournaments: Match[];

  @Column({
    type: DataType.INTEGER,
  })
  position: number;
}
