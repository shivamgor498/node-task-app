const validator = require('validator')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./Tasks')
const userSchema = new 	mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},age: {
		type: Number,
		default: 0,
		validate(value) {
			if(value<0)
				throw new Error('Age is invalid')
		}
	},email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if(!validator.isEmail(value))
				throw new Error('Email is invalid')
		}
	},password: {
		type: String,
		required: true,	
		trim:true,
		validate(value) {
			if(value.length <=6 || value.toLowerCase().includes("password"))
				throw new Error('Password is invalid')
		}
	},tokens: [{
		token: {
			type: String,
			required: true
		}
	}], avatar : {
		type: Buffer
	}
},{
	timestamps: true
})
userSchema.virtual('tasks', {
	ref: 'Tasks',
	localField: '_id',
	foreignField: 'owner'
})
// statics is accessible on models, also known as model functions
userSchema.statics.findByCredentials = async (email,password) => {
	const user = await User.findOne({ email: email })
	if(!user)
		throw new Error('Unable to login')
	const isMatch = await bcryptjs.compare(password,user.password)
	if(!isMatch)
		throw new Error('Unable to login')
	return user
}
// whenever json object is sent through response JSON.stringify() is automatically called and through that toJSON is called
userSchema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()
	delete userObject.password
	delete userObject.tokens
	return userObject
}
// methods is accessible on instance of schema, also known as instance functions
userSchema.methods.getAuthToken = async function() {
	const user = this
	const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
	user.tokens = user.tokens.concat({ token })
	return token
}
userSchema.pre('remove', async function(next) {
	const user = this
	await Tasks.deleteMany({ owner: user._id})
	next()
})
userSchema.pre('save',async function(next) {
	const user = this
	console.log('before saving')
	if(user.isModified('password')){
		user.password = await bcryptjs.hash(user.password,8)
	}
	next()
})
const User = mongoose.model('User', userSchema)
module.exports = User