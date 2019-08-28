import React from 'react';
import { Sprite } from '@inlet/react-pixi'

const DIRECTION_UP = 0;
const DIRECTION_DOWN = 180*Math.PI/180;
const DIRECTION_LEFT = 270*Math.PI/180;
const DIRECTION_RIGHT = 90*Math.PI/180;

const SPEED = 5;

export default class Tank extends React.Component {
  state = {
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
    switch (e.key) {
      case 'w':
        this.setState(() => ({
          direction: DIRECTION_UP,
          move: true,
        }));
        break;
      case 'a':
        this.setState(() => ({
          direction: DIRECTION_LEFT,
          move: true,
        }));
        break;
      case 'd':
        this.setState(() => ({
          direction: DIRECTION_RIGHT,
          move: true,
        }));
        break;
      case 's':
        this.setState(() => ({
          direction: DIRECTION_DOWN,
          move: true,
        }));
        break;
    }
  };

  onkeyup = (e) => {
    switch (e.key) {
      case 'w':
      case 'a':
      case 'd':
      case 's':
        this.setState(() => ({
          move: false,
        }));
        break;
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