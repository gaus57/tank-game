import React from 'react';
import { Sprite } from '@inlet/react-pixi'

const DIRECTION_UP = 0;
const DIRECTION_DOWN = 180*Math.PI/180;
const DIRECTION_LEFT = 270*Math.PI/180;
const DIRECTION_RIGHT = 90*Math.PI/180;
const DIRECTION_KEYS = {
  'w': DIRECTION_UP,
  's': DIRECTION_DOWN,
  'a': DIRECTION_LEFT,
  'd': DIRECTION_RIGHT,
};

const SPEED = 5;

export default class Tank extends React.Component {
  state = {
    moveKeys: [],
    direction: DIRECTION_UP,
    move: false,
    x: 800,
    y: 400,
  };

  componentDidMount() {
    this.props.app.ticker.add(this.tick);
    window.onkeypress = this.onkeypress;
    window.onkeyup = this.onkeyup;
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick);
    window.removeEventListener('onkeypress', this.onkeypress)
    window.removeEventListener('onkeyup', this.onkeyup)
  }

  onkeypress = (e) => {
    let { moveKeys } = this.state;
    if (DIRECTION_KEYS[e.key] !== undefined && !moveKeys.includes(e.key)) {
      moveKeys.push(e.key)
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
  };

  onkeyup = (e) => {
    let { moveKeys } = this.state;
    if (moveKeys.includes(e.key)) {
      moveKeys.splice(moveKeys.indexOf(e.key), 1)
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
  };

  changeDirection = () => {
    if (this.state.moveKeys.length) {
      this.setState(({moveKeys}) => ({
        direction: DIRECTION_KEYS[moveKeys[moveKeys.length - 1]],
        move: true,
      }));
    } else {
      this.setState(() => ({
        move: false,
      }));
    }
  };

  tick = delta => {
    if (this.state.move) {
      switch (this.state.direction) {
        case DIRECTION_UP:
          this.setState(({ y }) => ({
            y: y - SPEED * delta,
          }));
          break;
        case DIRECTION_DOWN:
          this.setState(({ y }) => ({
            y: y + SPEED * delta,
          }));
          break;
        case DIRECTION_LEFT:
          this.setState(({ x }) => ({
            x: x - SPEED * delta,
          }));
          break;
        case DIRECTION_RIGHT:
          this.setState(({ x }) => ({
            x: x + SPEED * delta,
          }));
          break;
      }
    }
  };

  render() {
    const props = this.props;
    const { x, y, direction: rotation } = this.state;

    return <Sprite {...props} {...{ x, y, rotation }} image='tank.png' width={78} height={200} pivot='38,100' />
  }
}