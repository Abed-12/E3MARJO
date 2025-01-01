import nodemailer from "nodemailer";


const sendEmail = (to, subject, body, isHtml) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SSL_ENABLED === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
    };
    if (isHtml) {
        mailOptions.html = body
    } else {
        mailOptions.text = body
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });

}

export {sendEmail}