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

const toNonSciNotString = x => {
    if (!x) return "0";
    const isNeg = x < 0;
    if (isNeg) x = Math.abs(x);
    let xStr = String(x);
    const [mantissa, exponent] = xStr.split("e-");
    if (exponent === undefined) return String(x);
    const [int, decimal] = mantissa.split(".");
    xStr = (isNeg ? "-" : "") + "0." + "0".repeat(exponent - 1) + int + decimal;
    console.log("x/xStr = ", x, xStr);
    return xStr;
}

module.exports = { processExpression, isLegalVar, makeFunction, toNonSciNotString };
