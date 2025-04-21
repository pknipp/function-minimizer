const router = require('express').Router();

const api = require('./api');
const render = require('./render.js');
const handlers = require('./handlers.js');

const makeHtml = handlers.makeHtml;

router.use('/api', api);

router.get(
    '/evaluate-expression/:exprStr',
    makeHtml(handlers.evaluateExpr),
);
router.get(
    '/evaluate-function/:fnStr/:vars/:coords',
    makeHtml(handlers.evaluateFn),
);
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/minimize-function/:fnStr/:vars/${simplex}${maxIter}`,
        makeHtml(handlers.minimize),
    );
}));


module.exports = router;
