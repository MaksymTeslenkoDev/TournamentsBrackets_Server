import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/users/users.model";
import { Participant } from "./participants.model";

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant)
    private participantRepository: typeof Participant,
    @InjectModel(User)
    private userRepository: typeof User
  ) {}

  async deleteParticipant(tournamentId: number, userEmail: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new HttpException("User wasn't found", HttpStatus.BAD_REQUEST);
    }

    await this.participantRepository.destroy({
      where: {
        tournament_id: tournamentId,
        user_id: user.id,
      },
    });
  }
}
