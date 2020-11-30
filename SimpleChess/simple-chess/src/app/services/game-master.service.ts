import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BoardInfoService } from './board-info.service';
import { PiecesMaster } from './pieces/pieces-master';
import { King } from './pieces/king';
import { Queen } from './pieces/queen';
import { Bishop } from './pieces/bishop';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Rook } from './pieces/rook';

const TURN_COLORS = ["white", "black"];

@Injectable({
  providedIn: 'root'
})
export class GameMasterService {
  private currentTurn: number;
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
  private castlingSubs = {
    "white": new Subject<string>(),
    "black": new Subject<string>()
  }

  constructor() {
    this.currentTurn = 0;
    this.subscribeCastling("white");
    this.subscribeCastling("black");
  }

  public getCurrentTurn(): string{
    return TURN_COLORS[this.currentTurn]
  }

  public getEnemyColor(): string {
    return TURN_COLORS[(this.currentTurn + 1) % 2];
  }

  public changeTurn() {
    this.currentTurn = (this.currentTurn + 1) % 2;
  }

  public getCastlingFlgs() {
    return this.castlingFlgs;
  }

  public disableCas(piece: Piece) {
    if(piece == null){
      return;
    }
    if(piece.name == "king"){
      this.castlingFlgs[piece.color] = {
        "O-O": false,
        "O-O-O": false
      };
    }else if(piece.name == "rook"){
      if(piece.file == 8){
        this.castlingFlgs[piece.color]["O-O"] = false;
      }else if(piece.file == 1){
        this.castlingFlgs[piece.color]["O-O-O"] = false
      }
    }
  }

  public getCastlingSubs() {
    return this.castlingSubs;
  }

  public getCastlingSubByColor(color: string){
    return this.castlingSubs[color];
  }

  private subscribeCastling(color: string) {
    let sub: Subject<string[]> = this.castlingSubs[color];
    sub.subscribe(infoArr => {
      if(infoArr[0] == color){
        this.castlingFlgs[color][infoArr[1]] = false;
        this.completeCasSub(color);
      }
    }, error => console.log(error))
  }

  private completeCasSub(color: string) {
    if(!this.castlingFlgs[color]["O-O"] && !this.castlingFlgs[color]["O-O-O"]){
      this.castlingSubs[color].complete();
    }
  }

  public getPieceMaster(piece: Piece, biService: BoardInfoService) {
    let pieceMaster: PiecesMaster;

    switch(piece.name) {
      case "king":
        pieceMaster = new King(piece, biService);
        break;
      case "queen":
        pieceMaster = new Queen(piece);
        break;
      case "bishop":
        pieceMaster = new Bishop(piece);
        break;
      case "knight":
        pieceMaster = new Knight(piece);
        break;
      case "rook":
        pieceMaster = new Rook(piece);
        break;
      case "pawn":
        pieceMaster = new Pawn(piece, biService);
        break;
      default:
        console.error("不適切な名前が指定されました。");
    }

    return pieceMaster;
  }
}

export interface Piece {
  id: number,
  name: string,
  color: string,
  file: number,
  rank: number
}

export enum PiecesNumber {
  "pawn" = 0,
  "bishop",
  "knight",
  "rook",
  "queen",
  "king"
}

export enum PiecesDisplay {
  "●" = 0,
  "B",
  "N",
  "R",
  "Q",
  "K"
}