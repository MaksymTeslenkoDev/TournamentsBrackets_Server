import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { Observable } from "rxjs";
import { Participant } from "src/participants/participants.model";
import { ROLES_KEY } from "./roles-auth.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(Participant)
    private participantRepository: typeof Participant
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      return this.participantRepository
        .findAll({
          where: {
            tournament_id: req.params.tournamentId,
          },
        })
        .then((res) => {
          const tournamentParticipants = res;
          return tournamentParticipants.some(
            (participant) =>
              participant.user_id === req.user.id &&
              requiredRoles.includes(participant.role)
          );
        });
    } catch (e) {
      throw new HttpException(
        "You are not authorized",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
