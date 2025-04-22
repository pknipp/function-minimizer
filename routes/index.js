const router = require('express').Router();

const api = require('./api');
const render = require('./render.js');
const handlers = require('./handlers.js');
const homePage = require('./homePage.js');

const makeHtml = handlers.makeHtml;

router.use('/api', api);

router.get('', (req, res) => res.send(homePage));

router.get(
    '/evaluate-expression/:exprStr',
    makeHtml(handlers.evaluateExpression),
);
router.get(
    '/evaluate-function/:fnStr/:vars/:coords',
    makeHtml(handlers.evaluateFunction),
);
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/minimize/:fnStr/:vars/${simplex}${maxIter}`,
        makeHtml(handlers.minimize),
    );
}));


module.exports = router;
