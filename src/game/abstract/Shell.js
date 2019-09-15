import * as Constants from "./constants";

export default class AbstractShell {
    index = 0;
    speed = 0;
    power = 0;
    posX = 0;
    posY = 0;
    direction = null;

    constructor(params) {
        for (const key in params) {
            if (this.hasOwnProperty(key)) {
                this[key] = params[key];
            }
        }
    }

    /**
     *
     * @param {AbstractGame} game
     * @param {number} delta
     * @returns {Object|null}
     */
    tick = (game, delta) => {
        let result = this._move(this.posX, this.posY, this.direction, this.speed, delta);
        let loop = 0;
        if (result.posX !== undefined && Math.floor(result.posX) !== Math.floor(this.posX)) {
            let prevStepPosX = this.posX;
            while (true) {
                const stepPosX = result.posX > this.posX
                    ? prevStepPosX + 1
                    : prevStepPosX - 1;
                const area = game.getArea(stepPosX, this.posY);
                if (area && !area.canBeMoved(this)) {
                    result = null;
                    game.hit(area, this);
                    break;
                }
                if (Math.floor(result.posX) === Math.floor(stepPosX)) {
                    break;
                }
                prevStepPosX = stepPosX;
                if (loop++ > 5) {
                    console.log('зацклило');
                    break;
                }
            }
        } else if (result.posY !== undefined && Math.floor(result.posY) !== Math.floor(this.posY)) {
            let prevStepPosY = this.posY;
            while (true) {
                const stepPosY = result.posY > this.posY
                    ? prevStepPosY + 1
                    : prevStepPosY - 1;
                const area = game.getArea(this.posX, stepPosY);
                if (area && !area.canBeMoved(this)) {
                    result = null;
                    game.hit(area, this);
                    break;
                }
                if (Math.floor(result.posY) === Math.floor(stepPosY)) {
                    break;
                }
                prevStepPosY = stepPosY;
                if (loop++ > 5) {
                    console.log('зацклило');
                    break;
                }
            }
        }

        return result;
    };

    _move(posX, posY, direction, speed, delta) {
        const result = {};
        switch (direction) {
            case Constants.DIRECTION_UP:
                result.posY = posY - speed * delta;
                break;
            case Constants.DIRECTION_DOWN:
                result.posY = posY + speed * delta;
                break;
            case Constants.DIRECTION_LEFT:
                result.posX = posX - speed * delta;
                break;
            case Constants.DIRECTION_RIGHT:
                result.posX = posX + speed * delta;
                break;
            default:
        }

        return result;
    }
}