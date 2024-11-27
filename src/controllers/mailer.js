import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.USER_EMAIL, // Your Gmail email address
        clientId: process.env.CLIENT_ID_EMAIL, // OAuth 2.0 client ID
        clientSecret: process.env.CLIENT_SECRET_EMAIL, // OAuth 2.0 client secret
        refreshToken: process.env.REFRESH_TOKEN_EMAIL // OAuth 2.0 refresh token
    }
});

  // async..await is not allowed in global scope, must use a wrapper
// export async function main() {
export const sendEmail = async (req, res, email, token) => {
    // send mail with defined transport object
    const verificationLink = `http://localhost:3001/verify?token=${token}`
    console.log("Email: ", email, " token: ", token);
    
    try {
        const info = await transporter.sendMail({
            from: "Video Belajar",
            to: email,
            subject: "Your Verification Email ✔", // Subject line
            // text: `Your is ${token}`, // plain text body
            html: `<a href="${verificationLink}">Verify your email</a>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
        // res.status(200).json({ message: "Success", info: info.messageId });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error });
    };
};