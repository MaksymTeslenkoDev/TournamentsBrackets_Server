import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Match } from "src/matches/matches.model";
import { ParticipantsModule } from "src/participants/participants.module";
import { ParticipantsService } from "src/participants/participants.service";
import { Tournament } from "src/tournaments/tournaments.model";
import { User } from "src/users/users.model";
import { CompetitorsController } from "./competitors.controller";
import { Competitor } from "./competitors.model";
import { CompetitorsService } from "./competitors.service";
import { MatchCompetitors } from "./match-competitors.model";

@Module({
  controllers: [CompetitorsController],
  providers: [CompetitorsService],
  imports: [
    SequelizeModule.forFeature([
      Competitor,
      Match,
      MatchCompetitors,
      User,
      Tournament,
    ]),
  ],
  exports: [CompetitorsService],
})
export class CompetitorsModule {}
