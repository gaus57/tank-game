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
            while (true) {
                const stepPosX = result.posX > this.posX
                    ? this.posX + 1
                    : this.posX - 1;
                const area = game.getArea(stepPosX, this.posY);
                if (area && !area.canBeMoved(this)) {
                    result.posX = stepPosX;
                    game.hit(area, this);
                    break;
                }
                if (Math.floor(result.posX) === Math.floor(stepPosX)) {
                    break;
                }
            }
        } else if (result.posY !== undefined && Math.floor(result.posY) !== Math.floor(this.posY)) {
            while (true) {
                const stepPosY = result.posY > this.posY
                    ? this.posY + 1
                    : this.posY - 1;
                const area = game.getArea(this.posX, stepPosY);
                if (area && !area.canBeMoved(this)) {
                    result.posY = stepPosY;
                    game.hit(area, this);
                    break;
                }
                if (Math.floor(result.posY) === Math.floor(stepPosY)) {
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