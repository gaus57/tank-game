import React from 'react';
import data from './game.json';
import Tank from './components/Tank';
import Wall from './components/Wall';
import Shell from './components/Shell';
import * as Constants from './abstract/constants';
import prepareGame from './helpers/PrepareGameData';
import {AppConsumer, Container, PixiComponent, Stage} from "@inlet/react-pixi";
import {Graphics} from "pixi.js";

const DIRECTION_KEYS = {
  'w': Constants.DIRECTION_UP,
  's': Constants.DIRECTION_DOWN,
  'a': Constants.DIRECTION_LEFT,
  'd': Constants.DIRECTION_RIGHT,
};

const MapBorder = PixiComponent('MapBorder', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, width, height } = props;

    instance.clear();
    instance.beginFill(0x000000);
    instance.drawRect(x*Constants.SCALE - Constants.SCALE / 2, y*Constants.SCALE - Constants.SCALE / 2, width, height);
    instance.endFill();
  },
});

export default class Game extends React.Component {
  state = {
    ...prepareGame(data),
    moveKeys: [],
  };

  componentDidMount() {
    window.onkeypress = this.onkeypress;
    window.onkeyup = this.onkeyup;
  }

  componentWillUnmount() {
    window.removeEventListener('onkeypress', this.onkeypress);
    window.removeEventListener('onkeyup', this.onkeyup);
  }

  currentPlayer = () => {
    return this.state.players[this.state.player];
  };

  changePlayer = (player, change) => {
    this.setState(({players}) => ({
      players: {
        ...players,
        [player]: {
          ...players[player],
          ...change,
        }
      }
    }));
  };

  changeCurrentPlayer = (change) => {
    this.changePlayer(this.state.player, change);
  };

  onkeypress = (e) => {
    let { moveKeys } = this.state;
    if (DIRECTION_KEYS[e.key] !== undefined && !moveKeys.includes(e.key)) {
      moveKeys.push(e.key);
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
    if (e.key === ' ') {
      const player = this.currentPlayer();
      this.shot(player.y, player.x, player.direction);
    }
  };

  onkeyup = (e) => {
    let { moveKeys } = this.state;
    if (moveKeys.includes(e.key)) {
      moveKeys.splice(moveKeys.indexOf(e.key), 1);
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
  };

  changeDirection = () => {
    const {moveKeys} = this.state;
    if (this.state.moveKeys.length) {
      this.changeCurrentPlayer({move: DIRECTION_KEYS[moveKeys[moveKeys.length - 1]]});
    } else {
      this.changeCurrentPlayer({move: null});
    }
  };

  canMove = (y, x, size) => {
    const {top, bottom, left, right, player, players, walls} = this.state;
    let result = true;
    const side = Math.floor(size/2);
    check:
    for (let i = y-side; i <= y+side; i++) {
      for (let j = x-side; j <= x+side; j++) {
        if (
            walls[`${i}.${j}`] !== undefined
            || i < top
            || i > bottom
            || j < left
            || j > right
        ) {
          result = false;
          break check;
        }
        for (const n in players) {
          if (
            n !== player
            && x >= Math.floor(players[n].x-1-side)
            && x <= Math.ceil(players[n].x+1+side)
            && y >= Math.floor(players[n].y-1-side)
            && y <= Math.ceil(players[n].y+1+side)
          ) {
            result = false;
            break check;
          }
        }
      }
    }

    return result;
  };

  shot = (y, x, direction) => {
    this.setState(({shells, shellIndex}) => ({
        shells: {
          ...shells,
          [shellIndex]: {y, x, direction},
        },
        shellIndex: shellIndex+1,
    }))
  };

  hit = (shell, y, x) => {
      this.setState(({shells, walls}) => {
          delete walls[`${y}.${x}`];
          delete shells[shell];

          return {shells, walls};
      });
  };

  render() {
    const { width, height } = this.props;
    const { players, walls, shells, top, bottom, left, right } = this.state;
    const playersArr = Object.entries(players);
    const shellsArr = Object.entries(shells);
    const mapWidth = (right - left + 1) * Constants.SCALE;
    const mapHeight = (bottom - top + 1) * Constants.SCALE;
    const currentPlayer = this.currentPlayer();

    const wallsArr = [];
    for (const key in walls) {
      wallsArr.push(<Wall {...walls[key]} key={key} />)
    }

    return <Stage width={width} height={height} options={{ backgroundColor: 0x333333 }}>
      <Container position={[(left - currentPlayer.x) * Constants.SCALE + width / 2, (top - currentPlayer.y) * Constants.SCALE + height / 2]}>
        <MapBorder x={left} y={top} width={mapWidth} height={mapHeight} />
        {playersArr.map(([index, player]) => <AppConsumer key={index}>
          {app => <Tank
            app={app}
            data={player}
            canMove={this.canMove}
            setData={(change) => {
              this.changePlayer(index, change);
            }}
          />}
        </AppConsumer>)}
        {shellsArr.map(([index, shell]) => <AppConsumer key={index}>
            {app => <Shell
                key={index}
                {...shell}
                app={app}
                index={index}
                canMove={this.canMove}
                hit={this.hit}
                setData={(change) => {
                    this.setState(({shells}) => ({shells: {...shells, [index]: {...shell, ...change}}}))
                }}
            />}
        </AppConsumer>)}
        {wallsArr}
      </Container>
    </Stage>
  }
}