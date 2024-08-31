// ArrayIterator // const function are not hoisted XD
const createArrayIterator = (array) => {
    let index = 0;

    return {
        hasNext: () => index < array.length,
        next: () => array[++index],
        current: () => array[index]
    };
};
