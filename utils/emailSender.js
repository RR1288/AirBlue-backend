//emailSender.js

//Set up constants
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp' if you're using another provider
  auth: {
    user: 'airblue.do.not.reply@gmail.com', // Email address
    pass: 'gequuthoxjzlevrh', // Email app-specific password
  }
});

// Function to send password reset email
async function sendPasswordResetEmail(userEmail, link) {
  // URL to the password reset page, including the reset token as a query parameter
  // Replace stickbug link with ${resetURL} (line 88) whenever that gets made
  //const resetUrl = `https://yourwebsite.com/reset-password?token=some-reset-token`; // Replace with real token when available
  
  const mailOptions = {
    from: 'airblue.do.not.reply@gmail.com',  // Sender address
    to: userEmail,              // Recipient's email address
    subject: 'Password Reset Request',  // Subject line
    html: `
      <html>
        <head>
          <style>
            body {
              background-color: #213547;
              color: #ffffff;
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #2e4b63;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #f7a800;
              font-size: 28px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              color: #ffffff;
            }
            a {
              display: inline-block;
              padding: 12px 25px;
              background-color: #f7a800;
              color: #213547;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
              width: 100%;
              box-sizing: border-box;
            }
            a:hover {
              background-color: #e69e00;
            }
            footer {
              font-size: 12px;
              text-align: center;
              margin-top: 30px;
              color: #c1c1c1;
            }
            @media screen and (min-width: 600px) {
              a {
                width: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Airblue Password Reset Request</h1>
            <p>Hello there,</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${link}">Reset your password</a>
            <p>If you didn’t request this, please ignore this email.</p>
            <footer>
              <p>Thanks, <br> The Airblue Team</p>
            </footer>
          </div>
        </body>
      </html>
    `, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);  // Await the email sending operation
    console.log('Password reset email sent:', info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
}

// Function to send account setup email
async function sendAccountSetupEmail(userEmail, invitationLink) {
  // URL to the account setup page, including the setup token as a query parameter
  // Replace stickbug link with ${setupURL} (line 182) whenever that gets made
  //const setupUrl = `https://yourwebsite.com/setup-account?token=some-setup-token`; // Replace with real token when available
  
  const mailOptions = {
    from: 'airblue.do.not.reply@gmail.com',  // Sender address
    to: userEmail,              // Recipient's email address
    subject: 'Welcome to Airblue! Set Up Your Account',  // Subject line
    html: `
      <html>
        <head>
          <style>
            body {
              background-color: #213547;
              color: #ffffff;
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #2e4b63;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #f7a800;
              font-size: 28px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              color: #ffffff;
            }
            a {
              display: inline-block;
              padding: 12px 25px;
              background-color: #f7a800;
              color: #213547;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
              width: 100%;
              box-sizing: border-box;
            }
            a:hover {
              background-color: #e69e00;
            }
            footer {
              font-size: 12px;
              text-align: center;
              margin-top: 30px;
              color: #c1c1c1;
            }
            @media screen and (min-width: 600px) {
              a {
                width: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Airblue!</h1>
            <p>Hi there,</p>
            <p>Welcome to Airblue! Thank you for choosing us for all you flight booking needs. Click the link below to complete your account setup:</p>
            <a href="${invitationLink}">Set up your account</a>
            <p>${invitationLink}</p>

            <p>If you didn’t request this, please ignore this email.</p>
            <footer>
              <p>Thanks, <br> The Airblue Team</p>
            </footer>
          </div>
        </body>
      </html>
    `, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);  // Await the email sending operation
    console.log('Account setup email sent:', info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending account setup email:', error);
    return { success: false, error: error.message };
  }
}

/*

Commenting main our for now as it was just used for testing

// Main function to test the email functions
function main() {
  const testEmail = 'rjp6321@rit.edu';  // Replace with a valid email address
  
  console.log("Sending password reset email...");
  sendPasswordResetEmail(testEmail);

  console.log("Sending account setup email...");
  sendAccountSetupEmail(testEmail);
}
*/

async function sendInvitation(email, invitationLink){
  // URL to the account setup page, including the setup token as a query parameter
  // Replace stickbug link with ${setupURL} (line 182) whenever that gets made
  //const setupUrl = `https://yourwebsite.com/setup-account?token=some-setup-token`; // Replace with real token when available
  
  const mailOptions = {
    from: 'airblue.do.not.reply@gmail.com',  // Sender address
    to: email,              // Recipient's email address
    subject: 'Your event invite',  // Subject line
    html: `
      <html>
        <head>
          <style>
            body {
              background-color: #213547;
              color: #ffffff;
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #2e4b63;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #f7a800;
              font-size: 28px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              color: #ffffff;
            }
            a {
              display: inline-block;
              padding: 12px 25px;
              background-color: #f7a800;
              color: #213547;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
              width: 100%;
              box-sizing: border-box;
            }
            a:hover {
              background-color: #e69e00;
            }
            footer {
              font-size: 12px;
              text-align: center;
              margin-top: 30px;
              color: #c1c1c1;
            }
            @media screen and (min-width: 600px) {
              a {
                width: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You Have been Invited to an event!</h1>
            <p>Hi there,</p>
            <p>Hello You e have been invited to join an event. Click the button below to accept the invite</p>
            <a href="${invitationLink}">Accept invite</a>
            <p>${invitationLink}</p>

            <p>If you didn’t request this, please ignore this email.</p>
            <footer>
              <p>Thanks, <br> The Airblue Team</p>
            </footer>
          </div>
        </body>
      </html>
    `, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);  // Await the email sending operation
    console.log('Invitation email sent:', info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error: error.message };
  }
}

//Export the functions to be used in your test file
module.exports = {
    sendPasswordResetEmail,
    sendAccountSetupEmail,
    sendInvitation,
  };

// Call the main function to test
//main();
