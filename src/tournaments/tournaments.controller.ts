import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AddCompetitorDto } from "./dto/addCompetitor-tournament.dto";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { FiltrationSortingTournamentDto } from "./dto/filtration-sorting-tournament-dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { TournamentsService } from "./tournaments.service";

@Controller("tournaments")
export class TournamentsController {
  constructor(private tournamentService: TournamentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  create(@Req() req, @Body() tournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(tournamentDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get/:game")
  getUserTournaments(@Req() req) {
    return this.tournamentService.getUserTournaments(req.user, req.params.game);
  }

  @Get("/getById/:tournamentId")
  getTournamentById(@Req() req) {
    return this.tournamentService.getTournamentQuery(req.params.tournamentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/update/:tournamentId")
  updateTournament(@Req() req, @Body() body: UpdateTournamentDto) {
    return this.tournamentService.updateTournament(
      req.params.tournamentId,
      body
    );
  }

  @Post("/getAll")
  index(@Body() body: FiltrationSortingTournamentDto) {
    return this.tournamentService.getTournamentsQuery(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/addCompetitor/:tournamentId")
  addCompetitor(@Req() req, @Body() body: AddCompetitorDto) {
    return this.tournamentService.addCompetitor(
      req.user,
      req.params.tournamentId,
      body
    );
  }

  @Roles("Owner")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post("/delete/:tournamentId")
  deleteTournament(@Req() req) {
    return this.tournamentService.deleteTournament(req.params.tournamentId);
  }
}
