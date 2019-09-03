
export default function prepareGame(data) {
    const result = {...data};
    for (const key in data.walls) {
        const points = key.split('-');
        const wall = data.walls[key];
        if (points.length > 1) {
            const start = points[0].split('.').map(item => Number.parseInt(item));
            const end = points[1].split('.').map(item => Number.parseInt(item));
            for (let y = start[0]; y <= end[0]; y++) {
                for (let x = start[1]; x <= end[1]; x++) {
                    console.log(y,x);
                    result.walls[y+'.'+x] = {x, y, type: wall};
                }
            }
            delete result.walls[key];
        } else {
            const position = key.split('.');
            result.walls[key] = {x: position[1], y: position[0], type: wall};
        }

    }

    return result;
}