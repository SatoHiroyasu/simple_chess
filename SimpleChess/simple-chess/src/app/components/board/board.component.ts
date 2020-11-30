import { Component, OnInit } from '@angular/core';
import { Piece } from 'src/app/services/game-master.service';
import { PiecesInfoService } from 'src/app/services/pieces-info.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public squaresNum: number[][] = [[]];
  public pieces: Piece[];

  constructor(private piService: PiecesInfoService) { }

  ngOnInit(): void {
    this.setSquares();
    this.pieces = this.piService.getAllPieces();
  }

  private setSquares() {
    for(let i = 0; i < 8; i++){
      this.squaresNum.push([]);
      for(let j = 0; j < 8; j++){
        this.squaresNum[i].push(i + j);
      }
    }
  }
}
