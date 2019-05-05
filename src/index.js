const express = require('express')
require('./db/mongoose.js')
const maintenance = require('./middleware/maintenance.js')
const app = express()
const port = process.env.PORT
const userRouter = require('./routers/User')
const taskRouter = require('./routers/Tasks')
// app.use((req,res,next) => {
// 	if(req.method==='GET')
// 		return res.send('Get requests are disabled')
// 	next()
// })

//-------uncomment for maintenance
//maintenance(app)
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port,() => {
	console.log('Server has started on port ' + port)
})
/*const jwt = require('jsonwebtoken')
const myfunc = async () => {
	const token = jwt.sign({_id: 'abcd123'},'thisistest',{expiresIn: '10 seconds'})
	console.log(token)
	setTimeout(() =>{
		try{
			const data = jwt.verify(token,'thisistest')
			console.log(data)
		}catch(error){
			console.log('jwt expired')
		}
	}, 9000);
}
myfunc()*/
/*const myfunc = async (passwd) =>{
	const hashedPassword = await bcryptjs.hash(passwd, 8)
	console.log(passwd)
	console.log(hashedPassword)
	const isMatch = await bcryptjs.compare(passwd+'-',hashedPassword)
	console.log(isMatch)
}
try{
	myfunc('Shivam@123')
}catch(error){
	console.log(error)
}*/

/*const Tasks = require('./models/Tasks')
const User = require('./models/User')
const main = async() => {
	// const task = await Tasks.findById('5cca802fd6cbee1d87c17ae7')
	// await task.populate('owner').execPopulate()
	// console.log(task)
	const user = await User.findById('5cca7f66e479911cc065fdb1')
	await user.populate('tasks').execPopulate()
	console.log(user.tasks)
}
main()*/