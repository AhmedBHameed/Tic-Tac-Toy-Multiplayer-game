import { Injectable } from '@angular/core';

@Injectable()
export class TictacService {

  constructor() { }
  uuidv4() {
      return 'xxxxxyxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }
  checkForWinner(tictacArr: Array<Array<string>>, ticker: string): boolean {
    let backCrose: boolean = true,
        forwardCrose: boolean = true,
        h_row_1: boolean = true,
        h_row_2: boolean = true,
        h_row_3: boolean = true,
        v_col_1: boolean = true,
        v_col_2: boolean = true,
        v_col_3: boolean = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i == j) {
          if ( (tictacArr[i][j] == ticker) && backCrose ) {
            backCrose = true;
          } else {
            backCrose = false;
          }
        }
        if (i + j == 2) {
          if ( (tictacArr[i][j] == ticker) && forwardCrose ) {
            forwardCrose = true;
          } else {
            forwardCrose = false;
          }
        }
        if ( i == 0 ) {
          if ( (tictacArr[i][j] == ticker) && h_row_1 ) {
            h_row_1 = true;
          } else {
            h_row_1 = false;
          }
        } 
        if (i == 1) {
          if ( (tictacArr[i][j] == ticker) && h_row_2 ) {
            h_row_2 = true;
          } else {
            h_row_2 = false;
          }
        } 
        if (i == 2) {
          if ( (tictacArr[i][j] == ticker) && h_row_3 ) {
            h_row_3 = true;
          } else {
            h_row_3 = false;
          }
        }
        if (j == 0) {
          if ( (tictacArr[i][j] == ticker) && v_col_1 ) {
            v_col_1 = true;
          } else {
            v_col_1 = false;
          }
        }
        if (j == 1) {
          if ( (tictacArr[i][j] == ticker) && v_col_2 ) {
            v_col_2 = true;
          } else {
            v_col_2 = false;
          }
        }
        if (j == 2) {
          if ( (tictacArr[i][j] == ticker) && v_col_3 ) {
            v_col_3 = true;
          } else {
            v_col_3 = false;
          }
        }
      }
    }
    return backCrose || forwardCrose || h_row_1 || h_row_2 || h_row_3 || v_col_1 || v_col_2 || v_col_3;
  }

}
