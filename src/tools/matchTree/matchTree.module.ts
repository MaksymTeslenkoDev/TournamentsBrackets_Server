import { Module } from "@nestjs/common";
import { MatchTreeService } from "./matchTree.service";

@Module({
  providers: [MatchTreeService],
  exports: [MatchTreeService],
})
export class MatchTreeModule {}
