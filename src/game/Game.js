import React from 'react';
import data from './game.json';
import Tank from './components/Tank';
import Wall from './components/Wall';
import * as Constants from './constants';
import prepareGame from './helpers/PrepareGameData';
import {AppConsumer, Container, Stage} from "@inlet/react-pixi";

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

  render() {
    const { width, height } = this.props;
    const { player, walls } = this.state;
    const wallsArr = [];
    for (const key in walls) {
      wallsArr.push(<Wall {...walls[key]} key={key} />)
    }

    return <Stage width={width} height={height}>
      <Container>
        <AppConsumer>
          {app => <Tank
              app={app}
              data={player}
              setData={(change) => {
                this.setState(({player}) => ({player: {...player, ...change}}))
              }}
          />}
        </AppConsumer>
        {wallsArr}
      </Container>
    </Stage>
  }
}