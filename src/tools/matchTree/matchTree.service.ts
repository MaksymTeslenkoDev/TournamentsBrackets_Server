import { Injectable } from "@nestjs/common";

@Injectable()
export class MatchTreeService {
  constructor() {}

  getMatchNumber(_teamAmount) {
    return 2 ** Math.ceil(Math.log(_teamAmount) / Math.log(2));
  }

  private makeTreeData(size) {
    const resArr = [];
    let count = 0;
    const target = Math.log(size) / Math.log(2);
    const indexMap = Array.from({ length: size + 2 }).map(() => 0);
    const _makeTree = (step = 0, parentId = -1) => {
      count += 1;
      const winId = count;
      indexMap[step] += 1;
      if (step >= target) {
        resArr.push({
          id: count,
          winnerId: parentId,
          index: indexMap[step],
          round: step,
        });
        return;
      }

      resArr.push({
        id: count,
        winnerId: parentId,
        index: indexMap[step],
        round: step,
      });
      _makeTree(step + 1, winId);
      _makeTree(step + 1, winId);
    };
    _makeTree();

    return resArr;
  }

  getTree(teamCount) {
    const matchCount = this.getMatchNumber(teamCount);
    return this.makeTreeData(matchCount);
  }
}
