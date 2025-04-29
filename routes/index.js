const router = require('express').Router();

const [render, handlers, homePage] = ["render", "handlers", "homePage"].map(
    filename => require(`./${filename}.js`)
);

const [makeHtml, makeJSON] = ["makeHtml", "makeJSON"].map(type => handlers[type]);

// html routes
router.get('', (req, res) => {
    console.log("req.ip = ", req.ip);
    console.log("req = ", req);
    res.send(homePage);
});

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
