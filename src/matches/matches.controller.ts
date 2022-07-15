import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { UpdateScoreDto } from "./dto/update-matchScore.dto";
import { MatchesService } from "./matches.service";

@Controller("matches")
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/update/:matchId")
  update(@Req() req, @Body() matchDto: UpdateMatchDto) {
    return this.matchesService.updateMatch(req.params.matchId, matchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/update/round/:round/:tournamentId")
  updateRound(@Req() req, @Body() matchDto: UpdateMatchDto) {
    return this.matchesService.updateRoundMatches(
      req.params.tournamentId,
      req.params.round,
      matchDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("/updateScore/:tournamentId/:matchId/:competitorId")
  updateScore(@Req() req, @Body() scoreData: UpdateScoreDto) {
    return this.matchesService.updateScore(
      req.params.tournamentId,
      req.params.matchId,
      req.params.competitorId,
      scoreData
    );
  }
}
