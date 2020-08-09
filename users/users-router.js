const express = require("express")
const Users = require("./users-model")
const bcrypt = require('bcryptjs')
const router = express.Router()
const restrict = require('../middleware/restrict')
const session = require("express-session")

router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			//hash the password with a time complexity of "10"
			password: await bcrypt.hash(password, 10),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		 
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		//hash the password again and see if it matches what we have in the database
		const validatePassword = await bcrypt.compare(password, user.password)

		if (!validatePassword) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		//this is where you will generate a new session for each user
		req.session.user = user // This will create a new session for the user, store it in memory, and send a session id back

		res.json({
			message: `Welcome ${user.username}!`,
		})
		

	} catch(err) {
		next(err)
	}
})

router.get("/logout", (req,res, next)=>{
	try{
		req.session.destroy((err)=>{
			err ? next(err) : res.status(204).end()
		})
	} catch(err){
		next(err)
	}
})
module.exports = router
