const express = require('express')
const Tasks = require('../models/Tasks')
const auth = require('../middleware/auth')
const router = new express.Router()
router.post('/tasks',auth ,async (req,res) => {
	//const task = new Tasks(req.body)
	const task = new Tasks({
		...req.body,
		owner: req.user._id
	})
	try{
		await task.save()
		res.status(201).send(task)
	}catch(error){
		res.status(400).send(error)
	}
	// task.save().then(() => {
	// 	res.status(201).send(task)
	// }).catch((error) => {
	// 	res.status(400).send(error)
	// })
})
// GET /tasks?completed=true
router.get('/tasks',auth,async (req,res) => {
	try{
		//const tasks = await Tasks.find({ owner: req.user._id})
		const match = {}
		const sort = {}
		if(req.query.completed)
			match.completed = req.query.completed === 'true'
		if(req.query.sortBy){
			const parts = req.query.sortBy.split(':')
			sort[parts[0]] = parts[1]==='asc' ? 1:-1
		}
		const user = await req.user.populate({
			'path': 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		}).execPopulate()
		res.status(202).send(user.tasks)
	}catch(error){
		console.log(error)
		res.status(500).send(error)
	}
	// Tasks.find({}).then((tasks) => {
	// 	if(!tasks)
	// 		return res.status(404).send()
	// 	res.status(202).send(tasks)
	// }).catch((error) => {
	// 	res.status(500).send(error)
	// })
})
router.get('/tasks/:id',auth,async (req,res) => {
	const _id = req.params.id
	try{
		//const task = await Tasks.findById(_id)
		const task = await Tasks.findOne({_id, owner: req.user._id})
		if(!task)
			return res.status(404).send()
		res.status(202).send(task)
	}catch(error){
		res.status(500).send(error)
	}
	// Tasks.findById(_id).then((task) => {
	// 	if(!task)
	// 		return res.status(404).send()
	// 	res.status(202).send(task)
	// }).catch((error) => {
	// 	res.status(500).send()
	// })
})
router.patch('/tasks/:id',auth ,async (req,res) => {
	const _id = req.params.id
	const updates = Object.keys(req.body)
	const allowedUpdates = ['description','completed']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	console.log(isValidOperation)
	if(!isValidOperation)
		res.status(400).send({error : 'Invalid Updates!'})
	try{
		//const task = await Tasks.findByIdAndUpdate(_id,req.body,{new: true,runValidators:true})
		//const task = await Tasks.findById(_id)
		const task = await Tasks.findOne({_id , owner: req.user._id})
		updates.forEach((update) => task[update] = req.body[update])
		task.save()
		if(!task)
			return res.status(404).send()
		res.status(200).send(task)
	}catch(error){
		res.status(500).send(error)
	}
})
router.delete('/tasks/:id',auth,async (req,res) => {
	const _id = req.params.id
	try{
		//const task = await Tasks.findByIdAndDelete(_id)
		const task = await Tasks.findOneAndDelete({_id, owner: req.user._id})
		if(!task)
			return res.status(404).send()
		res.send(task)
	}catch(error){
		res.status(500).send(error)
	}
})
module.exports = router