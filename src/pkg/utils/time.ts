type TimeUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';




export function toMs(time: number, unit: TimeUnit) {
    switch (unit) {
        case 'seconds':
            return time * 1000;
        case 'minutes':
            return time * 60 * 1000;
        case 'hours':
            return time * 60 * 60 * 1000;
        case 'days':
            return time * 60 * 60 * 1000 * 24;

        default:
            return time;
    }
};


export function toSeconds(time: number, unit: TimeUnit) {
    switch (unit) {
        case 'milliseconds':
            return time / 1000;
        case 'minutes':
            return time * 60;
        case 'hours':
            return time * 60 * 60;
        case 'days':
            return time * 60 * 60 * 24;

        default:
            return time;
    }
}
