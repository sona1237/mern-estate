import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
 
  try {
    await newUser.save();
    console.log('User created successfully:', newUser);
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    console.log("Email:", email); // Log the value of email

    // Check if the email is trimmed properly
   
    // Check if the user exists in the database
    const validUser = await User.findOne({ email });
    console.log("Valid User:", validUser);

    // Log database content before querying
    console.log("Database content:", await User.find());

    if (!validUser) {
      console.log('User not found!');
      return next(errorHandler(404, 'User not found!'));
    }

    // Check the value of validUser to ensure it contains the expected data
    console.log("Valid User:", validUser);

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      console.log('Wrong password!');
      return next(errorHandler(401, 'Wrong credentials!'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};


  export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = user._doc
      res
        .cookie('access token', token, { httpOnly: true })
        .status(200)
        .json(rest)
      
    } else {
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashedPassword = bcrypt.hashSync(generatePassword, 10)
      const newUser= new User({username:req.body.name.split("").join("").toLowerCase() +Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar:req.body.photo})
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password, pass, ...rest } = newUser._doc
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
      
    }
      
  } catch(error) {
    next(error)
  }
}
