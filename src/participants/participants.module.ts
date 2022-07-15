import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tournament } from "src/tournaments/tournaments.model";
import { User } from "src/users/users.model";
import { ParticipantsController } from "./participants.controller";
import { Participant } from "./participants.model";
import { ParticipantsService } from "./participants.service";

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  imports: [SequelizeModule.forFeature([Participant, User, Tournament])],
})
export class ParticipantsModule {}
