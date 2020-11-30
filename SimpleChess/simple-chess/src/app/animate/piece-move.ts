import {
    animation, trigger, animateChild, group,
    transition, animate, style, query, state
  } from '@angular/animations';
  
export const pieceMoveAnimation = animation([
    state("before", style({
      left: "{{ left }}px",
      bottom: "{{ bottom }}px"
    }),
    {
      params: {
        "left": 0,
        "bottom": 0
      }
    }),
    state("after", style({
      left: "{{ left }}px",
      bottom: "{{ bottom }}px"
    }),
    {
      params: {
        "left": 0,
        "bottom": 0
      }
    }),
    transition("* => after", [animate("200ms ease-out")]),
    transition("after => *", [animate("0ms")])
  ]);