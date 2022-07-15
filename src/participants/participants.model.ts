import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Tournament } from "src/tournaments/tournaments.model";
import { User } from "src/users/users.model";

/*Mandatory fields to create participant object*/
interface ParticipantCreationAttrs {
  tournament_id: number;
  user_id: number;
  role: UserRoles;
}

// export const UserRoles = ["Admin", "Owner"];
export enum UserRoles {
  owner = "Owner",
  admin = "Admin",
  player = "Player",
}

@Table({ tableName: "participants" })
export class Participant extends Model<Participant, ParticipantCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: number;

  @ForeignKey(() => Tournament)
  @Column({ type: DataType.INTEGER })
  tournament_id: number;

  @Column({
    type: DataType.STRING,
    defaultValue: UserRoles.player,
  })
  role: string;
}
