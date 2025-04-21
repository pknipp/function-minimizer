const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const parsers = require('./parsers');
const { processExpr, makeFn } = require('./helpers');
const render = require('./render');

const makeJSON = handler => {
    return ({ params }, response) => {
        const result = handler(params);
        if (result.error) {
            response.status(500);
            console.error({error: result.error});
            response.json({error: result.error});
        } else {
            response.json({message: result.info});
        }
    }
}

const makeHtml = handler => {
    return ({ params }, response) => {
        const result = handler(params);
        if (result.error) {
            response.status(500);
            console.error({error: result.error});
            response.send(render({error: result.error}));
        } else {
            response.send(render(result.info));
        }
    };
};

const evaluateExpr = params => {
    const exprStr = processExpr(params.exprStr);
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, info: parser};
}

const evaluateFn = params => {
    let {fnStr, vars, coords} = params;
    // fn will be changed to expression below
    let exprStr = processExpr(fnStr);
    let result = parsers.arrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parsers.vars(vars);
    if (error) return {error};
    result = parsers.arrayStr(coords);
    if (result.error) return {error: result.error};
    coords = result.array;
    if (vars.length !== coords.length) return {error: `Your vars-array length (${vars.length}) does not equal your coords-array length (${coords.length})).`};
    result = parsers.coords(coords);
    if (result.error) return {error: result.error};
    coords = result.coords;
    coords.forEach((coord, i) => exprStr = exprStr.split(vars[i]).join(`(${coord})`));
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    return {error: parser.error, info: {fnStr, vars, coords, ...parser}};
}

const minimize = params => {
    let {fnStr, vars, simplex, maxIter} = params;
    const hasSimplex = simplex || false;
    fnStr = processExpr(fnStr);
    let result = parsers.arrayStr(vars);
    if (result.error) return {error: result.error};
    vars = result.array;
    const error = parsers.vars(vars);
    if (error) return {error};
    const fn = makeFn(fnStr, vars);
    if (hasSimplex) {
        result = parsers.simplex(simplex, vars.length);
        if (result.error) return {error: result.error};
        simplex = result.simplex;
    } else {
        simplex = [];
        for (let i = 0; i <= vars.length; i++) {
            simplex.push(vars.map(_ => Math.random()));
        }
    }
    const minimizer = new Minimizer(fn, simplex, maxIter);
    result = minimizer.run();
    return {error: result.error, info: {fnStr, ...{vars}, ...result, ...hasSimplex ? {simplex} : {}}};
}

module.exports = {evaluateExpr, evaluateFn, minimize, makeJSON, makeHtml};
