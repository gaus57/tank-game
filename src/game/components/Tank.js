import React from 'react';
import * as Constants from '../abstract/constants';
import { Sprite } from '@inlet/react-pixi';

const ROTATION = {
    [Constants.DIRECTION_UP]: 0,
    [Constants.DIRECTION_DOWN]: 180*Math.PI/180,
    [Constants.DIRECTION_LEFT]: 270*Math.PI/180,
    [Constants.DIRECTION_RIGHT]: 90*Math.PI/180,
};

export default ({data}) => {
    const { posX, posY, size, direction } = data;
    const rotation = ROTATION[direction];

    return <Sprite
        x={posX*Constants.SCALE}
        y={posY*Constants.SCALE}
        rotation={rotation}
        image='tank-3.png'
        width={size*Constants.SCALE}
        height={size*Constants.SCALE}
        anchor='.5,.5'
    />
}