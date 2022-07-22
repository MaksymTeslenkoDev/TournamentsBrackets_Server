import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Competitor } from "./competitors.model";

@Injectable()
export class CompetitorsService {
  constructor(
    @InjectModel(Competitor)
    private competitorRepository: typeof Competitor
  ) {}

  async deleteCompetitor(competitorId: number) {
    await this.competitorRepository.destroy({
      where: {
        id: competitorId,
      },
    });
  }
}
