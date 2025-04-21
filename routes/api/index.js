const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const handlers = require("../handlers.js");

const make = handlers.make;

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', make(handlers.evaluateExpr));
router.get('/evaluate-function/:fnStr/:vars/:vals', make(handlers.evaluateFn));
router.get('/minimize-function/:fnStr/:vars/random', make(handlers.minimize));
router.get('/minimize-function/:fnStr/:vars/random/:maxIter', make(handlers.minimize));
router.get('/minimize-function/:fnStr/:vars/:simplex', make(handlers.minimizeWithSimplex));
router.get('/minimize-function/:fnStr/:vars/:simplex/:maxIter', make(handlers.minimizeWithSimplex));

module.exports = router;
