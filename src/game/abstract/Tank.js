import * as Constants from 'constants';

export default class AbstractTank {
    size = 1;
    speed = 0;
    helthMax = 0;
    helth = 0;
    power = 0;
    reloadSpeed = 0;
    reload = 0;
    posX = 0;
    posY = 0;
    direction = null;
    moveDirection = null;

    constructor(params) {
        for (const key in params) {
            if (this.hasOwnProperty(key)) {
                this[key] = params[key];
            }
        }
    }

    canBeMoved = (obj) => {
        return false;
    };

    takesPosition = (posX, posY) => {

    };

    /**
     *
     * @param {AbstractGame} game
     * @param {number} delta
     * @returns {Object|null}
     */
    tick = (game, delta) => {
        if (!this.moveDirection && this.posX%1 === 0 && this.posY%1 === 0) {
            return null;
        }

        let result = {};
        const area = game.getArea(this.posX, this.posY);
        const speed = area ? area.movedSpeed(this._speed()) : this._speed();
        if (
            Constants.OPPOSITE_DIRECTIONS[this.moveDirection] === this.direction
            || (this.moveDirection && this.moveDirection !== this.direction && this.posX%1 === 0 && this.posX%1 === 0)
        ) {
            result.direction = this.moveDirection;
        }
        let direction = result.direction || this.direction;
        result = {...result, ...this._move(this.posX, this.posY, direction, speed, delta)};
        if (result.posX !== undefined && Math.floor(result.posX) !== Math.floor(this.posX)) {
            let stepPosX = this._nextStep(this.posX, result.posX);
            delta = Math.abs(delta * (result.posX - stepPosX) / (stepPosX - this.posX))
            result.posX = stepPosX;
            if (direction !== this.moveDirection) {
                direction = this.moveDirection;
                result.direction = this.moveDirection;
            }
            while (true) {
                const stepArea = game.getArea(stepPosX, this.posY);
                if (stepArea && !stepArea.canBeMoved(this)) {
                    break;
                }
                const stepSpeed = stepArea ? stepArea.movedSpeed(this._speed()) : this._speed();
                result = {...result, ...this._move(stepPosX, this.posY, direction, stepSpeed, delta)};
                if (stepPosX === Math.floor(result.posX)) {
                    break;
                }
                const nextStepPosX = this._nextStep(stepPosX, result.posX);
                delta = Math.abs(delta * (result.posX - nextStepPosX) / (nextStepPosX - stepPosX))
                stepPosX = nextStepPosX;
                result.posX = stepPosX;
            }
        } else if (result.posY !== undefined && Math.floor(result.posY) !== Math.floor(this.posY)) {
            let stepPosY = this._nextStep(this.posY, result.posY);
            delta = Math.abs(delta * (result.posY - stepPosY) / (stepPosY - this.posY))
            result.posY = stepPosY;
            if (direction !== this.moveDirection) {
                direction = this.moveDirection;
                result.direction = this.moveDirection;
            }
            while (true) {
                const stepArea = game.getArea(this.posX, stepPosY);
                if (stepArea && !stepArea.canBeMoved(this)) {
                    return result;
                }
                const stepSpeed = stepArea ? stepArea.movedSpeed(this._speed()) : this._speed();
                result = {...result, ...this._move(this.posX, stepPosY, direction, stepSpeed, delta)};
                if (stepPosY === Math.floor(result.posY)) {
                    break;
                }
                const nextStepPosY = this._nextStep(stepPosY, result.posY);
                delta = Math.abs(delta * (result.posY - nextStepPosY) / (nextStepPosY - stepPosY))
                stepPosY = nextStepPosY;
                result.posY = stepPosY;
            }
        }

        return result;
    };

    _speed() {
        return this.speed;
    }

    _nextStep(pos, newPos) {
        return newPos > pos
            ? Math.floor(pos + 1)
            : Math.ceil(pos - 1)
    }

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