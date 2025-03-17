import nodemailer from "nodemailer";

// Create a transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL, // Your Gmail address
        pass: process.env.GOOGLE_APP_PASSWORD    // Your Gmail app password (not your regular password)
    }
});

// Email options
const mailOptions = (email, token) => {
    return {
        from: process.env.USER_EMAIL,    // Sender address
        to: email, // Recipient address
        subject: 'Test Email test from Node.js', // Subject line
        text: 'Halo Halo', // Plain text body
        html: `
            <p>Hello, this is a test email with an edit course link!</p>
            <a href="http://localhost:3001/verifyAccount.html?token=${token}" style="
                background-color: #4CAF50; /* Background color */
                color: white; /* Text color */
                padding: 10px 20px; /* Padding */
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                border-radius: 5px;
            ">
                Verify Account
            </a>
        `
    }
};

// Send the email
export async function sendEmail(email, token) {
    transporter.sendMail(mailOptions(email, token), (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}