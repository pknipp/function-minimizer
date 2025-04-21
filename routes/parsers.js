const { isLegalVar } = require('./helpers');

const arrayStr = arrStrIn => {
    let arrStr = arrStrIn.replace(/\s/g, '');
    const leadChar = arrStr[0];
    if (leadChar === "[") {
        arrStr = arrStr.slice(1);
    } else {
        return {error: `Your array's leading character was ${leadChar}, not '['.`};
    }
    let trailingChar = arrStr[arrStr.length - 1];
    if (trailingChar === "]") {
        arrStr = arrStr.slice(0, -1);
    } else {
        return {error: `Your arrays string's trailing character was ${trailingChar}, not ']'.`};
    }
    const array = arrStr.split(",");
    if (!array.length) return {error: `Your array (${arrStrIn}) is empty.`};
    return {array};
}

const vars = vars => {
    for (const varName of vars) {
        if (!isLegalVar(varName)) return `One of your vars (${varName}) is not legal.`;
    }
}

const coords = coordsIn => {
    if (!coordsIn.every(coordStr => coordStr)) {
        return {error: "One of your coordinate values is an empty string."}
    }
    const coords = [];
    for (const coordStr of coordsIn) {
        const coord = Number(coordStr);
        if (!isFinite(coord)) return {error: `One of your values (${coordStr}) cannot be parsed as a finite number`};
        coords.push(coord);
    }
    return {coords};
}

const simplex = (simplexStrIn, nDim) => {
    let simplexStr = simplexStrIn.replace(/\s/g, '');
    if (simplexStr.length < 2 * nDim * nDim + 4 * nDim + 3) {
        return {error: `Your simplex string (${simplexStrIn}) is not sufficiently long.`};
    }
    const leadChars = simplexStr.slice(0, 2);
    if (leadChars === "[[") {
        simplexStr = simplexStr.slice(2);
    } else {
        return {error: `The leading characters of your simplex string (${simplexStrIn}) are ${leadChar}, not '[['.`};
    }
    let trailingChars = simplexStr.slice(-2);
    if (trailingChars === "]]") {
        simplexStr = simplexStr.slice(0, -2);
    } else {
        return {error: `The trailing characters of your simplex (${simplexStrIn}) are ${trailingChars}, not ']]'.`};
    }
    const arrayOfPointStrs = simplexStr.split("],[");
    if (arrayOfPointStrs.length !== nDim + 1) {
        return {error: `Your simplex length (${arrayOfPointStrs.length}) does not equal your vars length (${nDim}) plus one.`}
    }
    const simplex = [];
    for (const pointStrs of arrayOfPointStrs) {
        const point = [];
        const strings = pointStrs.split(",");
        if (strings.length !== nDim) {
            return {error: `One of your simplex's points (${pointStrs}) has ${strings.length} coordinates, not ${nDim}.`};
        }
        for (const string of strings) {
            const number = Number(string);
            if (!isFinite(number)) {
                return {error: `One of the simplex's coordinates (${string}) cannot be parsed as a number.`};
            } else {
                point.push(number);
            }
        }
        simplex.push(point);
    }
    return {simplex};
}

module.exports = { arrayStr, vars, coords, simplex };
