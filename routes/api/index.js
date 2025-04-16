const router = require('express').Router();
const routes = ['only'];
routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));
module.exports = router;
