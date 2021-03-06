const bcrypt = require('bcrypt');
const UserModel = require('../models/Users.model');
const PostsModel = require('../models/Post.model');

class UserController {
    //[GET] /:id
    async userGet(req, res, next) {
        try {
            const user = await UserModel.findById(req.params.id);
            const { password, ...other } = user._doc;

            res.status(200).json(other);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //[PUT] /:id
    async userUpdate(req, res, next) {
        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPass;
            }
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                )
                res.status(200).json(updatedUser);
            } catch (error) {
                res.status(500).json(err);
            }
        }
        else {
            res.status(400).json("You can update only one your account!!")
        }
    }

    //[DELETE] /:id
    async userDelete(req, res, next) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (req.body.userId == user._id) {
                try {
                    await PostsModel.deleteMany({ username: user.username, });
                    await UserModel.findByIdAndDelete(req.params.id);
                    res.status(200).json("User has been deleted!!!");
                } catch (error) {
                    res.status(500).json(err);
                }

            }
            else {
                res.status(400).json("You can delete only one your account!!")
            }
        } catch (error) {
            res.status(400).json("User not found!!!");
        }
    }
}

module.exports = new UserController();
