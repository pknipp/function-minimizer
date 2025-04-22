const router = require('express').Router();
const ParseExpression = require('parse-expression');
const Minimizer = require('minimize-fn');

const handlers = require("../handlers.js");

const makeJSON = handlers.makeJSON;

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', makeJSON(handlers.evaluateExpression));
router.get('/evaluate-function/:fnStr/:vars/:coords', makeJSON(handlers.evaluateFunction));
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/minimize/:fnStr/:vars/${simplex}${maxIter}`,
        makeJSON(handlers.minimize),
    );
}));

module.exports = router;
