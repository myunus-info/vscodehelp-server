const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.username = user.username;
    this.otp = user.otp;
    this.from = `Vscodehelp Support <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 25,
      auth: {
        user: '28344423b3afcc',
        pass: 'e5c670b61c07b5',
      },
    });
  }

  async send() {
    const message = `
    Hello (${this.username})
    Thanks For joining us.
    Please use the below code to verify your email address.
    Your email verification code is: ${this.otp}
      `;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Please verify your email address',
      text: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
