const ParseExpression = require('parse-expression');

const processExpression = str => {
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

const makeFunction = (fnStr, vars) => {
    return coords => {
        let exprStr = fnStr;
        vars.forEach((varName, i) => exprStr = exprStr.split(varName).join(`(${coords[i]})`));
        const parser = new ParseExpression(exprStr);
        parser.loadEMDAS().evalEMDAS();
        return {value: parser.vals[0], warnings: parser.warnings, error: parser.error};
    };
};

module.exports = { processExpression, isLegalVar, makeFunction };
