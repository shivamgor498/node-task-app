const express = require('express')
const app = express()
const maintenance = async(app) => {
	app.use((req,res,body) => {
 	res.status(503).send('Site is under maintenance')
})
}
module.exports = maintenance