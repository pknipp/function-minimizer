const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const {
    processEvaluateExpr,
    processEvaluateFn,
    processMinimize,
    processMinimizeWithSimplex,
} = require("../helpers.js");

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', (req, res) => {
    let result = processEvaluateExpr(req.params);
    if (result.error) {
        res.status(500);
        console.error({error: result.error});
    }
    res.json({message: result.message});
});

router.get('/evaluate-function/:fnStr/:vars/:vals', (req, res) => {
    const result = processEvaluateFn(req.params);
    if (result.error) {
        res.status(500);
        console.error({error: result.error});
        return res.json({error: result.error});
    }
    res.json({message: result.info});
});

router.get('/minimize-function/:fnStr/:vars', (req, res) => {
    const result = processMinimize(req.params);
    if (result.error) {
        res.status(500);
        console.error({error: result.error});
        return res.json({error: result.error});
    }
    res.json({message: result.info});
});

router.get('/minimize-function/:fnStr/:vars/:simplex', (req, res) => {
    const result = processMinimizeWithSimplex(req.params);
    if (result.error) {
        res.status(500);
        console.error({error: result.error});
        return res.json({error: result.error});
    }
    res.json({message: result.info});
});

module.exports = router;
