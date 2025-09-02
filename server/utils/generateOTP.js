exports.generateOTP = async () => {
  const otpInputs = "1234567890";
  if (process.env.GENERATE_OTP) {
    let otp = "";
    for (let i = 0; i < process.env.OTP_LENGTH; i++) {
      otp += otpInputs.charAt(Math.floor(Math.random() * otpInputs.length));
    }
    return otp;
  } else {
    return 1234;
  }
};
