import { Component, OnInit, Input } from '@angular/core';
import { useAnimation, transition, trigger, style, animate, state, query } from '@angular/animations';
import { GameMasterService, Piece, PiecesDisplay, PiecesNumber } from 'src/app/services/game-master.service';
import { PieceRuleService } from "src/app/services/piece-rule.service";
import { PiecesMaster } from 'src/app/services/pieces/pieces-master';
import { Subscription } from 'rxjs';
import { BoardInfoService } from 'src/app/services/board-info.service';
import { CheckService } from 'src/app/services/check.service';
import { VirtualMasService } from 'src/app/services/virtual-mas.service';
import { CastlingService } from 'src/app/services/castling.service';
import { pieceMoveAnimation } from 'src/app/animate/piece-move';
import { PiecesInfoService } from 'src/app/services/pieces-info.service';

const ANIMATE_TIMING = "200ms ease-out";

@Component({
  selector: 'pieces',
  templateUrl: './pieces.component.html',
  animations: [
    trigger("pieceMove", 
      [
        state(
          "before",
          style({
            left: "{{ left }}px",
            bottom: "{{ bottom }}px"
          }),
          {
            params: {
              "left": 0,
              "bottom": 0
            }
          }
        ),
        state(
          "after",
          style(
            {
              left: "{{ left }}px",
              bottom: "{{ bottom }}px"
            }
          ),
          {
            params: {
              "left": 0,
              "bottom": 0
            }
          }
        ),
        transition("* => after", [animate(ANIMATE_TIMING)]),
        transition("after => *", [animate("0ms")])
      ]
    ),
    trigger("pieceTaken",
      [
        state(
          "alive",
          style({
            opacity: 1
          })
        ),
        state(
          "taken",
          style({
            opacity: 0
          })
        ),
        transition("alive => taken",[animate(ANIMATE_TIMING)])
      ]
    )
  ],
  styleUrls: ['./pieces.component.scss']
})
export class PiecesComponent implements OnInit {
  @Input() piece: Piece;

  public pieceStyle: {
    left: number,
    bottom: number
  };
  public display: string;
  public displayClass: string;
  public pieceMaster: PiecesMaster;
  private moveAbleSquares: {
    file: number,
    rank: number
  }[];
  private dMas: {
    file: number,
    rank: number
  }[];
  public masStyles: {
    left: number,
    bottom: number
  }[];
  public focused: boolean = false;
  private currentTurn: string;
  public isMyturn: boolean;
  private takenIdSubsc: Subscription;
  public isTaken: boolean = false;
  public check: boolean = false;
  public casNames;
  public casFlgs;
  private casMas;
  private dCasMas;
  public casStyles;
  public promoteFocused = false;
  private promoteMas: {
    file: number,
    rank: number
  };
  public promoteStyle = {
    left: 0,
  }
  public pieceMove: {
    value: string,
    params: {
      left: number,
      bottom: number
    }
  };
  public pieceTaken: string;

  constructor(
    private gmService: GameMasterService,
    private prService: PieceRuleService,
    private piService: PiecesInfoService,
    private biService: BoardInfoService,
    private cService: CheckService,
    private vmService: VirtualMasService,
    private casService: CastlingService
  ) { }

  ngOnInit(): void {
    this.subscribeTakenId();
    this.setIsMyTurn();
    if(this.piece.name == "king"){
      this.subscribeCheck();
      this.setCastling();
    }else if(this.piece.name == "rook"){
      this.subscribeCas();
    }
    this.pieceMaster = this.gmService.getPieceMaster(this.piece, this.biService);
    this.setMoveAbleSquares();
    this.setStyles();
    this.setDisplay();
    this.pieceTaken = "alive";
  }

  private subscribeTakenId() {
    this.takenIdSubsc = this.biService.getTakenIdSub().subscribe(takenId => {
      if(takenId == this.piece.id){
        this.pieceTaken = "taken";
        this.piService.spliceTakenPiece(takenId);
        setTimeout(() => {
          // this.piService.spliceTakenPiece(takenId);
          this.isTaken = true;
          this.takenIdSubsc.unsubscribe();
        }, 200);
      }else {
        setTimeout(() => {
          this.updateMas();
        }, 200);
      }
    }, error => {
      console.error(error)
    })
  }

  private updateMas() {
    if(this.piece.name == "king"){
      this.updateCastling();
    }
    this.pieceMaster.updateBectorInfo(this.piece);
    this.setMoveAbleSquares();
    this.setIsMyTurn();
    if(this.isMyturn){
      this.moveAbleSquares = this.vmService.getMasWithoutCheck(this.piece, this.moveAbleSquares);
      this.setMasStyle();
    }else {
      this.check = false;
      this.cService.nextCheckSub(this.moveAbleSquares);
      
    }
  }


  private subscribeCheck() {
    this.cService.getCheckSub().subscribe(color => {
      this.check = color == this.piece.color;
    })
  }

  private subscribeCas() {
    this.casService.getCasSab().subscribe(info => {
      let file = {
        "O-O": 8,
        "O-O-O": 1
      }

      if(this.piece.color == info[0] && this.piece.file == file[info[1]]){
        let mas;
        switch(info[1]){
          case "O-O":
            mas = {
              file: 6,
              rank: this.piece.rank
            };
            break;
          case "O-O-O":
            mas = {
              file: 4,
              rank: this.piece.rank
            };
            break;
        }
        this.piece.file = mas.file;
        this.piece.rank = mas.rank;
        this.pieceMove = {
            value: "after",
            params: this.calcStyle(mas.file, mas.rank)
          };
        setTimeout(() => {
      
          // this.movePiece(dif);
          this.setStyles();
          this.pieceMove = {
            value: "before",
            params: this.pieceStyle
          };
        }, 200);
        this.setMoveAbleSquares();
      }
    })
  }

  public movePiece(dif) {
    // let updateInfo = this.pieceMaster.createUpdateInfo(this.piece, dif);
    this.piece.file = this.piece.file + dif.file;
    this.piece.rank = this.piece.rank + dif.rank;
    this.setStyles();
    // this.biService.noticeMoved(updateInfo);
  }

  public animateMovePiece(mas) {
    let dif = {
      file: mas.left / 60,
      rank: mas.bottom / 60
    }
    if(this.piece.name == "pawn" && (this.piece.rank + dif.rank == 8 || this.piece.rank + dif.rank == 1)){
      this.promoteMas = mas;
      this.promoteStyle.left = mas.left;
      this.promoteMenuEnable();
      return;
    }
    document.getElementById("pieces-wrapper" + this.piece.id).blur();
    let updateInfo = this.pieceMaster.createUpdateInfo(this.piece, dif);
    this.pieceMove = {
      value: "after",
      params: {
        left: this.pieceStyle.left + mas.left,
        bottom: this.pieceStyle.bottom + mas.bottom
      }
    };
    
    this.piece.file = this.piece.file + dif.file;
    this.piece.rank = this.piece.rank + dif.rank;
    this.biService.noticeMoved(updateInfo);
    setTimeout(() => {
      
      // this.movePiece(dif);
      this.setStyles();
      this.pieceMove = {
        value: "before",
        params: this.pieceStyle
      };
    }, 200);
  }

  private setIsMyTurn() {
    this.currentTurn = this.gmService.getCurrentTurn();
    this.isMyturn = (this.currentTurn == this.piece.color);
  }

  private setStyles() {
    this.pieceStyle = this.calcStyle(this.piece.file, this.piece.rank);
  }

  private calcStyle(file: number, rank: number) {
      return {
          left: 60 * (file - 1),
          bottom: 60 * (rank - 1)
      }
  }

  private setDisplay(): void{
    this.display = PiecesDisplay[PiecesNumber[this.piece.name]];
    this.displayClass = this.piece.color == "white" ? "white-display" : "black-display";
  }

  private setMoveAbleSquares() {
    this.moveAbleSquares = this.prService.getMoveAbleSquares(this.piece, this.pieceMaster);
    this.setMasStyle();
  }

  private setMasStyle() {
    this.dMas = [];
    this.masStyles = [];
    for(let mas of this.moveAbleSquares){
      let d = {
        file: mas.file - this.piece.file + 1,
        rank: mas.rank - this.piece.rank + 1
      }
      this.dMas.push(d);
      this.masStyles.push(this.calcStyle(d.file, d.rank));
    }
  }

  private setCastling() {
    if(this.piece.name == "king"){
      this.casNames = ["O-O", "O-O-O"];
      this.casFlgs = {
        "O-O": false,
        "O-O-O": false
      };
      this.casMas = {
        "O-O": {
          file: this.piece.file + 2,
          rank: this.piece.rank
        },
        "O-O-O": {
          file: this.piece.file - 2,
          rank: this.piece.rank
        }
      }
      this.dCasMas = {
        "O-O": {
          file: this.casMas["O-O"].file - this.piece.file + 1,
          rank: this.casMas["O-O"].rank - this.piece.rank + 1
        },
        "O-O-O": {
          file: this.casMas["O-O-O"].file - this.piece.file + 1,
          rank: this.casMas["O-O-O"].rank - this.piece.rank + 1
        }
      }
      this.casStyles = {
        "O-O": this.calcStyle(this.dCasMas["O-O"].file, this.dCasMas["O-O"].rank),
        "O-O-O": this.calcStyle(this.dCasMas["O-O-O"].file, this.dCasMas["O-O-O"].rank)
      }
    }
  }

  public updateCastling() {
    this.casFlgs = this.casService.getCasAble(this.piece);
  }

  public castling(cas: string) {
    this.casService.nextCas(this.piece.color, cas);
    this.animateMovePiece(this.casStyles[cas]);
  }

  public focusedSwitch() {
    this.focused = !this.focused;
  }

  public promoted(name: string) {
    this.piece.name = name;
    this.pieceMaster = this.gmService.getPieceMaster(this.piece, this.biService);
    this.setMoveAbleSquares();
    this.setStyles();
    this.setDisplay();
    this.animateMovePiece(this.promoteMas);
  }

  public promoteMenuEnable() {
    this.promoteFocused = true;
    document.getElementById("promote-menu" + this.piece.id).focus();
  }

  public promoteMenuDisable() {
    if(this.promoteFocused){
      this.promoteFocused = false;
    }
  }
}
