import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Match } from "src/matches/matches.model";
import { Participant } from "src/participants/participants.model";
import { User } from "src/users/users.model";
import { TournamentsController } from "./tournaments.controller";
import { Tournament } from "./tournaments.model";
import { TournamentsService } from "./tournaments.service";
import { MatchTreeModule } from "src/tools/matchTree/matchTree.module";
import { AuthModule } from "src/auth/auth.module";
import { Competitor } from "src/competitors/competitors.model";
import { MatchCompetitors } from "src/competitors/match-competitors.model";
import { MatchesModule } from "src/matches/matches.module";
import { CompetitorsModule } from "src/competitors/competitors.module";
import { ParticipantsModule } from "src/participants/participants.module";

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    SequelizeModule.forFeature([
      Participant,
      Tournament,
      Match,
      User,
      Competitor,
      MatchCompetitors,
    ]),
    MatchTreeModule,
    forwardRef(() => MatchesModule),
    AuthModule,
    CompetitorsModule,
    ParticipantsModule,
  ],
  exports: [TournamentsService],
})
export class TournamentsModule {}
