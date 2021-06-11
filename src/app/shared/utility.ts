export const getColorCode = (index) => {

    const colors = [
        "#3f51b5",
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "purple",
        "brown",
        "magenta",
        "cyan",
        "orange",
        "pink"
    ]

    const inx = (index) % (colors.length);
    return colors[inx];

}
export const getDateTimeString = (valueString) => {
    var dt = new Date(valueString);
    return `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;

}
export const isFloatNumber = (num) => {
    return Number(num) === num && num % 1 !== 0;
}
export const isExponentialNumber = (num) => {
    const reg = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/g 
    return reg.test(num);
}

