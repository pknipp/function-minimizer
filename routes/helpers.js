const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const processExpr = str => {
    str = str.replace(/\s/g, '');
    return [["D", "/"], ["DIV", "/"], ["**", "^"]].reduce((str, [charIn, charOut]) => {
        return str.split(charIn).join(charOut);
    }, str);
};

const isLegalStart = char => {
    const code = char.charCodeAt(0);
    // capital letter or lower-case letter or underscore
    return (64 < code && code < 91) || (96 < code && code < 123) || code === 95;
};

const isLegalChar = char => {
    const code = char.charCodeAt(0);
    // legal starting char (see above) or numeral
    return isLegalStart(char) || (47 < code && 58);
};

const isLegalVar = chars => chars.length && isLegalStart(chars[0]) && chars.slice(1).split("").every(char => isLegalChar(char));

const parseArrayStr = arrStrIn => {
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

const parseVars = vars => {
    for (const varName of vars) {
        if (!isLegalVar(varName)) return `One of your vars (${varName}) is not legal.`;
    }
}

const parseVals = valsIn => {
    if (!valsIn.every(valStr => valStr)) {
        return {error: "One of your coordinate values is an empty string."}
    }
    const vals = valsIn.map(valStr => Number(valStr));
    for (const val of vals) {
        if (!isFinite(val)) return {error: `One of your values (${val}) cannot be parsed as a finite number`};
    }
    return {vals};
}

const parseSimplex = (simplexStrIn, nDim) => {
    let simplexStr = simplexStrIn.replace(/\s/g, '');
    if (simplexStr.length < 2 * nDim * nDim + 3 * nDim + 3) {
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

const makeFn = (fnStr, vars) => {
    return vals => {
        let exprStr = fnStr;
        vars.forEach((varName, i) => exprStr = exprStr.split(varName).join(`(${vals[i]})`));
        const parser = new ParseExpression(exprStr);
        parser.loadEMDAS().evalEMDAS();
        return {value: parser.vals[0], warnings: parser.warnings, error: parser.error};
    };
};

const processEvaluateExpr = params => {
    const exprStr = processExpr(params.exprStr);
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, message: parser};
}

const processEvaluateFn = params => {
    let {fnStr, vars, vals} = params;
    let exprStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parseVars(vars);
    if (error) return {error};
    result = parseArrayStr(vals);
    if (result.error) return {error: result.error};
    vals = result.array;
    if (vars.length !== vals.length) return {error: `Your vars-array length (${vars.length}) does not equal your vals-array length (${vals.length})).`};
    result = parseVals(vals);
    if (result.error) return {error: result.error};
    vals = result.vals;
    vals.forEach((val, i) => exprStr = exprStr.split(vars[i]).join(`(${val})`));
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, info: {fnStr, vars, vals, parser}};
}

const processMinimize = params => {
    let {fnStr, vars} = params;
    fnStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parseVars(vars);
    if (error) return {error};
    const fn = makeFn(fnStr, vars);
    const simplex = [];
    for (let i = 0; i <= vars.length; i++) {
        simplex.push(vars.map(_ => Math.random()));
    }
    const minimizer = new Minimizer(fn, simplex);
    result = minimizer.run();
    return {error: result.error, info: {fnStr, result}};
}

const processMinimizeWithSimplex = params => {
    let {fnStr, vars, simplex} = params;
    fnStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parseVars(vars);
    if (error) return {error, info: {vars}};
    const fn = makeFn(fnStr, vars);
    result = parseSimplex(simplex, vars.length);
    if (result.error) return {error: result.error};
    simplex = result.simplex;
    const minimizer = new Minimizer(fn, simplex);
    result = minimizer.run();
    return {error: result.error, info: {simplex, fnStr, result}};
};

module.exports = {
    processEvaluateExpr,
    processEvaluateFn,
    processMinimize,
    processMinimizeWithSimplex,
};
