import { Injectable } from '@angular/core';
import { Piece } from './game-master.service';
import { StartPosition } from './startPosition';

@Injectable({
  providedIn: 'root'
})
export class PiecesInfoService {
  private pieces: Piece[];
  private alivePieces: Piece[];

  constructor() {
    this.pieces = new StartPosition().positions;
    this.alivePieces = [];
    for(let piece of this.pieces){
      this.alivePieces.push(piece);
    }
  }

  public getAllPieces(): Piece[] {
    return this.pieces;
  }

  public getPieceById(id: number){
    for(let piece of this.pieces){
      if(piece.id == id){
        return piece;
      }
    }
    return null;
  }

  public getPieceByPosition(pos: {file: number, rank: number}): Piece{
    return this.getPieceById(this.pieces[pos.file][pos.rank]);
  }

  public getPieceColorByPosition(pos: {file: number, rank: number}): string {
    let piece = this.getPieceByPosition(pos);
    return (piece != null) ? piece.color : null;
  }

  public getPieceColorById(id: number): string {
    let piece = this.getPieceById(id);
    return piece != null ? piece.color : "";
  }

  public getPiecesByColor(color: string) {
    let resultArr = [];
    for(let piece of this.alivePieces){
      if(piece.color == color){
        resultArr = resultArr.concat(piece);
      }
    }
    return resultArr;
  }

  public spliceTakenPiece(id: number){
    for(let index in this.alivePieces){
      if(id == this.alivePieces[index].id){
        this.alivePieces.splice(Number(index), 1);
        break;
      }
    }
  }
}
