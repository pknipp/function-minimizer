const router = require('express').Router();
const ParseExpression = require('parse-expression');

// const routes = ['only'];
// routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

router.get('/evaluate-expression/:exprStr', (req, res) => {
    const exprStr = req.params.exprStr;
    const parser = new ParseExpression(exprStr);
    parser.loadEMDAS().evalEMDAS();
    res.json({message: parser});
});

router.get('/evaluate-function/:fnStr/:vars/:vals', (req, res) => {
    let {fnStr, vars, vals} = req.params;
    console.log(fnStr, vars, vals);
    let exprStr = fnStr;
    vars = vars.slice(1, -1).split(",");
    vals = vals.slice(1, -1).split(",").map(val => Number(val));
    vals.forEach((val, i) => exprStr = exprStr.split(vars[i]).join(val));
    console.log(exprStr);
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
