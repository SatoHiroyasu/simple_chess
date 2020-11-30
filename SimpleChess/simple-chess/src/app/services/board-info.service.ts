import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GameMasterService } from './game-master.service';
import { PiecesInfoService } from './pieces-info.service';
import { StartPosition } from './startPosition';

@Injectable({
  providedIn: 'root'
})
export class BoardInfoService {
  private boardInfo: number[][];
  private takenIdSub: Subject<number>;
  private enPassantInfo = {
    flg: false,
    position: {
      file: 0,
      rank: 0
    }
  };

  constructor(private gmService: GameMasterService ,private piService: PiecesInfoService) { 
    this.setStartBoardInfo();
    this.takenIdSub = new Subject<number>();
  }

  public getBoardInfo(): number[][] {
    return this.boardInfo;
  }

  public getIdByPosition(pos: {file: number, rank: number}): number {
    return this.boardInfo[pos.file - 1][pos.rank - 1];
  }

  public getColorById(id: number): string {
    return this.piService.getPieceColorById(id);
  }

  public getColorByPosition(pos: {file: number, rank: number}): string {
    return this.getColorById(this.getIdByPosition(pos));
  }

  public getIsTherePiece(pos: {file: number, rank: number}) {
    return this.getIdByPosition(pos) > 0;
  } 

  public updateBoardInfo(info: {
    file: number,
    rank: number,
    value: number
  }) {
    this.boardInfo[info.file - 1][info.rank - 1] = info.value;
  }

  public setStartBoardInfo() {
    this.boardInfo = [];
    for(let i = 0; i < 8; i++){
      this.boardInfo.push([]);
      for(let j = 0; j < 8; j++){
        this.boardInfo[i].push(0);
      }
    }

    let pieces = new StartPosition().positions;

    for(let piece of pieces){
      this.updateBoardInfo({file: piece.file, rank: piece.rank, value: piece.id});
    }
  }

  public getTakenIdSub() {
    return this.takenIdSub;
  }

  public noticeMoved(updateInfo: {
    file: number,
    rank: number,
    value: number
  }[]) {
    let takenId = 0;
    let epInfo = {
      flg: false,
      position: {
        file: 0,
        rank: 0
      }
    }
    for(let info of updateInfo){
      let id = this.getIdByPosition(info);
      this.gmService.disableCas(this.piService.getPieceById(id));
      if(info.value > 0 && id > 0){
        takenId = id;
      }else if(id < 0 && this.piService.getPieceById(info.value).name == "pawn"){
        this.enPassant(id * -1);
        takenId = id * -1;
      } else if(info.value < 0){
        epInfo = {
          flg: true,
          position: {
            file: info.file,
            rank: info.rank
          }
        }
      }
      this.updateBoardInfo(info);
    }

    if(this.enPassantInfo.flg){
      if(this.getIdByPosition(this.enPassantInfo.position) < 0){
        let info = {
          file: this.enPassantInfo.position.file,
          rank: this.enPassantInfo.position.rank,
          value: 0
        }
        this.updateBoardInfo(info)
      }
    }

    if(epInfo.flg){
      this.enPassantInfo = epInfo;
    }else {
      this.enPassantInfo = {
        flg: false,
        position: {
          file: 0,
          rank: 0
        }
      }
    }
    this.gmService.changeTurn();
    this.takenIdSub.next(takenId);
    let takenPiece = this.piService.getPieceById(takenId);
    if(takenPiece != null && takenPiece.name == "rook"){
      let cas = "";
      switch(takenPiece.file){
        case 1:
          cas = "O-O-O";
          break;
        case 8:
          cas = "O-O";
          break;
      }
      this.gmService.getCastlingSubByColor(takenPiece.color).next([
        takenPiece.color, cas
      ])
    }
    // this.piService.spliceTakenPiece(takenId);
  }

  private enPassant(id: number) {
    let piece = this.piService.getPieceById(id);
    this.updateBoardInfo({
      file: piece.file,
      rank: piece.rank,
      value: 0
    });
  }

  public getCastlingFlgs() {
    return {
      "white": {
        "O-O": 
          this.getIdByPosition({file: 6, rank: 1}) == 0 &&
          this.getIdByPosition({file: 7, rank: 1}) == 0,
        "O-O-O": 
          this.getIdByPosition({file: 4, rank: 1}) == 0 &&
          this.getIdByPosition({file: 3, rank: 1}) == 0 &&
          this.getIdByPosition({file: 2, rank: 1}) == 0
      },
      "black": {
        "O-O": 
          this.getIdByPosition({file: 6, rank: 8}) == 0 &&
          this.getIdByPosition({file: 7, rank: 8}) == 0,
        "O-O-O": 
          this.getIdByPosition({file: 4, rank: 8}) == 0 &&
          this.getIdByPosition({file: 3, rank: 8}) == 0 &&
          this.getIdByPosition({file: 2, rank: 8}) == 0
      }
    }
  }
}
