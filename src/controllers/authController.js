const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req,res)=>{

    console.log(req.body)
const {name,email,password} = req.body;

if(!name || !email || !password){
    return res.status(400).json({
        message:"All field required",
        success: false
    });
};


const userExists = await User.findOne({email});

if(userExists){
return res.status(400).json({message:"User already exists"});
}

const hashedPassword = await bcrypt.hash(password,10);

const user = await User.create({
name,
email,
password:hashedPassword
});

res.status(201).json(user);

};