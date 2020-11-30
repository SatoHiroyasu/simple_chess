import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { PiecesComponent } from './components/pieces/pieces.component';
import { SquareComponent } from './components/square/square.component';
import { PromoteMenuComponent } from './components/promote-menu/promote-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PiecesComponent,
    SquareComponent,
    PromoteMenuComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
