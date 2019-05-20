const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const DB_PATH = process.env.DB_PATH + "_" + process.env.NODE_ENV
mongoose.connect(DB_PATH, {
    useNewUrlParser: true
})
mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username cannot be empty"],
    },
    email: {
        type: String,
        required: [true, "email cannot be empty"],
        validate: {
            validator: (v) => {
                let isUsed = async function checkEmail(v) {
                    let check = await User.findOne({
                        email: v
                    })
                    if (check) return false
                    else return true
                }
                return isUsed(v)
            },
            message: "email already registered"
        },
        validate: {
            validator: (v) => {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(v); // Assuming email has a text attribute
            },
            message: "not a valid email format"
        }

    },
    password: {
        type: String,
        required: [true, "password cannot be empty"],
        minlength: [8, "password must be at least 8 in length"]
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "Cart"
    }
})

userSchema.pre('save', function (next) {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User