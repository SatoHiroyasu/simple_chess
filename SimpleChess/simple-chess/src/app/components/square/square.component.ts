import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {
  @Input() checkNum: number;
  public squareColor: string;

  constructor() { }

  ngOnInit(): void {
    this.squareColor = (this.checkNum % 2 == 1) ? "black-square" : "white-square";
  }

}
