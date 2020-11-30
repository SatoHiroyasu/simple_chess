import { PiecesMaster } from './pieces-master';
import { Piece } from '../game-master.service';

export class Knight extends PiecesMaster{
    constructor(piece: Piece){
        super(piece);
    }

    protected setBectorsInfo() {
        const bectors = [
            {
                file: 2,
                rank: 1
            },
            {
                file: 1,
                rank: 2
            },
            {
                file: -1,
                rank: 2
            },
            {
                file: -2,
                rank: 1
            },
            {
                file: -2,
                rank: -1
            },
            {
                file: -1,
                rank: -2
            },
            {
                file: 1,
                rank: -2
            },
            {
                file: 2,
                rank: -1
            }
        ]

        this.bectorInfo = {
            bectors: bectors,
            infinite: false
        };
    }
}
