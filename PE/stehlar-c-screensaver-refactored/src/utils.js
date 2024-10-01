// handy helper functions!
export const getRandomColor = () => {
    function getByte(){
        return 55 + Math.round(Math.random() * 200);
    }
    return `rgba( ${getByte()}, ${getByte()}, ${getByte()} , 1)`;
}

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}