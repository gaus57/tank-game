import React from 'react';
import * as Constants from './../constants'
import { Sprite } from '@inlet/react-pixi'

const ROTATION = {
  [Constants.DIRECTION_UP]: 0,
  [Constants.DIRECTION_DOWN]: 180*Math.PI/180,
  [Constants.DIRECTION_LEFT]: 270*Math.PI/180,
  [Constants.DIRECTION_RIGHT]: 90*Math.PI/180,
};
const SPEED = 5;

export default class Tank extends React.Component {
  componentDidMount() {
    this.props.app.ticker.add(this.tick);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick);
  }

  tick = delta => {
    const { data, setData } = this.props;
    if (data.move) {
      const {x, y} = data;
      switch (data.direction) {
        case Constants.DIRECTION_UP:
          setData({
            y: y - SPEED * delta,
          });
          break;
        case Constants.DIRECTION_DOWN:
          setData({
            y: y + SPEED * delta,
          });
          break;
        case Constants.DIRECTION_LEFT:
          setData({
            x: x - SPEED * delta,
          });
          break;
        case Constants.DIRECTION_RIGHT:
          setData({
            x: x + SPEED * delta,
          });
          break;
      }
    }
  };

  render() {
    const { x, y, direction } = this.props.data;
    const rotation = ROTATION[direction];

    return <Sprite {...{ x, y, rotation }} image='tank-2.png' width={100} height={100} anchor='.5,.5' />
  }
}