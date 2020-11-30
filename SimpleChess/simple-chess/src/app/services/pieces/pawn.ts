import { PiecesMaster } from './pieces-master';
import { Piece } from '../game-master.service';
import { BoardInfoService } from '../board-info.service';

export class Pawn extends PiecesMaster{
    private boardInfo: number[][];

    private biService: BoardInfoService;

    constructor(piece: Piece, bis: BoardInfoService){
        super(piece);
        this.biService = bis;
        this.boardInfo = this.biService.getBoardInfo();
        this.setBectorsInfo();
    }

    protected setBectorsInfo() {
        if(this.boardInfo == undefined){
            return;
        }

        this.bectorInfo = {
            bectors: [],
            infinite: false
        };

        let resultBectors = [];

        let bs = [{
            file: 0,
            rank: 1
        }]

        let isDefault = (this.pieceObjectInfo.color == "white" && this.pieceObjectInfo.rank == 2)
                            || (this.pieceObjectInfo.color == "black" && this.pieceObjectInfo.rank == 7);
        if(isDefault){
            bs.push({
                file: 0,
                rank: 2
            })
        }

        bs = this.pawnBector(bs);

        for(let b of bs){
            let file = this.pieceObjectInfo.file + b.file;
            let rank = this.pieceObjectInfo.rank + b.rank
            if(this.isTherePiece(file, rank)){
                break;
            }else {
                resultBectors.push(b);
            }
        }

        bs = [
            {
                file: 1,
                rank: 1
            },
            {
                file: -1,
                rank: 1
            }
        ];

        bs = this.pawnBector(bs);

        for(let b of bs){
            let file = this.pieceObjectInfo.file + b.file;
            let rank = this.pieceObjectInfo.rank + b.rank
            if(this.isTherePiece(file, rank) && !this.isMyPiece(this.boardInfo[file - 1][rank - 1])){
                resultBectors.push(b);
            }
        }

        this.bectorInfo = {
            bectors: resultBectors,
            infinite: false
        };
    }

    private pawnBector(bectors: {file: number, rank: number}[]) {
        if(this.pieceObjectInfo.color == "black"){
            for(let i in bectors){
                bectors[i].rank *= -1;
            }
        }

        return bectors;
    }

    public updateBectorInfo(piece: Piece) {
        this.pieceObjectInfo = piece;
        this.setBectorsInfo();
    }

    private isTherePiece(file: number, rank: number): boolean{
        return file >= 1 && file <= 8 && this.boardInfo[file - 1][rank - 1] != 0;
    }

    private isMyPiece(id: number){
        return this.pieceObjectInfo.color == this.biService.getColorById(id);
    }

    public createUpdateInfo(piece: Piece, dif: {file: number, rank: number}){
        let updateInfo: {
            file: number,
            rank: number,
            value: number
        }[] = super.createUpdateInfo(piece, dif);

        if(Math.abs(dif.rank) == 2){
            updateInfo.push({
                file: piece.file,
                rank: piece.rank + (dif.rank / 2),
                value: piece.id * -1
            })
        }
        
        return updateInfo;
    }

    public getSpecialMove(piece: Piece ,board: number[][]) {

    }
}
