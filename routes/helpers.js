const ParseExpression = require('parse-expression');

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

const isLegalVar = chars => isLegalStart(chars[0]) && chars.slice(1).split("").every(char => isLegalChar(char));

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
    const vals = valsIn.map(valStr => Number(valStr));
    for (const val of vals) {
        if (!isFinite(val)) return {error: `One of your values (${val}) cannot be parsed as a finite number`};
    }
    return {vals};
}

const makeFn = (fnStr, vars) => {
    return vals => {
        let exprStr = fnStr;
        vars.forEach((var, i) => exprStr = exprStr.split(var).join(`(${vals[i]})`));
    };
    const parser = new ParseExpression(exprStr);
    return parser.loadEMDAS().evalEMDAS();
}

module.exports = { processExpr, parseArrayStr, parseVars, parseVals };
