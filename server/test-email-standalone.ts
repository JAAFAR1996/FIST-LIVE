import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

console.log("--- Starting Email Test ---");

// 1. Load Environment
console.log("Loading .env.local...");
const result = dotenv.config({ path: '.env.local' });

if (result.error) {
    console.log("⚠️ Could not load .env.local, trying default .env");
    dotenv.config();
}

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const port = parseInt(process.env.SMTP_PORT || "587");

console.log(`SMTP_HOST: ${host}`);
console.log(`SMTP_PORT: ${port}`);
console.log(`SMTP_USER: ${user ? user : 'NOT SET'}`);
console.log(`SMTP_PASS: ${pass ? '***SET (Length: ' + pass.length + ')***' : 'NOT SET'}`);

if (!host || !user || !pass) {
    console.error("❌ ERROR: Missing credentials in environment variables.");
    process.exit(1);
}

// 2. Configure Transporter
console.log("Configuring transporter...");
const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // True for 465, false for 587
    auth: { user, pass },
    debug: true, // Enable debug logs
});

// 3. Verify and Send
(async () => {
    try {
        console.log("Attempting to verify connection...");
        await transporter.verify();
        console.log("✅ Connection Verified! Credentials are correct.");

        console.log(`Attempting to send test email to ${user}...`);
        const info = await transporter.sendMail({
            from: `"AQUAVO Test" <${user}>`,
            to: user,
            subject: "AQUAVO SMTP Test Message 🐟",
            text: "Congratulations! If you are reading this, your AQUAVO email configuration is working correctly.",
            html: "<h1>Congratulations! 🎉</h1><p>If you are reading this, your <strong>AQUAVO</strong> email configuration is working correctly.</p>"
        });

        console.log("✅ Email Sent Successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);

    } catch (error: any) {
        console.error("\n❌ OPERATION FAILED");
        console.error("----------------");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        if (error.command) console.error("Command:", error.command);
        console.error("----------------");

        if (error.code === 'EAUTH') {
            console.log("\n💡 TIP: Authentication failed. Check your App Password.");
        }
    }
})();
