import React from 'react';
import data from './game.json';
import Tank from './components/Tank';
import Wall from './components/Wall';
import Shell from './components/Shell';
import * as Constants from './constants';
import prepareGame from './helpers/PrepareGameData';
import {AppConsumer, Container, Stage, Sprite} from "@inlet/react-pixi";

const DIRECTION_KEYS = {
  'w': Constants.DIRECTION_UP,
  's': Constants.DIRECTION_DOWN,
  'a': Constants.DIRECTION_LEFT,
  'd': Constants.DIRECTION_RIGHT,
};

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
      const { player } = this.state;
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
    if (this.state.moveKeys.length) {
      this.setState(({moveKeys, player}) => ({
        player: {
          ...player,
          move: DIRECTION_KEYS[moveKeys[moveKeys.length - 1]],
        }
      }));
    } else {
      this.setState(({player}) => ({
        player: {
          ...player,
          move: null,
        },
      }));
    }
  };

  canMove = (y, x, size) => {
    let result = true;
    const side = Math.floor(size/2);
    check:
    for (let i = y-side; i <= y+side; i++) {
      for (let j = x-side; j <= x+side; j++) {
        if (
            this.state.walls[`${i}.${j}`] !== undefined
            || i < this.state.top
            || i > this.state.bottom
            || j < this.state.left
            || j > this.state.right
        ) {
          result = false;
          break check;
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
    const { player, walls, shells } = this.state;
    const shellsArr = Object.entries(shells);

    const wallsArr = [];
    for (const key in walls) {
      wallsArr.push(<Wall {...walls[key]} key={key} />)
    }

    return <Stage width={width} height={height} options={{ backgroundColor: 0x000000 }}>
      <Container>
        <AppConsumer>
          {app => <Tank
              app={app}
              data={player}
              canMove={this.canMove}
              setData={(change) => {
                this.setState(({player}) => ({player: {...player, ...change}}))
              }}
          />}
        </AppConsumer>
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