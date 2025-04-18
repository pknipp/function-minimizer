const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const { processExpr, parseArrayStr, parseVars, parseVals, makeFn, parseSimplex } = require("../helpers.js");

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', (req, res) => {
    const exprStr = processExpr(req.params.exprStr);
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    res.json({message: parser});
});

router.get('/evaluate-function/:fnStr/:vars/:vals', (req, res) => {
    let {fnStr, vars, vals} = req.params;
    let exprStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error: result.error});
    }
    vars = result.array;
    let error = parseVars(vars);
    if (error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error});
    }
    result = parseArrayStr(vals);
    if (result.error) {
        res.status(500);
        console.error("vals = ", vals);
        return res.json({error: result.error});
    }
    vals = result.array;
    if (vars.length !== vals.length) {
        res.status(500);
        console.error("vars/vals = ", vars, vals);
        return res.json({error: `Your vars array length (${vars.length}) does not equal that of your vals array (${vals.length}).`});
    }
    result = parseVals(vals);
    if (result.error) {
        res.status(500);
        console.error("vals = ", vals);
        return res.json({error: result.error});
    }
    vals = result.vals;
    vals.forEach((val, i) => exprStr = exprStr.split(vars[i]).join(`(${val})`));
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    if (parser.error) {
        res.status(500);
        console.error("parser = ", parser);
        return res.json({error: parser.error});
    }
    res.json({message: parser});
});

router.get('/minimize-function/:fnStr/:vars', (req, res) => {
    let {fnStr, vars} = req.params;
    fnStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error: result.error});
    }
    vars = result.array;
    let error = parseVars(vars);
    if (error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error});
    }
    const fn = makeFn(fnStr, vars);
    const simplex = [];
    for (let i = 0; i <= vars.length; i++) {
        simplex.push(vars.map(_ => Math.random()));
    }

    const minimizer = new Minimizer(fn, simplex);
    result = minimizer.run();

    if (result.error) {
        res.status(500);
        console.error("result = ", result);
        return res.json({error: result});
    }
    res.json({message: result, fnStr});
});

router.get('/minimize-function/:fnStr/:vars/:simplex', (req, res) => {
    let {fnStr, vars, simplex} = req.params;
    fnStr = processExpr(fnStr);
    let result = parseArrayStr(vars);
    if (result.error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error: result.error});
    }
    vars = result.array;
    let error = parseVars(vars);
    if (error) {
        res.status(500);
        console.error("vars = ", vars);
        return res.json({error});
    }
    const fn = makeFn(fnStr, vars);

    result = parseSimplex(simplex, vars.length);
    if (result.error) {
        res.status(500);
        console.error("simplex = ", simplex);
        return res.json({error: result.error});
    }
    simplex = result.simplex;

    const minimizer = new Minimizer(fn, simplex);
    result = minimizer.run();

    if (result.error) {
        res.status(500);
        console.error("result = ", result);
        return res.json({error: result});
    }
    res.json({message: result, fnStr});
});

module.exports = router;
