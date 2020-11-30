import { PiecesMaster } from './pieces-master';
import { Piece } from '../game-master.service';

export class Queen extends PiecesMaster{
    constructor(piece: Piece){
        super(piece);
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
            infinite: true
        };
    }
}
