const path = require("path");
const {
  saveData,
  readFile,
  writeFilePromise,
} = require("../services/saveData");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../utils/generateOTP");
const jwt = require("jsonwebtoken");
const { sendEmailOTP } = require("../services/sendOTP");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

exports.register = async (req, res) => {
  const { firstName, lastname, email, mobile, countryCode, password } =
    req.body;

  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).send({ error: "Invalid Email Address!" });
  }
  if (mobile.length !== 10 || !Number(mobile)) {
    return res.status(400).send({ error: "Invalid Mobile Number!" });
  }
  if (!countryCode.includes("+") || countryCode.length < 1) {
    return res.status(400).send({ error: "Invalid Country Code!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = await generateOTP();
  const currentTime = new Date();
  //check uniqueness of the email id
  let filePath = path.join(__dirname, "..", "models", "users.json");
  const usersData = await readFile(filePath, "utf-8")
    .then((res) => {
      return JSON.parse(res);
    })
    .catch((err) => {
      console.error(err);
    });
  if (usersData.filter((user) => user.email === email).length > 0) {
    return res.status(400).send({
      error:
        "You are already Registered Please login or use Forgot Password to reset your Password",
    });
  }
  //trigger email based on OTP and OTP should not be vallidated if time is passed
  const result = await saveData(
    {
      _id: uuidv4(),
      firstName,
      lastname,
      email,
      mobile,
      countryCode,
      password: hashedPassword,
      otp,
      otpExpire: currentTime.setMinutes(currentTime.getMinutes() + 10),
      creatDate: currentTime,
      active: false,
      updateDate: currentTime,
    },
    "users"
  );
  const otpSent = await sendEmailOTP(email, otp);

  if (result) {
    return res.status(201).send({ message: "user created!" });
  } else {
    return res
      .status(400)
      .send({ error: "Unable to register. Please try after some time!" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  let filePath = path.join(__dirname, "..", "models", "users.json");
  const usersData = await readFile(filePath, "utf-8")
    .then((res) => {
      return JSON.parse(res);
    })
    .catch((err) => {
      console.error(err);
    });
  let user = usersData.filter((user) => user.email === email);
  if (user.length === 0) {
    return res.status(400).send({
      error: "Invalid Request",
    });
  }
  let userDetails = user[0];
  if (new Date() > userDetails.otpExpire) {
    return res.status(400).send({
      error: "OTP Expired, please regenrate the OTP!",
    });
  }
  if (Number(userDetails.otp) === Number(otp)) {
    const tempUsersData = usersData.filter((user) => user.email !== email);
    tempUsersData.push({
      ...userDetails,
      active: true,
      otp: null,
      otpExpire: null,
      updateDate: new Date(),
    });
    const writtenData = writeFilePromise(
      filePath,
      JSON.stringify(tempUsersData),
      "utf-8"
    )
      .then((res) => {
        console.log(res);

        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
    if (writtenData) {
      res.status(200).send({
        message: "OTP verified successfully!",
      });
    } else {
      res.status(500).send({
        error:
          "Unable to verify the OTP currently. Please try after some time...",
      });
    }
  } else {
    return res.status(500).send({
      error: "Incorrect OTP",
    });
  }
};

exports.regenerateOTP = async (req, res) => {
  const { email } = req.body;
  let filePath = path.join(__dirname, "..", "models", "users.json");
  const usersData = await readFile(filePath, "utf-8")
    .then((res) => {
      return JSON.parse(res);
    })
    .catch((err) => {
      console.error(err);
    });
  let user = usersData.filter((user) => user.email === email);
  if (user.length === 0) {
    return res.status(400).send({
      error: "Invalid Request",
    });
  }
  let userDetails = user[0];
  const otp = await generateOTP();
  userDetails.otp = otp;
  const currentTime = new Date();

  const otpSent = await sendEmailOTP(email, otp);

  if (!otpSent) {
    res.status(500).send({
      error: "Unable to send OTP currently. Please try after some time...",
    });
  }

  userDetails.otpExpire = currentTime.setMinutes(currentTime.getMinutes() + 10);
  let tempUsersData = usersData.filter((user) => user.email !== email);
  tempUsersData.push(userDetails);
  // const writeData = true;
  const writeData = await writeFilePromise(
    filePath,
    JSON.stringify(tempUsersData),
    "utf-8"
  )
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  if (writeData) {
    res.status(200).send({
      message: "OTP generated successfully!",
    });
  } else {
    res.status(500).send({
      error: "Unable to send OTP currently. Please try after some time...",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let filePath = path.join(__dirname, "..", "models", "users.json");
  const usersData = await readFile(filePath, "utf-8")
    .then((res) => {
      return JSON.parse(res);
    })
    .catch((err) => {
      console.error(err);
    });
  let user = usersData.filter((user) => user.email === email);
  if (user.length === 0) {
    return res.status(400).send({
      error: "Invalid Request",
    });
  }
  let userDetails = user[0];
  const comparePassword = await bcrypt.compare(password, userDetails.password);
  console.log(comparePassword);
  if (comparePassword) {
    const accessToken = generateAccessToken(email);
    const refreshToken = generateRefreshToken(email);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      accessToken,
    });
  } else {
    res.status(401).send({
      error: "Invalid credentials!",
    });
  }
};

exports.protectedRoute = async (req, res) => {
  console.log(req.user);
  res.status(200).send({ message: "protected Route!" });
};
