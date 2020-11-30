import {Piece} from "../game-master.service";
import { PieceRuleService } from '../piece-rule.service';

export abstract class PiecesMaster {
    protected bectorInfo: {
        bectors: {
            file: number,
            rank: number,
        }[],
        infinite: boolean
    };

    protected pieceObjectInfo: Piece;

    constructor(piece: Piece) {
        this.pieceObjectInfo = piece;
        this.setBectorsInfo();
    }

    protected abstract setBectorsInfo();

    public getBectorInfo(){
        return this.bectorInfo;
    }

    public updateBectorInfo(piece: Piece){};

    public createUpdateInfo(piece: Piece, dif: {file: number, rank: number}){
        let updateInfo: {
            file: number,
            rank: number,
            value: number
        }[] = [];

        updateInfo.push({
            file: piece.file,
            rank: piece.rank,
            value: 0
        });

        updateInfo.push({
            file: piece.file + dif.file,
            rank: piece.rank + dif.rank,
            value: piece.id
        })

        return updateInfo;
    }

    public setSpecialMove(info: any) {}
}
