import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Competitor } from "src/competitors/competitors.model";
import { Participant } from "src/participants/participants.model";
import { Tournament } from "src/tournaments/tournaments.model";

/*Mandatory fields to create user object*/
interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  icon: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "",
  })
  icon: string;

  @BelongsToMany(() => Tournament, () => Participant)
  tournaments: Tournament[];

  @HasMany(() => Competitor)
  competitors: Competitor[];
}
