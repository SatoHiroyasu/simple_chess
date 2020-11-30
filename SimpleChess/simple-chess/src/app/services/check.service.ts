import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BoardInfoService } from './board-info.service';
import { GameMasterService, Piece } from './game-master.service';
import { PiecesInfoService } from './pieces-info.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  private checkSub: Subject<string>;
  private castlingFlgs = {
    "white": {
      "O-O": true,
      "O-O-O": true
    },
    "black": {
      "O-O": true,
      "O-O-O": true
    }
  }

  constructor(
    private gmService: GameMasterService,
    private piService: PiecesInfoService,
    private biService: BoardInfoService
  ) {
    this.checkSub = new Subject<string>();
  }

  public getCheckSub() {
    return this.checkSub;
  }

  public nextCheckSub(
    masArray: {
      file: number,
      rank: number
    }[]
  ){
    if(this.searchCheck(masArray)){
      this.checkSub.next(this.gmService.getCurrentTurn());
    }
  }

  public searchCheck(masArray): boolean{
    let result = false;

    for(let mas of masArray){
      let targetPiece = this.piService.getPieceById(this.biService.getIdByPosition(mas));
      if(targetPiece != null && targetPiece.name == "king"){
        result = true;
        break;
      }
    }
    return result;
  }

  public getCastlingFlgs() {
    return this.castlingFlgs;
  }
}
