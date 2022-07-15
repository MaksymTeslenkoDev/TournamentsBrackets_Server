import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { ParticipantsController } from "./participants/participants.controller";
import { ParticipantsModule } from "./participants/participants.module";
import { Participant } from "./participants/participants.model";
import { TournamentsModule } from "./tournaments/tournaments.module";
import { Tournament } from "./tournaments/tournaments.model";
import { MatchesModule } from "./matches/matches.module";
import { Match } from "./matches/matches.model";
import { CompetitorsController } from "./competitors/competitors.controller";
import { CompetitorsModule } from "./competitors/competitors.module";
import { Competitor } from "./competitors/competitors.model";
import { AuthModule } from "./auth/auth.module";
import { MatchCompetitors } from "./competitors/match-competitors.model";
@Module({
  controllers: [ParticipantsController, CompetitorsController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Participant,
        Tournament,
        Match,
        Competitor,
        MatchCompetitors,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    ParticipantsModule,
    TournamentsModule,
    MatchesModule,
    CompetitorsModule,
    AuthModule,
  ],
})
export class AppModule {}
