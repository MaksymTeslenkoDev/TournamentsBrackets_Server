import { Module, forwardRef } from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { MatchesController } from "./matches.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tournament } from "src/tournaments/tournaments.model";
import { Match } from "./matches.model";
import { Participant } from "src/participants/participants.model";
import { Competitor } from "src/competitors/competitors.model";
import { AuthModule } from "src/auth/auth.module";
import { User } from "src/users/users.model";
import { MatchCompetitors } from "src/competitors/match-competitors.model";
import { TournamentsService } from "src/tournaments/tournaments.service";
import { TournamentsModule } from "src/tournaments/tournaments.module";

@Module({
  providers: [MatchesService],
  controllers: [MatchesController],
  imports: [
    forwardRef(() => TournamentsModule),
    SequelizeModule.forFeature([
      Tournament,
      Match,
      Participant,
      Competitor,
      MatchCompetitors,
      User,
    ]),
    AuthModule,
  ],
  exports: [MatchesService],
})
export class MatchesModule {}
