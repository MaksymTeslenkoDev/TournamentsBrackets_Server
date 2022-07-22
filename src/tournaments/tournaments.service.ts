import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { JwtPayload } from "src/auth/auth.service";
import { Competitor } from "src/competitors/competitors.model";
import { MatchCompetitors } from "src/competitors/match-competitors.model";
import { Match } from "src/matches/matches.model";
import { Participant, UserRoles } from "src/participants/participants.model";
import * as bcrypt from "bcryptjs";
import { MatchTreeService } from "src/tools/matchTree/matchTree.service";
import { User } from "src/users/users.model";
import { AddCompetitorDto } from "./dto/addCompetitor-tournament.dto";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { FiltrationSortingTournamentDto } from "./dto/filtration-sorting-tournament-dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { Tournament, TournamentAccessType } from "./tournaments.model";
import { DeletePlayerDto } from "./dto/deletePlayer.dto";
import { CompetitorsService } from "src/competitors/competitors.service";
import { ParticipantsService } from "src/participants/participants.service";

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament)
    private tournamentRepository: typeof Tournament,
    @InjectModel(Match)
    private matchRepository: typeof Match,
    @InjectModel(Participant)
    private participantRepository: typeof Participant,
    @InjectModel(Competitor)
    private competitorRepository: typeof Competitor,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(MatchCompetitors)
    private matchCompetitorsRepository: typeof MatchCompetitors,
    private matchTreeService: MatchTreeService, // private matchService: MatchesService,
    private competitorsService: CompetitorsService,
    private participantsService: ParticipantsService
  ) {}

  async create(tournamentDto: CreateTournamentDto, user: JwtPayload) {
    const DEFAULT_TEAM_COUNT = 8;
    const tournament = await this.tournamentRepository.create({
      ...tournamentDto,
    });

    const TOURNAMENT_INVITE_STR = await bcrypt.hash("" + tournament.id, 5);

    await this.updateTournament(tournament.id, {
      field: "invite",
      value: TOURNAMENT_INVITE_STR,
    });

    await this.participantRepository.create({
      user_id: user.id,
      tournament_id: tournament.id,
      role: UserRoles.owner,
    });

    await this.generateTournamentMatches(tournament.id, DEFAULT_TEAM_COUNT);

    return await this.getTournamentQuery(tournament.id);
  }

  async updateTournament(tournamentId: number, body: UpdateTournamentDto) {
    await this.tournamentRepository.update(
      { [body.field]: body.value },
      {
        where: {
          id: tournamentId,
        },
      }
    );
    if (body.field === "size") {
      await this.generateTournamentMatches(tournamentId, +body.value);
      const tournament = await this.getTournamentQuery(tournamentId);
      const count = Math.ceil(Math.log(+body.value) / Math.log(2));
      const tournamentPlayers = this.getTournamentPlayers(tournament.users);
      for (let user of tournamentPlayers) {
        const { name, id, email, icon } = user;
        await this.addCompetitor({ name, id, email, icon }, tournamentId, {
          maxNumberRound: count,
        });
      }
    }
    return await this.getTournamentQuery(tournamentId);
  }

  async getUserTournaments(user: JwtPayload, game: string) {
    return await User.findAll({
      where: {
        id: user.id,
      },
      attributes: [],
      include: [
        {
          model: Tournament,
          through: {
            attributes: ["role"],
            as: "participant",
          },
          attributes: ["title", "id"],
          as: "tournaments",
          where: {
            game,
          },
        },
      ],
    });
  }

  async getTournamentQuery(
    id: string | number,
    isReturnPassword: boolean = false
  ) {
    console.log("is return pass ", isReturnPassword);
    return await Tournament.findOne({
      where: {
        id,
      },

      attributes: isReturnPassword
        ? [
            "id",
            "title",
            "type",
            "size",
            "game",
            "game_format",
            "format",
            "accessType",
            "startAt",
            "finishAt",
            "invite",
            "password",
          ]
        : { exclude: ["password"] },
      include: [
        {
          model: Match,
          as: "matches",
          include: [
            {
              model: Competitor,
              through: {
                as: "matchCompetitors",
              },
              include: [{ model: User, as: "user" }],
            },
          ],
        },
        {
          model: User,
          through: {
            attributes: ["role"],
            as: "participant",
          },
          attributes: ["name", "email", "id", "icon"],
          as: "users",
        },
      ],
    });
  }
  async returnPassword(tournamentId: number, userEmail: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
    });

    const participant = await this.participantRepository.findOne({
      where: {
        user_id: user.id,
      },
    });

    if (participant) {
      if (["Owner", "Admin"].includes(participant.role)) {
        return true;
      }
    }
    return false;
  }

  async getTournamentsQuery(data: FiltrationSortingTournamentDto) {
    let whereCondition = {
      game: data.game,
    };

    if (data.accessType !== "all") {
      whereCondition["accessType"] = data.accessType;
    }

    if (data.search) {
      whereCondition["title"] = { [Op.iLike]: `%${data.search}%` };
    }

    return await this.tournamentRepository.findAll({
      where: whereCondition,
      limit: data.limit,
      offset: data.skip,
      attributes: [
        "id",
        "game",
        "title",
        "accessType",
        "size",
        "game_format",
        "format",
        "startAt",
      ],
      order: [[data.orderBy, data.orderDirection || "ASC"]],
      include: [
        {
          model: User,
          through: {
            attributes: ["role"],
            as: "participant",
          },
          attributes: ["name"],
          as: "users",
        },
        {
          model: Match,
          as: "matches",
          include: [
            {
              model: Competitor,
              through: {
                as: "matchCompetitors",
              },
              include: [{ model: User, as: "user" }],
            },
          ],
        },
      ],
    });
  }

  async generateTournamentMatches(tournamentId: number, size: number) {
    await this.matchRepository.sequelize.query(`DELETE FROM public.matches
    WHERE tournament_id=${tournamentId};`);
    const tree = this.matchTreeService.getTree(size);

    for (let i = 0; i < tree.length; i++) {
      await this.matchRepository.create({
        tournament_id: tournamentId,
        winner_mid: tree[i].winnerId,
        round: tree[i].round,
        external_id: tree[i].id,
      });
    }
  }

  async addParticipant(
    user: JwtPayload,
    tournamentId: number,
    role: UserRoles
  ) {
    await this.participantRepository.create({
      user_id: user.id,
      tournament_id: tournamentId,
      role,
    });
  }

  async addCompetitor(
    user: JwtPayload,
    tournamentId: number,
    data: AddCompetitorDto
  ) {
    const tournament = await this.getTournamentQuery(tournamentId, true);
    const playersAmount = this.getTournamentPlayers(tournament.users).length;

    if (
      tournament.accessType === TournamentAccessType.private &&
      tournament.password !== data.tournamentPassword
    ) {
      throw new HttpException("Password is incorrect", HttpStatus.BAD_REQUEST);
    }

    if (playersAmount > tournament.size) {
      throw new HttpException(
        "Competitors count is exceed",
        HttpStatus.BAD_REQUEST
      );
    }
    const matches = await this.matchRepository.findAll({
      where: {
        tournament_id: tournamentId,
        round: data.maxNumberRound,
      },
      order: [["winner_mid", "ASC"]],
      include: [
        {
          model: Competitor,
          through: {
            as: "matchCompetitors",
          },
        },
      ],
    });

    const matchWithoutCompetitors = matches.find(
      (i) => i.competitors.length === 0
    );

    const isUserCompetitorExist = matches.find(
      (i) => i.competitors.findIndex((i) => i.userId === user.id) > -1
    );
    if (isUserCompetitorExist) {
      throw new HttpException(
        "You have already joined",
        HttpStatus.BAD_REQUEST
      );
    }

    if (!tournament.users.find((i) => i.email === user.email)) {
      await this.addParticipant(user, tournamentId, UserRoles.player);
    }

    const competitor = await this.competitorRepository.create({
      userId: user.id,
      position: 0,
    });

    await this.matchCompetitorsRepository.create({
      competitorId: competitor.id,
      matchId: matchWithoutCompetitors.id,
      score: 0,
    });

    return await this.getTournamentQuery(tournamentId);
  }

  async getTournament(tournamentId: number, userEmail?: string) {
    const isReturnPassword = userEmail
      ? await this.returnPassword(tournamentId, userEmail)
      : false;

    return await this.getTournamentQuery(tournamentId, isReturnPassword);
  }

  async deleteTournament(tournamentId: number) {
    await this.tournamentRepository.sequelize
      .query(`DELETE FROM public.tournaments
    WHERE id=${tournamentId};`);
  }

  private getTournamentPlayers(tournamentUsers: Array<User>) {
    return tournamentUsers.filter(
      (i) => i["participant"].role === UserRoles.player
    );
  }

  async decodeInviteToken(token: string) {
    try {
      const res: Tournament[] = await this.tournamentRepository.findAll({
        where: {
          invite: token,
        },
      });

      if (!res[0]) {
        throw new HttpException("URL is incorrect", HttpStatus.BAD_REQUEST);
      }

      return {
        id: res[0].id,
        game: res[0].game,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException("URL is incorrect", HttpStatus.BAD_REQUEST);
      }
    }
  }
  async deletePlayer(data: DeletePlayerDto) {
    console.log("data ", data);
    await this.competitorsService.deleteCompetitor(data.competitorId);
    await this.participantsService.deleteParticipant(
      data.tournamentId,
      data.userEmail
    );
    return await this.getTournamentQuery(data.tournamentId);
  }
}
