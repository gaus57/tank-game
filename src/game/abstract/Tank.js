import * as Constants from './constants';

export default class AbstractTank {
    player = '';
    size = 0;
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
        const side = (this.size - 1) / 2;

        return posX >= this.posX - side && posX <= this.posX + side
            && posY >= this.posY - side && posY <= this.posY + side
    };

    shot = () => ({
        posX: this.posX,
        posY: this.posY,
        direction: this.direction,
        speed: 0.5,
        power: this.power,
    });

    /**
     *
     * @param {AbstractGame} game
     * @param {number} delta
     * @returns {Object|null}
     */
    tick = (game, delta) => {
        // console.log('tik tank');
        if (!this.moveDirection && this.posX%1 === 0 && this.posY%1 === 0) {
            return null;
        }

        let result = {};
        if (
            Constants.OPPOSITE_DIRECTIONS[this.moveDirection] === this.direction
            || (this.moveDirection && this.moveDirection !== this.direction && this.posX%1 === 0 && this.posX%1 === 0)
        ) {
            result.direction = this.moveDirection;
        }
        let direction = result.direction || this.direction;
        const areas = this._takenAreas(game, this.posX, this.posY);
        const speed = areas.length > 0
            ? Math.min(...areas.map((area) => area.movedSpeed(this._speed())))
            : this._speed();
        result = {...result, ...this._move(this.posX, this.posY, direction, speed, delta)};
        let loop = 0;
        if (result.posX !== undefined && (Math.floor(result.posX) !== Math.floor(this.posX) || this.posX%1 === 0)) {
            let prevStepPosX = this.posX;
            // console.log('first step x', this.posX, delta, result);
            while (true) {
                let stepPosX = this._nextStep(prevStepPosX, direction);
                const stepAreas = this._takenAreas(game, stepPosX, this.posY);
                if (stepAreas.length > 0 && !stepAreas.reduce((res, area) => res && area.canBeMoved(this), true)) {
                    result.posX = prevStepPosX;
                    // console.log('cantBeMoved x', stepAreas);
                    break;
                }
                if (prevStepPosX%1 === 0 && Math.abs(prevStepPosX - result.posX) < 1) {
                    break;
                }
                if (!this.moveDirection) {
                    result.posX = stepPosX;
                    break;
                }
                delta = Math.abs(delta * (result.posX - stepPosX) / (result.posX - prevStepPosX));
                if (direction !== this.moveDirection) {
                    result.posX = stepPosX;
                    direction = this.moveDirection;
                    result.direction = this.moveDirection;
                    break;
                }
                const stepSpeed = stepAreas.length > 0
                    ? Math.min(...stepAreas.map((area) => area.movedSpeed(this._speed())))
                    : this._speed();
                result = {...result, ...this._move(stepPosX, this.posY, direction, stepSpeed, delta)};
                prevStepPosX = stepPosX;
                // console.log('step x', this.posX, prevStepPosX, delta, result);
                if (loop++ > 10) {
                    console.log('зациклился');
                    break;
                }
            }
        }
        if (result.posY !== undefined && (Math.floor(result.posY) !== Math.floor(this.posY) || this.posY%1 === 0)) {
            // console.log('first step y', this.posY, delta, result);
            let prevStepPosY = this.posY;
            while (true) {
                let stepPosY = this._nextStep(prevStepPosY, direction);
                const stepAreas = this._takenAreas(game, this.posX, stepPosY);
                if (stepAreas.length > 0 && !stepAreas.reduce((res, area) => res && area.canBeMoved(this), true)) {
                    result.posY = prevStepPosY;
                    // console.log('cantBeMoved y', stepAreas);
                    break;
                }
                if (prevStepPosY%1 === 0 && Math.abs(prevStepPosY - result.posY) < 1) {
                    break;
                }
                if (!this.moveDirection) {
                    result.posY = stepPosY;
                    break;
                }
                delta = Math.abs(delta * (result.posY - stepPosY) / (result.posY - prevStepPosY));
                if (direction !== this.moveDirection) {
                    result.posY = stepPosY;
                    direction = this.moveDirection;
                    result.direction = this.moveDirection;
                }
                const stepSpeed = stepAreas.length > 0
                    ? Math.min(...stepAreas.map((area) => area.movedSpeed(this._speed())))
                    : this._speed();
                result = {...result, ...this._move(this.posX, stepPosY, direction, stepSpeed, delta)};
                prevStepPosY = stepPosY;
                // console.log('step y', this.posY, delta, result);
                if (loop++ > 10) {
                    console.log('зациклился');
                    break;
                }
            }
        }

        return result;
    };

    /**
     *
     * @param {AbstractGame} game
     * @param {number} posX
     * @param {number} posY
     * @returns {Array|AbstractArea[]|AbstractTank[]}
     * @private
     */
    _takenAreas = (game, posX, posY) => {
        const side = (this.size - 1) / 2;

        return game.getAreas(posX - side, posY - side, posX + side, posY + side)
            .filter((area => !area instanceof AbstractTank || area.player !== this.player));
    };

    _speed() {
        return this.speed;
    }

    _nextStep(pos, direction) {
        const result = direction === Constants.DIRECTION_RIGHT || direction === Constants.DIRECTION_DOWN
            ? Math.floor(pos + 1)
            : Math.ceil(pos - 1)

        return result === 0 ? 0 : result;
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