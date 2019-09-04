import React from 'react';
import * as Constants from './../constants';
import { Sprite } from '@inlet/react-pixi';

export default ({x, y, type}) => {
    return <Sprite
        x={x*Constants.SCALE}
        y={y*Constants.SCALE}
        width={Constants.SCALE}
        height={Constants.SCALE}
        image='brick.png'
        anchor='.5,.5'
    />
}