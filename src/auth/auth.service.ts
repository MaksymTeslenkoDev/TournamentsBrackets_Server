import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/users.model";
import { JwtService } from "@nestjs/jwt";
export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  icon: string;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private JwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new HttpException("Email isn't correct", HttpStatus.UNAUTHORIZED);
    }
    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );

    if (user && isPasswordEquals) {
      return user;
    }
    throw new HttpException("Password isn't correct", HttpStatus.UNAUTHORIZED);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException("User is already exist ", HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async check(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      icon: user.icon,
    };
    return {
      token: this.JwtService.sign(payload),
    };
  }
}
