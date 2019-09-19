import React from 'react';
import * as Constants from '../abstract/constants';
import { Sprite } from '@inlet/react-pixi';

export default ({posX, posY}) => {
    return <Sprite
        x={posX*Constants.SCALE}
        y={posY*Constants.SCALE}
        width={Constants.SCALE}
        height={Constants.SCALE}
        image='brick.png'
        anchor='.5,.5'
    />
}