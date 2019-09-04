import React from 'react';
import * as Constants from './../constants';
import { Sprite } from '@inlet/react-pixi';

const ROTATION = {
  [Constants.DIRECTION_UP]: 0,
  [Constants.DIRECTION_DOWN]: 180*Math.PI/180,
  [Constants.DIRECTION_LEFT]: 270*Math.PI/180,
  [Constants.DIRECTION_RIGHT]: 90*Math.PI/180,
};
const SPEED = .2;

export default class Tank extends React.Component {
  componentDidMount() {
    this.props.app.ticker.add(this.tick);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick);
  }

  tick = delta => {
    const { data, setData, canMove } = this.props;
    const {x, y, direction, move} = data;
    if (move || x%1 !== 0 || y%1 !== 0) {
      const change = {};
      if (move && move !== direction) {
        if (
          (x%1 === 0 && y%1 === 0)
          || (move === Constants.DIRECTION_DOWN && direction === Constants.DIRECTION_UP)
          || (move === Constants.DIRECTION_UP && direction === Constants.DIRECTION_DOWN)
          || (move === Constants.DIRECTION_LEFT && direction === Constants.DIRECTION_RIGHT)
          || (move === Constants.DIRECTION_RIGHT && direction === Constants.DIRECTION_LEFT)
        ) {
          change.direction = move;
        }
      }
      switch (change.direction || direction) {
        case Constants.DIRECTION_UP:
          change.y = y - SPEED * delta;
          break;
        case Constants.DIRECTION_DOWN:
          change.y = y + SPEED * delta;
          break;
        case Constants.DIRECTION_LEFT:
          change.x = x - SPEED * delta;
          break;
        case Constants.DIRECTION_RIGHT:
          change.x = x + SPEED * delta;
          break;
      }
      if (move !== direction) {
        if (change.x !== undefined && Math.ceil(change.x) !== Math.ceil(x)) {
          const xMove = change.x < x ? Math.floor(x) : Math.ceil(x);
          const dif = Math.abs(change.x - xMove);
          change.x = xMove;
          // switch (move) {
          //   case Constants.DIRECTION_UP:
          //     change.y = y - dif;
          //     break;
          //   case Constants.DIRECTION_DOWN:
          //     change.y = y + dif;
          // }
          if (move) {
            change.direction = move;
          }
        } else if (change.y !== undefined && Math.ceil(change.y) !== Math.ceil(y)) {
          const yMove = change.y < y ? Math.floor(y) : Math.ceil(y);
          const dif = Math.abs(change.y - yMove);
          change.y = yMove;
          // switch (move) {
          //   case Constants.DIRECTION_LEFT:
          //     change.x = x - dif;
          //     break;
          //   case Constants.DIRECTION_RIGHT:
          //     change.x = x + dif;
          //     break;
          // }
          if (move) {
            change.direction = move;
          }
        }
      }
      if (change.x !== undefined && Math.floor(change.x) !== Math.floor(x)) {
        if (change.x > x) {
          for (let i = Math.floor(x) + 3; i <= Math.floor(change.x)+2; i++) {
            if (!canMove(y, i) || !canMove(y+1, i) || !canMove(y+2, i) || !canMove(y+3, i)) {
              change.x = i+1;
              break;
            }
          }
        } else {
          for (let i = Math.floor(x) - 3; i >= Math.floor(change.x)-2; i--) {
            if (!canMove(y, i) || !canMove(y+1, i) || !canMove(y+2, i) || !canMove(y+3, i)) {
              change.x = i+3;
              break;
            }
          }
        }
      } else if (change.y !== undefined && Math.floor(change.y) !== Math.floor(y)) {
        if (change.y > y) {
          for (let i = Math.floor(y) + 3; i <= Math.floor(change.y)+2; i++) {
            if (!canMove(i, x) || !canMove(i, x+1) || !canMove(i, x+2) || !canMove(i, x+3)) {
              change.y = i+1;
              break;
            }
          }
        } else {
          for (let i = Math.floor(y) - 3; i >= Math.floor(change.y)-2; i--) {
            if (!canMove(i, x) || !canMove(i, x+1) || !canMove(i, x+2) || !canMove(i, x+3)) {
              change.y = i+3;
              break;
            }
          }
        }
      }
      setData(change);
    }
  };

  render() {
    const { x, y, direction } = this.props.data;
    const rotation = ROTATION[direction];

    return <Sprite
      {
        ...{
          x: x*Constants.SCALE,
          y: y*Constants.SCALE,
          rotation
        }
      }
      image='tank-2.png'
      width={4*Constants.SCALE}
      height={4*Constants.SCALE}
      anchor='.5,.5'
    />
  }
}