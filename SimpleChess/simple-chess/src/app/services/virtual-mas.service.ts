import { Injectable } from '@angular/core';
import { BoardInfoService } from './board-info.service';
import { GameMasterService, Piece } from './game-master.service';
import { PiecesInfoService } from './pieces-info.service';

@Injectable({
  providedIn: 'root'
})
export class VirtualMasService {

  constructor(
    private gmService: GameMasterService,
    private biService: BoardInfoService,
    private piService: PiecesInfoService
  ) { }

  public getMasWithoutCheck(piece: Piece, masArray: {
    file: number,
    rank: number
  }[]) {
    let result = [];
    for(let mas of masArray){
      let currentBoard = [];
      for(let file of this.biService.getBoardInfo()){
        let arr = [];
        for(let square of file){
          arr.push(square);
        }
        currentBoard.push(arr);
      }
      let idAtMas = currentBoard[mas.file - 1][mas.rank - 1];
      let vBoard = this.createVBoard(currentBoard, piece, mas);
      let enemyPieces = this.piService.getPiecesByColor(this.gmService.getEnemyColor());
      if(idAtMas > 0){
        enemyPieces.splice(this.getPieceIndexById(enemyPieces, idAtMas), 1);
      }
      let flg = true;
      for(let ePiece of enemyPieces){
        let eMas = this.getMoveAbleSquares(ePiece, vBoard);
        if(this.vSearchCheck(vBoard, eMas)){
          flg = false;
          break;
        }
      }
      if(flg){
        result.push(mas);
      }
    }
    return result;
  }

  private createVBoard(currentBoard: number[][], piece: Piece, mas: {
    file: number,
    rank: number
  }) {
    currentBoard[piece.file - 1][piece.rank - 1] = 0;
    currentBoard[mas.file - 1][mas.rank - 1] = piece.id;

    return currentBoard;
  }

  private getPieceIndexById(pieces: Piece[] ,id: number){
    for(let index in pieces){
      if(pieces[index].id == id){
        return Number(index);
      }
    }
    return null;
  }

  public getIsTherePiece(board: number[][] ,pos: {file: number, rank: number}) {
    return board[pos.file - 1][pos.rank- 1] > 0;
  }

  private getMoveAbleSquares(piece: Piece, board: number[][]){
    let pieceMaster = this.gmService.getPieceMaster(piece, this.biService);
    const bectorInfo = pieceMaster.getBectorInfo();
    let moveAbleSquares = [];

    for(let bector of bectorInfo.bectors){
      let mas = {
        file: piece.file + bector.file,
        rank: piece.rank + bector.rank
      }

      if(bectorInfo.infinite){
        while(mas.file >= 1 && mas.file <= 8 && mas.rank >= 1 && mas.rank <= 8){
          if(this.getIsTherePiece(board, mas)){
            if(this.pushOrBreak(mas, piece, board)){
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
          if(!this.getIsTherePiece(board, mas) || this.pushOrBreak(mas, piece, board)){
            moveAbleSquares.push(mas);
          }          
        }
      }
    }

    return moveAbleSquares;
  }

  private pushOrBreak(mas: {file: number, rank: number}, piece: Piece, board: number[][]): boolean {
    let id = board[mas.file - 1][mas.rank - 1];
    return this.piService.getPieceColorById(id) != piece.color
  }

  private vSearchCheck(board: number[][], masArray): boolean{
    let result = false;

    for(let mas of masArray){
      let id = board[mas.file - 1][mas.rank - 1];
      let targetPiece = this.piService.getPieceById(id);
      if(targetPiece != null && targetPiece.name == "king"){
        result = true;
        break;
      }
    }
    return result;
  }

  public getCastlingFlgs(piece: Piece) {
    let masArrayArray = [
      {
        color: "white",
        name: "O-O",
        masArray: [
          {
            file: 6,
            rank: 1
          },
          {
            file: 7,
            rank: 1
          }
        ]
      },
      {
        color: "white",
        name: "O-O-O",
        masArray: [
          {
            file: 3,
            rank: 1
          },
          {
            file: 4,
            rank: 1
          }
        ]
      },
      {
        color: "black",
        name: "O-O",
        masArray: [
          {
            file: 6,
            rank: 8
          },
          {
            file: 7,
            rank: 8
          }
        ]
      },
      {
        color: "black",
        name: "O-O-O",
        masArray: [
          {
            file: 3,
            rank: 8
          },
          {
            file: 4,
            rank: 8
          }
        ]
      }
    ];

    let result = {
      "white": {
        "O-O": true,
        "O-O-O": true
      },
      "black": {
        "O-O": true,
        "O-O-O": true
      }
    };

    for(let maa of masArrayArray) {
      if(piece.color == maa.color){
        let masArray = this.getMasWithoutCheck(piece, maa.masArray);
        if(masArray.length != 2){
          result[maa.color][maa.name] = false;
        }
      }
    }

    return result;
  }
}
