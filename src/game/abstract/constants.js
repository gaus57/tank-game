// Направления движения
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const OPPOSITE_DIRECTIONS = {
    [DIRECTION_UP]: DIRECTION_DOWN,
    [DIRECTION_DOWN]: DIRECTION_UP,
    [DIRECTION_LEFT]: DIRECTION_RIGHT,
    [DIRECTION_RIGHT]: DIRECTION_LEFT,
};

// Масштаб одной клетки в пикселях
export const SCALE = 20;