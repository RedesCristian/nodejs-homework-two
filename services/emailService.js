const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, token) => {
    const msg = {
        to: email,
        from: 'redescristy93@gmail.com',
        subject: 'Email verification',
        text: `Verify your email by clicking on the following link: ${process.env.BASE_URL}/verify/${token}`,
        html: `<p>Verify your email by clicking <a href="${process.env.BASE_URL}/verify/${token}">here</a>.</p>`,
    };

    try {
        await sgMail.send(msg);
        console.log("Verification email sent successfully");
        return { status: 'success', message: 'Verification email sent' };
    } catch (error) {
        console.error("Error sending email:", error.message);
        return { status: 'error', message: 'Failed to send verification email' };
    }
};

module.exports = { sendVerificationEmail };
