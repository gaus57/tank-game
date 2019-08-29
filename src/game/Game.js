import React from 'react';
import data from './game'
import Tank from './components/Tank'
import * as Constants from './constants'
import {AppConsumer, Container, Stage} from "@inlet/react-pixi";

const DIRECTION_KEYS = {
  'w': Constants.DIRECTION_UP,
  's': Constants.DIRECTION_DOWN,
  'a': Constants.DIRECTION_LEFT,
  'd': Constants.DIRECTION_RIGHT,
};

export default class Game extends React.Component {
  state = {
    ...data,
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
          direction: DIRECTION_KEYS[moveKeys[moveKeys.length - 1]],
          move: true,
        }
      }));
    } else {
      this.setState(({player}) => ({
        player: {
          ...player,
          move: false,
        },
      }));
    }
  };

  render() {
    const { width, height } = this.props;
    const { player } = this.state;

    return <Stage width={width} height={height}>
      <Container>
        <AppConsumer>
          {app => <Tank app={app} data={player} setData={(change) => {this.setState(({player}) => ({player: {...player, ...change}}))}} />}
        </AppConsumer>
      </Container>
    </Stage>
  }
}