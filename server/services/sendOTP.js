const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_TRANSACTIFY_APP_PASSWORD,
  },
});

const otpEmailTemplate = (otpCode) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TRANSACTIFY</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td {
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #eeeeee;
        }
        .header img {
            max-width: 180px; /* Adjust based on your logo size if needed */
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333333;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .otp-code {
            display: inline-block;
            background-color: #f1f1f1;
            padding: 15px 30px;
            font-size: 28px;
            font-weight: bold;
            color: #000000;
            border-radius: 4px;
            margin: 25px 0;
            letter-spacing: 2px;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #eeeeee;
        }
        .footer p {
            margin: 5px 0;
        }
        .link {
            color: #007bff;
            text-decoration: none;
        }

        /* Responsive styles */
        @media only screen and (max-width: 620px) {
            .container {
                width: 100% !important;
                border-radius: 0;
                box-shadow: none;
            }
            .content {
                padding: 20px;
            }
            .otp-code {
                font-size: 24px;
                padding: 12px 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="cid:transactifyLogo" alt="TRANSACTIFY Logo">
        </div>
        <div class="content">
            <h2>Verify Your TRANSACTIFY Account</h2>
            <p>Thank you for registering with TRANSACTIFY. To complete your registration and secure your account, please use the following One-Time Password (OTP):</p>
            <div class="otp-code">${otpCode}</div>
            <p>This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
            <p>If you did not request this code, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
            <p>TRANSACTIFY © 2025. All rights reserved.</p>
            <p><a href="YOUR_WEBSITE_URL_HERE" class="link">Visit our website</a> | <a href="YOUR_SUPPORT_EMAIL_LINK_HERE" class="link">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
`;

exports.sendEmailOTP = async (receiver, otp) => {
  const logoPath = path.join(
    __dirname,
    "..",
    "public",
    "transactify_logo_96.png"
  );
  const logoBuffer = fs.readFileSync(logoPath);

  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: receiver,
      subject: `Your TRANSACTIFY OTP Verification Code`,
      text: `Your One-Time Password (OTP) for TRANSACTIFY is: ${otp}. This code is valid for 10 minutes. Please do not share this code with anyone.`,
      html: otpEmailTemplate(otp),
      attachments: [
        {
          filename: "transactify_logo.png",
          content: logoBuffer,
          cid: "transactifyLogo",
        },
      ],
    };

    let retry_otp_send = 1,
      otp_sent_flag = 0;
    while (otp_sent_flag === 0 && retry_otp_send <= 5) {
      const info = await transporter.sendMail(mailOptions);

      if (info.response) {
        otp_sent_flag = 1;
      } else {
        retry_otp_send++;
      }
    }

    console.log("Email sent successfully to :", receiver);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
