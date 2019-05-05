const mongoose = require('mongoose')
mongoose.connect(process.env.DB_PATH , {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(() => {
	console.log('Successfully connected to mongodb')
}).catch((error) => {
	console.log('error Unable to connect to mongodb')
})
// const me = new User({
// 	name: 'Akshat',
// 	age: 19,  
// 	email: 'mehta.akshat3@gmail.com',
// 	password: 'password123'
// })
// me.save().then(() => {
// 	console.log(me)
// }).catch((error) => {
// 	console.log(error.errors)
// })
// const newTask = new Tasks({
// 	description: 'Ladders',
// 	completed: true
// })
// newTask.save().then(() => {
// 	console.log(newTask)
// }).catch((error) => {
// 	console.log(error.name)
// })