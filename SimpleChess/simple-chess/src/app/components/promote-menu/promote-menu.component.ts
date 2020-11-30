import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Piece, PiecesDisplay, PiecesNumber } from 'src/app/services/game-master.service';

@Component({
  selector: 'promote-menu',
  templateUrl: './promote-menu.component.html',
  styleUrls: ['./promote-menu.component.scss']
})
export class PromoteMenuComponent implements OnInit {
  @Input() piece: Piece

  @Output() promoted = new EventEmitter<string>();

  public dispClass: string = "";
  public dispPieces: string[] = [
    "queen",
    "rook",
    "bishop",
    "knight"
  ];

  constructor() { }

  ngOnInit(): void {
    this.dispClass = this.piece.color == "white" ? "white-display" : "black-display";
  }

  public getDisplay(pieceName: string) {
    return PiecesDisplay[PiecesNumber[pieceName]];
  }

  public promote(pieceName: string) {
    this.promoted.emit(pieceName);
  }
}
