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
