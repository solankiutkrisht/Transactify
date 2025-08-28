import { useEffect, useRef, useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const otpInput = [0, 1, 2, 3];
  const [userInput, setUserInput] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeCondition, setAgreeCondition] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countrycode, setCountrycode] = useState("");

  const handleSignupButton = () => {
    if (step == 0) {
      const userData = {
        firstName: fName,
        lastname: lName,
        email: email,
        mobile: phoneNumber,
        countryCode: "+" + countrycode,
        password: password,
      };
      console.log(userData);
      setStep(1);
    }
    if (step == 1) {
      const inputOTP = userInput.reduce(
        (prevVal = "", currentVal) => (prevVal += currentVal)
      );
      console.log(inputOTP);
      window.alert("Congratulations you have been registered!");
      navigate("/login");
    }
  };
  useEffect(() => {
    console.log("useEffect");

    if (activeIndex < otpInput.length && step === 1) {
      inputRef.current[activeIndex].focus();
    }
  }, [step, activeIndex]);
  const handleOTPValue = (e, id) => {
    const tempInput = [...userInput];
    tempInput[id] = String(e.target.value).slice(-1);
    setUserInput(tempInput);
    setActiveIndex(id + 1);
  };
  return (
    <div className="register-page">
      <div className="register-container">
        <div>
          <h1>Create a free account</h1>
          <p>Gain access to more features with an account</p>
        </div>

        <div className="register-form">
          {step === 0 ? (
            <>
              <div className="double-input-div">
                <div className="single-input">
                  <div className="single-input-div">
                    <label htmlFor="inputFirstName">First Name</label>
                    <input
                      required
                      id="inputFirstName"
                      type="text"
                      className="form-control"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="single-input">
                  <div className="single-input-div">
                    <label htmlFor="inputLastName">Last Name</label>
                    <input
                      required
                      id="inputLastName"
                      type="text"
                      className="form-control"
                      value={lName}
                      onChange={(e) => setLName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="phone-number-input-div">
                <div className="single-input-div">
                  <label htmlFor="inputMobileNumber">Mobile Number</label>
                  <div className="mobile-number-input">
                    <div>
                      <span>+</span>
                      <input
                        type="number"
                        value={countrycode}
                        placeholder="Country Code"
                        onChange={(e) => setCountrycode(e.target.value)}
                      />
                    </div>

                    <input
                      type="number"
                      max="10000000000"
                      min={"999999999"}
                      placeholder="Mobile Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="single-input-div">
                <label htmlFor="inputEmail">Email</label>
                <input
                  required
                  id="inputEmail"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="single-input-div">
                <label htmlFor="inputPassword">Password</label>
                <input
                  required
                  id="inputPassword"
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="terms-and-condition-div">
                <input
                  required
                  type="checkbox"
                  onClick={() => setAgreeCondition(!agreeCondition)}
                />
                <p>I agree to the Terms of Service</p>
              </div>
            </>
          ) : (
            <>
              <p>
                Enter the OTP sent to <a>{name}</a>
              </p>
              <div className="otp-input-div">
                {otpInput.map((inp) => (
                  <input
                    type="number"
                    key={inp}
                    value={userInput[inp]}
                    ref={(ele) => (inputRef.current[inp] = ele)}
                    onChange={(e) => handleOTPValue(e, inp)}
                  />
                ))}
              </div>
            </>
          )}
          <button
            disabled={email === "" || password === "" || !agreeCondition}
            className="w-100"
            onClick={handleSignupButton}
          >
            {step == 0 ? "Next" : "Sign Up"}
          </button>
        </div>
        <div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
