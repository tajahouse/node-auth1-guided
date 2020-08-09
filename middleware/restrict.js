const usersModel = require("../users/users-model")
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

function restrict (){
    // since you will use this several times, you can just create a variable for it.
    
    return async(req, res, next) =>{
        const errMessage = (err, messageStatement) =>{
            res.status(err).json({
              message: messageStatement
          })  
          } 
        try{
    //         const { username, password } = req.headers
    //         //make sure the values are not empty
    //         if(!username || !password){
    //             return errMessage(401, "Invalid Credentials");
    //         }

    //         const user = await Users.findBy({ username }).first()
    //         if(!user){
    //             return errMessage(401, "Invalid Credentials");
    //         }
    //         const validatePassword = await bcrypt.compare(password, user.password)

    //         if(!validatePassword){
    //             return errMessage(401, "Invalid Credentials")
    //         }

    if(!req.session || !req.session.user){
        return errMessage(401, "Invalid Credentials");
    }

    // if we reach this point, the user is considered authorized, so you can move them along with the next function
    next()

        } catch(err){
            next(err)
        }
    }
}

module.exports = restrict;