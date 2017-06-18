const Koa = require('koa')
const serve = require('koa-static')

const app = new Koa()
app.use(serve('./examples'))
app.use(serve('./dist'))

app.listen(3000)
