const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const handlers = require("../handlers.js");

const makeJSON = handlers.makeJSON;

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/expression-evaluator/:exprStr', makeJSON(handlers.evaluateExpression));
router.get('/function-evaluater/:fnStr/:vars/:coords', makeJSON(handlers.evaluateFunction));
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/minimizer/:fnStr/:vars/${simplex}${maxIter}`,
        makeJSON(handlers.minimize),
    );
}));

module.exports = router;
