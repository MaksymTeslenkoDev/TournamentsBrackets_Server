import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Competitor } from "src/competitors/competitors.model";
import { MatchCompetitors } from "src/competitors/match-competitors.model";
import { TournamentsService } from "src/tournaments/tournaments.service";
import { User } from "src/users/users.model";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { UpdateScoreDto } from "./dto/update-matchScore.dto";
import { Match } from "./matches.model";

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match)
    private matchRepository: typeof Match,
    @InjectModel(Competitor)
    private competitorRepository: typeof Competitor,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(MatchCompetitors)
    private matchCompetitorsRepository: typeof MatchCompetitors,
    private tournamentsService: TournamentsService
  ) {}

  async updateMatch(matchId, matchDto: UpdateMatchDto) {
    const res = await this.matchRepository.update(
      { [matchDto.field]: matchDto.value },
      {
        where: {
          id: matchId,
        },
      }
    );

    return res;
  }

  async updateRoundMatches(tournamentId, round, matchDto: UpdateMatchDto) {
    const res = await this.matchRepository.update(
      { [matchDto.field]: matchDto.value },
      {
        where: {
          tournament_id: tournamentId,
          round,
        },
      }
    );

    return await this.queryTournamentMatches(tournamentId);
  }

  async queryTournamentMatches(tournamentId: number) {
    return await this.matchRepository.findAll({
      where: {
        tournament_id: tournamentId,
      },
      include: [
        {
          model: Competitor,
          through: {
            as: "matchCompetitors",
          },
          include: [
            { model: User, as: "user", attributes: ["name", "email", "id"] },
          ],
        },
      ],
    });
  }

  async updateScore(
    tournamentId: number,
    matchId: number,
    competitorId: number,
    scoreData: UpdateScoreDto
  ) {
    await this.matchCompetitorsRepository.update(
      {
        score: scoreData.value,
      },
      {
        where: {
          competitorId,
          matchId,
        },
      }
    );

    const matches = await this.queryTournamentMatches(tournamentId);

    // console.log("matches ", matches);
    const winnerMid = matches.find((i) => i.id === +matchId).winner_mid;

    const nextMatchForWinner = matches.find((i) => i.external_id === winnerMid);

    const matchesPairs = matches.filter((i) => i.winner_mid === winnerMid);
    matchesPairs.sort((a, b) => {
      if (b.competitors.length && a.competitors.length) {
        return (
          b.competitors[0]["matchCompetitors"].score -
          a.competitors[0]["matchCompetitors"].score
        );
      }
    });

    const isMatchCompetitorExist =
      await this.matchCompetitorsRepository.findOne({
        where: {
          matchId: nextMatchForWinner.id,
        },
      });

    if (isMatchCompetitorExist) {
      await this.matchCompetitorsRepository.update(
        {
          competitorId: matchesPairs[0].competitors[0].id,
        },
        {
          where: {
            matchId: nextMatchForWinner.id,
          },
        }
      );
    } else {
      await this.matchCompetitorsRepository.create({
        competitorId: matchesPairs[0].competitors[0].id,
        matchId: nextMatchForWinner.id,
        score: 0,
      });
    }

    return await this.tournamentsService.getTournamentQuery(tournamentId);
  }
}
