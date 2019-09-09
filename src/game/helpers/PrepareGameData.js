
export default function prepareGame(data) {
    const result = {...data};
    for (const key in data.areas) {
        const points = key.split('-');
        const area = data.areas[key];
        if (points.length > 1) {
            const start = points[0].split('.').map(item => Number.parseInt(item));
            const end = points[1].split('.').map(item => Number.parseInt(item));
            for (let posX = start[0]; posX <= end[0]; posX++) {
                for (let posY = start[1]; posY <= end[1]; posY++) {
                    result.areas[posX+'.'+posY] = {...area, posX, posY};
                }
            }
            delete result.areas[key];
        } else {
            const position = key.split('.');
            result.areas[key] = {...area, posX: position[0], posY: position[1]};
        }
    }

    return result;
}