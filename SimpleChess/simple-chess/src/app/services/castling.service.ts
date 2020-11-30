import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BoardInfoService } from './board-info.service';
import { CheckService } from './check.service';
import { GameMasterService, Piece } from './game-master.service';
import { VirtualMasService } from './virtual-mas.service';

@Injectable({
  providedIn: 'root'
})
export class CastlingService {
  private castlingSub: Subject<string[]>;
  private casAbleSub: Subject<any>;
  private casAble = {
    "white": {
      "O-O": true,
      "O-O-O": true
    },
    "black": {
      "O-O": true,
      "O-O-O": true
    }
  };

  constructor(
    private gmService: GameMasterService,
    private biService: BoardInfoService,
    private cService: CheckService,
    private vmService: VirtualMasService
  ) {
    this.castlingSub = new Subject<string[]>();
    this.casAbleSub = new Subject<any>();
  }

  public getCasSab() {
    return this.castlingSub;
  }

  public nextCas(color: string, cas: string) {
    this.castlingSub.next([color, cas]);
  }
  
  public getCasAbleSub() {
    return this.casAbleSub;
  }

  public nextCasAble() {
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

    this.mergeCasAble(result, this.gmService.getCastlingFlgs());
    this.casAbleSub.next(result);
  }

  public getCasAble(piece: Piece) {
    let result = this.casAble

    result = this.mergeCasAble(result, this.biService.getCastlingFlgs());
    result = this.mergeCasAble(result, this.vmService.getCastlingFlgs(piece));
    result = this.mergeCasAble(result, this.gmService.getCastlingFlgs());

    return result[piece.color];
  }

  public mergeCasAble(ca1, ca2) {
    let result = {
      "white": {
        "O-O": ca1["white"]["O-O"] && ca2["white"]["O-O"],
        "O-O-O": ca1["white"]["O-O-O"] && ca2["white"]["O-O-O"],
      },
      "black": {
        "O-O": ca1["black"]["O-O"] && ca2["black"]["O-O"],
        "O-O-O": ca1["black"]["O-O-O"] && ca2["black"]["O-O-O"],
      }
    }

    return result;
  }
}
