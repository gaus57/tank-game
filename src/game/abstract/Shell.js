import * as Constants from "./constants";

export default class AbstractShell {
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
        const result = this._move(this.posX, this.posY, this.direction, this.speed, delta);
        if (result.posX !== undefined && Math.floor(result.posX) !== Math.floor(this.posX)) {

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