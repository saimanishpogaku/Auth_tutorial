var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '', // generated ethereal user
        pass: '' // generated ethereal password
    },
});

var mailOptions = {
    from: 'noreply@xyz.com',
    to: 'saimanishpogaku@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'Email sending with Node Js!'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});