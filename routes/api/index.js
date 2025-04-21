const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const handlers = require("../handlers.js");

const makeJSON = handlers.makeJSON;

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', makeJSON(handlers.evaluateExpr));
router.get('/evaluate-function/:fnStr/:vars/:coords', makeJSON(handlers.evaluateFn));
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/minimize-function/:fnStr/:vars/${simplex}${maxIter}`,
        makeJSON(handlers.minimize),
    );
}));

module.exports = router;
