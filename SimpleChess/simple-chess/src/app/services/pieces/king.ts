import { PiecesMaster } from './pieces-master';
import { Piece } from '../game-master.service';
import { BoardInfoService } from '../board-info.service';

export class King extends PiecesMaster{
    private castlingBec: {
        file: number,
        rank: number
    }[];
    private defaultBector;
    private biService: BoardInfoService;

    constructor(piece: Piece, bis: BoardInfoService){
        super(piece);
        this.castlingBec = [];
        this.biService = bis;
    }

    protected setBectorsInfo() {
        const bectors = [
            {
                file: 1,
                rank: 0
            },
            {
                file: 1,
                rank: 1
            },
            {
                file: 0,
                rank: 1
            },
            {
                file: -1,
                rank: 1
            },
            {
                file: -1,
                rank: 0
            },
            {
                file: -1,
                rank: -1
            },
            {
                file: 0,
                rank: -1
            },
            {
                file: 1,
                rank: -1
            },
        ]

        this.bectorInfo = {
            bectors: bectors,
            infinite: false
        };

        this.defaultBector = bectors;
    }

    public updateBectorInfo(piece: Piece) {
        this.setBectorsInfo();
    }

    public createUpdateInfo(piece: Piece, dif: {file: number, rank: number}) {
        let updateInfo: {
            file: number,
            rank: number,
            value: number
        }[] = super.createUpdateInfo(piece, dif);

        if(Math.abs(dif.file) == 2){
            let file = (dif.file > 0) ? 8 : 1;
            updateInfo.push({
                file: file,
                rank: piece.rank,
                value: 0
            });
            updateInfo.push({
                file: piece.file + (dif.file / 2),
                rank: piece.rank,
                value: this.biService.getIdByPosition({file: file, rank: piece.rank})
            });
        }

        return updateInfo;
    }

    public setSpecialMove(info: {
        "O-O": boolean,
        "O-O-O": boolean
    }) {
        let result = []
        if(info["O-O"]){
            result.push({
                file: 2,
                rank: 0
            })
        }
        if(info["O-O-O"]){
            result.push({
                file: -2,
                rank: 0
            })
        }
        this.castlingBec = result;
    }
}
