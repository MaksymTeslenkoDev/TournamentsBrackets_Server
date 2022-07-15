import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post("/register")
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get("/check")
  @UseGuards(JwtAuthGuard)
  check(@Req() reg) {
    return this.authService.check(reg.user);
  }
}
