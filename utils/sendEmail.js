const nodeMaler = require("nodemailer");

const sendEmail = async (options) => {
    const transpoter = nodeMaler.createTransport({
        // host: process.env.GMAIL_HOST,
        // port: process.env.GMAIL_PORT, 
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
