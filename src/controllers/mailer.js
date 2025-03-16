import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.USER_EMAIL, // Your Gmail email address
//         clientId: process.env.CLIENT_ID_EMAIL, // OAuth 2.0 client ID
//         clientSecret: process.env.CLIENT_SECRET_EMAIL, // OAuth 2.0 client secret
//         refreshToken: process.env.REFRESH_TOKEN_EMAIL // OAuth 2.0 refresh token
//     }
// });

// export const sendEmail = async (req, res, email, token) => {
//     const verificationLink = `http://localhost:3001/verify?token=${token}`
//     console.log("Email: ", email, " token: ", token);
    
//     try {
//         const info = await transporter.sendMail({
//             from: "Video Belajar",
//             to: email,
//             subject: "Your Verification Email ✔",
//             html: `<a href="${verificationLink}">Verify your email</a>`,
//         });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ message: "Failed to send email", error });
//     };
// };


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.USER_EMAIL,
//         pass: "b75KaAcuj!"
//     }
// });

// const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: 'recipient@example.com',
//     subject: 'Hello from Nodemailer',
//     text: 'This is a test email!'
// };

// export const sendEmail = () => {
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: "betatest4590@gmail.com",
//       pass: "b75KaAcuj!",
//     },
// });
  
// // async..await is not allowed in global scope, must use a wrapper
// export async function sendEmail() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//       to: "fauzihzm@gmail.com, fauzihzm@gmail.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
  
//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }
  
//   main().catch(console.error);

// Create a transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'betatest4590@gmail.com', // Your Gmail address
        pass: 'yzir dtrm nyxo kysr'    // Your Gmail app password (not your regular password)
    }
});

const halo = 1;

// Email options
const mailOptions = {
    from: 'betatest4590@gmail.com',    // Sender address
    to: 'dohap10339@dmener.com', // Recipient address
    subject: 'Test Email test from Node.js', // Subject line
    text: 'Halo Halo', // Plain text body
    // html: '<a href=`https://www.example.com/?id=${halo}`>Ini Google 1</a><p>Hello, this is a <b>test halo halo email</b> sent from Node.js using Nodemailer!</p>' // HTML body
    // html: `<a href="https://www.example.com/?id=${halo}">Ini Google 2</a>
    // <p>Hello, this is a <b>test halo halo email</b> sent from Node.js using Nodemailer!</p>`
    // html: `
    //     <p>Hello, this is a test email with an API form!</p>
    //     <form action="http://localhost:3001/courses/2" method="POST">
    //         <input type="hidden" name="_method" value="PATCH">
    //         <button type="submit" style="
    //             background-color: #4CAF50; /* Warna latar */
    //             color: white; /* Warna teks */
    //             padding: 10px 20px; /* Padding */
    //             text-align: center; /* Pusatkan teks */
    //             text-decoration: none; /* Hilangkan garis bawah */
    //             display: inline-block; /* Buat elemen inline */
    //             font-size: 16px; /* Ukuran font */
    //             border-radius: 5px; /* Sudut melengkung */
    //             border: none; /* Hilangkan border */
    //             cursor: pointer; /* Ubah kursor saat diarahkan */
    //         ">
    //             Klik Sayass
    //         </button>
    //     </form>
    // `
    html: `
        <p>Hello, this is a test email with an edit course link!</p>
        <a href="http://localhost:3001/edit-course.html?id=${halo}" style="
            background-color: #4CAF50; /* Warna latar */
            color: white; /* Warna teks */
            padding: 10px 20px; /* Padding */
            text-align: center; /* Pusatkan teks */
            text-decoration: none; /* Hilangkan garis bawah */
            display: inline-block; /* Buat elemen inline */
            font-size: 16px; /* Ukuran font */
            border-radius: 5px; /* Sudut melengkung */
        ">
            Edit Course
        </a>
    `
};
// const myFunction = () => {
//     console.log("Hello world");
    
// }

// Send the email
export async function sendEmail() {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}