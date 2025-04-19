
import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "b19044a9377399",
    pass: "07ea9fa4d6583b",
  },
});


export const signUp = async function signUp(req,res){


    try{

        const { profile_pic,username, email, phone, password } = req.body;
        
        
        if (!( profile_pic && username && email && phone && password)) {
            return res.status(400).json({message:"Please Fill all the details"})
            
        }
        
        //hash the password
        
        bcrypt.hash(password,10).then(async (hashed_pwd)=>{
            
            const data = await userSchema.create({
                profile_pic,
                username,
                email,
                phone,
                password:hashed_pwd
            })
            
            res.status(201).json({message:"User Created Successfully"})
        })
    }

    catch(err){
        console.log(err)
        res.status(400).json({message:"Error in creating user"})
    }


}


export const logIn = async function logIn(req, res) {
    try {
      const { email, password } = req.body;
  
      const userExist = await userSchema.findOne({ email });
  
      //check use exist or not
      if (!userExist) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const ispassMatch = await bcrypt.compare(password, userExist.password);
  
      if (!ispassMatch) {
        return res.status(400).json({ message: "Passwords is wrong" });
      }
  
      const token = await jwt.sign({ id: userExist._id }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });
  
      res.status(200).json({ message: "Logged in success" ,token});
  
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  };
  

//get one user

export const getUser = async function getUser(req,res) {

  try{

    
    const id = req.params.id

    const data = await userSchema.findById(id)

    if(!data){
      return res.status(404).json({message:"Not Found"})
    }

    res.status(200).json(data)
    
  }



  catch(err){

    console.log(err)
    res.status(500).json({messgae:err})
  }


}



export const editUser = async function editUser(req, res) {
  try {

    //get id
    const id = req.params.id;

    const { profile_pic, username, email, phone } = req.body;

    const data = await userSchema.findByIdAndUpdate(
      id,
      { profile_pic, username, email, phone },
      { new: true } 
    );

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({message:"Data Updated Successfully"});

  } 
  
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" }); 
  }
};


export async function sendotp(req,res) {
  console.log(req.body)
  const {email}= req.body
  try {
    
    const userExist = await userSchema.findOne({email})

    // console.log(userExist)
    if(!userExist)
      return res.status(404).json({message:"user not found"})
    
    let otp = Math.floor(Math.random()*900000)+100000
    console.log(otp)

    userExist.otp=otp

    await userExist.save()

    const info = await transporter.sendMail({
      from: 'umamahesh9447230@gmail.com', // sender address
      to: email, // list of receivers
      subject: "OTP", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Hello ${userExist.username} your otp is ${otp}</b>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    
    res.status(200).json({message:"OTP send successfully"})
  


  } catch (error) {
    console.log(error)
  }
}

export async function verifyotp(req,res) {
  // console.log(req.body)
  const {email,otp} = req.body
  let user= await userSchema.findOne({email})
  try {
    
    if(user.otp === otp){
      user.otp = null

      res.status(200).json({message:"OTP verified successfully"})
    } else {
      res.status(403).json({message:"OTP is incorrect"})
    }
  } catch (error) {
    console.log(error)
  }
}


export async function pass_reset(req,res) {
  // console.log(req.body)

  const {email,password} = req.body

  const user = await userSchema.findOne({email})

  bcrypt.hash(password,10).then(async (hashed_pwd)=>{
            
    user.password = hashed_pwd
    await user.save()

    
    
    res.status(201).json({message:"Password Reset Successfully"})
})


  
}




    
    
