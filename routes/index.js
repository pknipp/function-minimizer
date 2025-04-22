const router = require('express').Router();

// const api = require('./api');
const render = require('./render.js');
const handlers = require('./handlers.js');
const homePage = require('./homePage.js');

const [makeHtml, makeJSON] = ["makeHtml", "makeJSON"].map(type => handlers[type]);

// router.use('/api', api);

// html routes
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

// json routes
router.get('/api/evaluate-expression/:exprStr', makeJSON(handlers.evaluateExpression));
router.get('/api/evaluate-function/:fnStr/:vars/:coords', makeJSON(handlers.evaluateFunction));
["random", ":simplex"].forEach(simplex => ["/:maxIter", ""].forEach(maxIter => {
    router.get(
        `/api/minimize/:fnStr/:vars/${simplex}${maxIter}`,
        makeJSON(handlers.minimize),
    );
}));

module.exports = router;
