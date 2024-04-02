/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './board.css';

//React libs
import React from 'react';
import ReactDOM from 'react-dom/client';

//React bootstrap components
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

console.log('Loaded');

//Props for TicTacToe component
export interface TicTacToeProps {
  id?: string;
  darkMode?: boolean;
}

//Main TicTacToe game component
export default class TicTacToe extends React.Component<TicTacToeProps> {
  state: {
    size: number,
    currentPlayer: number,
    isPlaying: boolean,
    currentMove: number,
    isWinning: boolean,
    isDraw: boolean,
    winningPlayer: number | null,
    darkMode?: boolean
  }

  constructor(props: TicTacToeProps) {
    super(props);
    this.state = {
      size: 3,
      currentPlayer: 1,
      winningPlayer: null,
      isPlaying: false,
      currentMove: 1,
      isWinning: false,
      isDraw: false,
      darkMode: props.darkMode === undefined ? window.matchMedia('(prefers-color-scheme: dark)').matches : props.darkMode //either use the prop or the standard dark mode indicator
    };
    //Change dark mode state when the OS changes the dark mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.setState({ darkMode: e.matches });
    });
  }

  //Increase function for the board size
  private increase = () => {
    if (this.state.size < 8) {
      this.setState({ size: this.state.size + 1 });
    }
  };

  //Decrease function for the board size
  private decrease = () => {
    if (this.state.size > 3) {
      this.setState({ size: this.state.size - 1 });
    }
  };

  private closeWinningModal = () => {
    this.setState({ isWinning: false });
    this.setState({ winningPlayer: null });
  }

  private closeDrawModal = () => {
    this.setState({ isDraw: false });
    this.setState({ winningPlayer: null });
  }

  //Flips between active and disabled board
  private changePlayingState = () => {
    for (let i = 0; i < this.state.size; i++) {
      for (let j = 0; j < this.state.size; j++) {
        if (this.state.isPlaying) {
          document.getElementById(i.toString() + '-' + j.toString()).innerHTML = '⮽';
        } else {
          document.getElementById(i.toString() + '-' + j.toString()).innerHTML = ' ';
        }
      }
    }
    //Flips the state
    this.setState({ isPlaying: !this.state.isPlaying });
    //Resets the current player
    this.setState({ currentPlayer: 1 });
    //Resets move count
    this.setState({ currentMove: 1 });
  };

  private checkWinning = (i: number, j: number, mark: string) => {
    var isWinning = false;
    //Diagnol \ check
    if (i === j) {
      isWinning = true;
      for (let k = 0, l = 0; k < this.state.size && l < this.state.size; k++, l++) {
        if (document.getElementById(k.toString() + '-' + l.toString()).innerHTML !== mark) {
          isWinning = false;
          break;
        }
      }
    }
    //Diagnol / check
    if ((isWinning === false) && ((i + j) === (this.state.size - 1))) {
      isWinning = true;
      for (let k = 0, l = this.state.size - 1; k < this.state.size && l >= 0; k++, l--) {
        if (document.getElementById(k.toString() + '-' + l.toString()).innerHTML !== mark) {
          isWinning = false;
          break;
        }
      }
    }
    //Vertical check
    if (isWinning === false) {
      isWinning = true;
      for (let k = 0; k < this.state.size; k++) {
        if (document.getElementById(k.toString() + '-' + j.toString()).innerHTML !== mark) {
          isWinning = false;
          break;
        }
      }
    }
    //Horizontal check
    if (isWinning === false) {
      isWinning = true;
      for (let l = 0; l < this.state.size; l++) {
        if (document.getElementById(i.toString() + '-' + l.toString()).innerHTML !== mark) {
          isWinning = false;
          break;
        }
      }
    }
    return isWinning;
  }

  private handleMove = (e: React.SyntheticEvent) => {
    //If the current position is already filled, do nothing
    if (e.currentTarget.innerHTML !== ' ') { return; }

    //Displays the move
    if (this.state.currentPlayer === 1) {
      e.currentTarget.innerHTML = '❌';
    } else {
      e.currentTarget.innerHTML = '⭕';
    }

    //Get the current move position
    let i = parseInt(e.currentTarget.id.split('-')[0]);
    let j = parseInt(e.currentTarget.id.split('-')[1]);

    //Wining case handling
    if (this.checkWinning(i, j, e.currentTarget.innerHTML)) {
      this.setState({ winningPlayer: this.state.currentPlayer });
      this.setState({ isWinning: true });
      this.changePlayingState();
      return;
    } else {
      //Switch to the next player
      this.setState({ currentPlayer: this.state.currentPlayer === 1 ? 2 : 1 });
    }

    //Quickly determine a draw case
    this.setState({ currentMove: this.state.currentMove + 1 });
    if (this.state.currentMove === this.state.size * this.state.size) {
      this.setState({ isDraw: true });
      this.changePlayingState();
      return;
    }
  };

  render() {
    return (
      <div
        data-bs-theme={this.state.darkMode ? 'dark' : 'light'}
        className='bg-body'>
        <Button
          variant={this.state.darkMode ? 'light' : 'dark'}
          className='position-absolute top-1 end-0 translate-middle theme-btn'
          onClick={() => { window.mainDarkMode.toggle(); }}>
          {this.state.darkMode ? '☼' : '☾'}
        </Button>
        <Stack gap={3}>
          <h1 className='mx-auto not-selectable text-body'>
            Quan's TicTacToe
          </h1>
          <Stack
            direction="horizontal"
            gap={3}
            className='mx-auto'>
            <h1 className={'not-selectable ' + (this.state.isPlaying ? (this.state.currentPlayer === 1 ? 'text-primary' : 'text-muted') : 'text-body')}>
              ❌Player 1
            </h1>
            <Button
              variant={this.state.isPlaying ? 'danger' : 'success'}
              size="lg"
              onClick={this.changePlayingState}
              className='fs-3'>
              {this.state.isPlaying ? 'Stop!' : 'Play!'}
            </Button>
            <h1 className={'not-selectable ' + (this.state.isPlaying ? (this.state.currentPlayer === 2 ? 'text-primary' : 'text-muted') : 'text-body')}>
              Player 2⭕
            </h1>
          </Stack>
          <Container>
            {Array.from({ length: this.state.size }).map((_, i) => (
              <Row
                key={i}
                xs={1}
                md={1}>
                {Array.from({ length: this.state.size }).map((_, j) => (
                  <Col key={j}>
                    <Button
                      id={i.toString() + '-' + j.toString()}
                      size='lg'
                      disabled={!this.state.isPlaying}
                      onClick={this.handleMove}
                      className='board-btn fs-1 bg-transparent text-body'>⮽</Button>
                  </Col>
                ))}
              </Row>
            ))}
          </Container>
          <Stack
            gap={3}
            className='mx-auto'>
            <Stack
              direction='horizontal'
              gap={3}>
              <Stack
                direction='horizontal'
                gap={3}>
                <Button
                  onClick={this.decrease}
                  disabled={this.state.isPlaying}
                  className='fs-3'>-</Button>
                <h3 className='not-selectable text-body'>
                  Board Size: {this.state.size}
                </h3>
                <Button
                  onClick={this.increase}
                  disabled={this.state.isPlaying}
                  className='fs-3'>+</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Modal
          name='winning'
          show={this.state.isWinning}
          onHide={this.closeWinningModal}
          centered
          data-bs-theme={this.state.darkMode ? 'dark' : 'light'}>
          <Modal.Header closeButton>
            <Modal.Title className='text-body'>
              We have a winner!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1 className='text-center text-body'>
              🎉 Player {this.state.winningPlayer} wins! 🎉
            </h1>
          </Modal.Body>
          <Modal.Footer className='mx-auto'>
            <Button
              variant="success"
              size='lg'
              onClick={this.closeWinningModal}>
              Try again
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          name='draw'
          show={this.state.isDraw}
          onHide={this.closeDrawModal}
          centered
          data-bs-theme={this.state.darkMode ? 'dark' : 'light'}>
          <Modal.Header closeButton>
            <Modal.Title className='text-body'>
              We have a draw...
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1 className='text-center text-body'>
              This game is a draw...
            </h1>
          </Modal.Body>
          <Modal.Footer className='mx-auto'>
            <Button
              variant="primary"
              size='lg'
              onClick={this.closeDrawModal}>
              Try again
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TicTacToe />
  </React.StrictMode >);