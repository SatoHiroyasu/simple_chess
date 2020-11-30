import { Injectable } from '@angular/core';
import { BoardInfoService } from './board-info.service';
import { Piece } from './game-master.service';
import { PiecesMaster } from './pieces/pieces-master';

@Injectable({
  providedIn: 'root'
})
export class PieceRuleService {

  constructor(
    private biService: BoardInfoService
  ) {
  }

  public pushOrBreak(mas: {file: number, rank: number}, piece: Piece): boolean {
    return this.biService.getColorByPosition(mas) != piece.color
  }

  public getMoveAbleSquares(piece: Piece, pieceMaster: PiecesMaster){
    const bectorInfo = pieceMaster.getBectorInfo();
    let moveAbleSquares = [];

    for(let bector of bectorInfo.bectors){
      let mas = {
        file: piece.file + bector.file,
        rank: piece.rank + bector.rank
      }

      if(bectorInfo.infinite){
        while(mas.file >= 1 && mas.file <= 8 && mas.rank >= 1 && mas.rank <= 8){
          if(this.biService.getIsTherePiece(mas)){
            if(this.pushOrBreak(mas, piece)){
              moveAbleSquares.push(mas);
            }
            
            break;
          }
          moveAbleSquares.push(mas);

          mas = {
            file: mas.file + bector.file,
            rank: mas.rank + bector.rank
          };
        }
      }else{
        if(mas.file >= 1 && mas.file <= 8 && mas.rank >= 1 && mas.rank <= 8){
          if(!this.biService.getIsTherePiece(mas) || this.pushOrBreak(mas, piece)){
            moveAbleSquares.push(mas);
          }          
        }
      }
    }

    return moveAbleSquares;
  }
}
