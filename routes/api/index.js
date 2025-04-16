const router = require('express').Router();
const ParseExpression = require('parse-expression');

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', (req, res) => {
    const exprStr = req.params.exprStr;
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    console.log(parser.vals[0]);
    res.json({message: parser});
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
