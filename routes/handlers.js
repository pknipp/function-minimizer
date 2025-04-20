const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const parsers = require('./parsers');
const { processExpr, makeFn } = require('./helpers');

const make = handler => {
    return ({ params }, response) => {
        const result = handler(params);
        if (result.error) {
            response.status(500);
            console.error({error: result.error});
            return response.json({error: result.error});
        }
        response.json({message: result.info});
    }
}

const evaluateExpr = params => {
    const exprStr = processExpr(params.exprStr);
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, info: parser};
}

const evaluateFn = params => {
    let {fnStr, vars, vals} = params;
    let exprStr = processExpr(fnStr);
    let result = parsers.arrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parsers.vars(vars);
    if (error) return {error};
    result = parsers.arrayStr(vals);
    if (result.error) return {error: result.error};
    vals = result.array;
    if (vars.length !== vals.length) return {error: `Your vars-array length (${vars.length}) does not equal your vals-array length (${vals.length})).`};
    result = parsers.vals(vals);
    if (result.error) return {error: result.error};
    vals = result.vals;
    vals.forEach((val, i) => exprStr = exprStr.split(vars[i]).join(`(${val})`));
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, info: {fnStr, vars, vals, parser}};
}

const minimize = params => {
    let {fnStr, vars} = params;
    fnStr = processExpr(fnStr);
    let result = parsers.arrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parsers.vars(vars);
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

const minimizeWithSimplex = params => {
    let {fnStr, vars, simplex} = params;
    fnStr = processExpr(fnStr);
    let result = parsers.arrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parsers.vars(vars);
    if (error) return {error, info: {vars}};
    const fn = makeFn(fnStr, vars);
    result = parsers.simplex(simplex, vars.length);
    if (result.error) return {error: result.error};
    simplex = result.simplex;
    const minimizer = new Minimizer(fn, simplex);
    result = minimizer.run();
    return {error: result.error, info: {simplex, fnStr, result}};
};

module.exports = {evaluateExpr, evaluateFn, minimize, minimizeWithSimplex, make};
