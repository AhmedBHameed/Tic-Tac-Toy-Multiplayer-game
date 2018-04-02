import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

import { TictacService } from '../../services/tictac.service';

declare let io: any;
@Component({
  selector: 'app-firstcomponent',
  templateUrl: './firstcomponent.component.html',
  styleUrls: ['./firstcomponent.component.css'],
  providers: [ TictacService ]
})
export class FirstcomponentComponent implements OnInit, AfterViewInit {
  // Controll variables

  // To disable name field after applay for the game.
  isGameInitiated: boolean = null;
  // When you get a partner form the server.
  isGameStarted: boolean = false;
  // Is the player applied to the game
  isApplied: boolean = false;

  // Server variables SO DONT WORRY ABOUT THEM
  socket: any;
  playersCount: number;
  player1 = {
    name: null,
    nextPos: null,
    message: null,
    isThere: {
      winner: false,
      winnerId: null
    },
    isConnected: null,
    myTurn: null,
    sourceIp: null,
    distinationIp: null
  };
  player2 = {
    name: null 
  };

  // Game variables
  p1: any = {
    ticker: 'X',
    score: 0
  };
  p2: any = {
    ticker: 'O',
    score: 0
  };
  board: Array<Array<string>> = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  messages: Array<string> = [];

  constructor(private el: ElementRef, private tictacservice: TictacService) { }

  ngOnInit() {
    this.player1.sourceIp = this.tictacservice.uuidv4();
    this.player1.isConnected = true;
    this.socket = io('http://localhost:3000/');

    this.socket.on('serverInformations', (count: number) => {
      this.playersCount = count;
    });

    this.socket.on('gameInitialize', (players: any) => {
      // This is when there is no player on the server.
      if (typeof players == 'string') {
        alert(players);
        return;
      }
      if (!this.isGameStarted && this.player1.name) {
        if ( (this.player1.sourceIp == players.p1.sourceIp) ) {
          this.isGameStarted = true;
          this.player2.name = players.p2.name;
          this.player1.distinationIp = players.p2.sourceIp;
          this.player1.myTurn = true;
        } else if ( (this.player1.sourceIp == players.p2.sourceIp) ) {
          this.isGameStarted = true;
          this.player2.name = players.p1.name;
          this.player1.distinationIp = players.p1.sourceIp;
        }
        this.isGameInitiated = true;
      }
    });

    this.socket.on('game', (nextPlayer: any) => {
      // First condition is to check if there is another player wnats to play
      if (nextPlayer.distinationIp == this.player1.sourceIp) {
        // Second condition check if the second player lost his connection.
        if (nextPlayer.isConnected) {

          // Get the next move of the opposite player.
          if (!nextPlayer.isThere.winner && (nextPlayer.nextPos != null) ) {
            this.paintSequare(nextPlayer.nextPos[0], nextPlayer.nextPos[1], true);
          }

          // To send messages between players.
          if (nextPlayer.message != null) {
            this.showMessageOnChat(nextPlayer.message, false);
          }
        } else {
          this.youWin(this.player2.name + ' lost hist connection');
        }
      }
    });

    window.addEventListener('unload', () =>{
      this.player1.isConnected = false;
      this.socket.emit('game', this.player1);
    })
  }
  ngAfterViewInit() {
    this.selectPlayerColor('X');
  }
  startTheGame() {
    if (this.player1.name) {
      this.isApplied = true;
      this.socket.emit('gameInitialize', this.player1);
    } else {
      alert('Write your name first!');
    }
  }
  send() {
    this.player1.nextPos = null;
    this.socket.emit('game', this.player1);
    this.showMessageOnChat(this.player1.message, true);
    this.player1.message = '';
  }
  showMessageOnChat(message: string, isMyMessage: boolean) {
    if (isMyMessage) {
      this.messages.unshift(this.player1.name + ': ' + message);
    } else {
      this.messages.unshift(this.player2.name + ': ' + message);
    }
  }
  selectPlayerColor(color: string) {
    if (color == 'X') {
      this.p1.ticker = color;
      this.p2.ticker = 'O';
      this.el.nativeElement.querySelector('.X').style.transform = 'scale(1.3)';
      this.el.nativeElement.querySelector('.O').style.transform = 'scale(1)';
    } else {
      this.p1.ticker = color;
      this.p2.ticker = 'X';
      this.el.nativeElement.querySelector('.O').style.transform = 'scale(1.3)';
      this.el.nativeElement.querySelector('.X').style.transform = 'scale(1)';
    }
  }
  paintSequare(row: number, col: number, isNextPlayer: boolean = false) {

    if ( this.board[row][col] == null ) {
      if (isNextPlayer) {
        this.board[row][col] = this.p2.ticker;
        this.player1.nextPos = [row, col];
        this.el.nativeElement.querySelector('.seq-' + row + '-' + col).classList.add(this.p2.ticker);
        // Player 2 is the winner
        if( this.tictacservice.checkForWinner(this.board, this.p2.ticker) ) {
          this.youLose();
        } else {
          this.checkIfTie();
        }
        // No need to send anything because we already recived the next move.
        this.player1.myTurn = !this.player1.myTurn;
      } else if (this.player1.myTurn) {
        this.board[row][col] = this.p1.ticker;
        this.player1.nextPos = [row, col];
        this.el.nativeElement.querySelector('.seq-' + row + '-' + col).classList.add(this.p1.ticker);
        // Because we need to send the current play of the player 1
        this.socket.emit('game', this.player1);
        // Player 1 is the winner
        if( this.tictacservice.checkForWinner(this.board, this.p1.ticker) ) {
          ++this.p1.score;
          this.youWin();
        } else {
          this.checkIfTie();
        }
        this.player1.myTurn = !this.player1.myTurn;
      }
    }
  }
  gameReset() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = null;
        this.el.nativeElement.querySelector('.seq-' + i + '-' + j).classList.remove('X');
        this.el.nativeElement.querySelector('.seq-' + i + '-' + j).classList.remove('O');
      }
    }
    this.player1.nextPos = null;
    this.player1.isThere.winner = false;
    this.player1.isThere.winnerId = null;
  }
  checkIfTie() {
    let TIE = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == null) {
          TIE = false;
        }
      }
    }
    if (TIE) {
      setTimeout( () => {
          alert('TIE!');
          this.gameReset();
      }, 500);
    }
  }
  youWin( reason: string = null) {
    if (reason != null) {
      // Make the player apply for another partener.
      alert('You win the game ^-^. ' + reason);
      this.gameOver();
    } else {
      setTimeout( () => {
        this.player1.isThere.winner = true;
        this.player1.isThere.winnerId = this.p1.sourceIp;
        this.socket.emit('game', this.player1);
        alert('You win the game ^-^');
        this.gameReset();
      }, 300);
    }
  }
  youLose() {
    setTimeout( () => {
      this.player1.isThere.winner = true;
      this.player1.isThere.winnerId = this.p1.distinationIp;
      alert('You lost the game :(');
      this.gameReset();
    }, 300);
  }
  gameOver() {
    alert('game over');
  }


}
