const router = require('express').Router();
// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', (req, res) => {
    let exprStr = req.params.exprStr;
    res.json({message: exprStr});
});

// router.get('/:rNmaxNmin', (req, res) => {
    // let params = req.params.rNmaxNmin.split("-");
    // let [error, xs] = parseParams(params);
    // if (error) {
    //   res.status(500);
    //   res.json({error});
    // } else {
    //   res.json({message: JSON.stringify(xs)});
    // }
//   });
module.exports = router;
