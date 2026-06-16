const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a security OTP code verification email.
 * @param {string} toEmail 
 * @param {string} otp 
 * @param {string} action - 'registration' or 'login'
 */
const sendOtpEmail = async (toEmail, otp, action) => {
  const isRegister = action.toLowerCase() === 'register';
  const subject = isRegister 
    ? 'EcoCarbon - Verify Your Registration' 
    : 'EcoCarbon - 2FA Security Check';

  const title = isRegister ? 'Confirm Your Registration' : 'Two-Factor Authentication';
  const actionText = isRegister ? 'register your new account' : 'complete your sign-in request';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
      <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin: 0; font-size: 24px;">🌱 EcoCarbon Tracker</h2>
      </div>
      
      <div style="padding: 10px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">${title}</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">
          You requested to ${actionText} on the EcoCarbon platform. Please enter the following 6-digit security code:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 5px; color: #f59e0b; background-color: #fef3c7; padding: 12px 24px; border-radius: 8px; border: 1px solid #fde68a;">
            ${otp}
          </span>
        </div>
        
        <p style="font-size: 13px; line-height: 1.5; color: #718096; margin-top: 30px;">
          This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #edf2f7; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #a0aec0;">
        <p>EcoCarbon Carbon Footprint Tracker Platform</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"EcoCarbon Coach" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmail
};
