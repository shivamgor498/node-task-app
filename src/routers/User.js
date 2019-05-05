const User = require('../models/User')
const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const mail = require('../emails/account')
router.post('/users',async (req,res) => {
	const user = new User(req.body)
	try{
		const token = await user.getAuthToken()
		await user.save()
		mail.sendWelcomeMail(user.name,user.email)
		res.status(201).send({
			user,
			token
		})
	}catch(error){
		res.status(400).send(error)
	}
	// user.save().then(() => {
	// 	res.status(201).send(user)
	// }).catch((error) => {
	// 	res.status(400).send(error)
	// })
})
router.post('/users/login',async (req,res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.getAuthToken()
		await user.save()
		res.send({
			user,
			token
		})
	}catch(error){
		console.log(error)
		res.status(500).send(error)
	}
})
router.post('/users/logout',auth,async (req,res) => {
	try{
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token!==req.token
		})
		//console.log(req.user.tokens)
		await req.user.save()
		res.send(req.user)
	}catch(error){
		console.log(error)
		res.status(500).send()
	}
})
router.post('/users/logoutAll',auth,async (req,res) => {
	try{
		req.user.tokens = []
		await req.user.save()
		res.send()
	}catch(error){
		res.status(500).send()
	}
})
router.get('/users/me',auth,async (req,res) => {
	res.send(req.user)
	// try{
	// 	const users = await User.find({})
	// 	if(!users)
	// 		return res.status(404).send()
	// 	res.status(202).send(users)
	// }catch(error){
	// 	res.status(500).send(error)
	// }
	// User.find({}).then((users) => {
	// 	if(!users)
	// 		return res.status(404).send()
	// 	res.status(202).send(users)
	// }).catch((error) => {
	// 	res.status(500).send()
	// })
})
router.patch('/users/me',auth, async (req,res) => {
	//const _id = req.params.id
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name','age','email','password']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	if(!isValidOperation)
		res.status(400).send({error: 'Invalid Update'})
	try{
		//const user = await User.findById(_id)
		const user = req.user
		updates.forEach((update) => user[update] = req.body[update])
		await user.save()
		//const user = await User.findByIdAndUpdate(_id,req.body,{new: true,runValidators: true})
		if(!user)
			return res.status(404).send()
		res.status(200).send(user)
	}catch(error){
		res.status(500).send(error)
	}
})
router.delete('/users/me',auth, async (req,res) => {
	//const _id = req.params.id
	try{
		// const user = await User.findByIdAndDelete(_id)
		// if(!user)
		// 	return res.status(404).send()
		await req.user.remove()
		mail.sendGoodByeMail(req.user.name,req.user.email)
		res.send(req.user)
	}catch(error){
		res.status(500).send(error)
	}
})
const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
			return cb(new Error('Please upload a Image document'))
		cb(undefined,true)
	}
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	res.send()
},(error,req,res,next) => {
	res.status(400).send({
		error: error.message
	})
})
router.delete('/users/me/avatar',auth, async (req,res) => {
	req.user.avatar = undefined
	try{
		await req.user.save()
		res.send()
	}catch(error){
		res.status(500).send({
			error: 'Unable to delete User avatar'
		})
	}
})
router.get('/users/:id/avatar', async(req,res) => {
	try{
		const user = await User.findById(req.params.id)
		if(!user || !user.avatar)
			throw new Error()
		res.set('Content-Type','image/png')
		res.send(user.avatar)
	}catch(error){
		res.status(404).send(error)
	}
})
module.exports = router