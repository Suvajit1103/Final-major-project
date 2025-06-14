const cron = require("node-cron");
const twilio = require("twilio");
const User = require("./models/user");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Schedule reminder on the 1st of every month at 9 AM
cron.schedule("0 9 1 * *", async () => {
  try {
    const users = await User.find();
    users.forEach(user => {
      client.messages.create({
        body: `Reminder: Your monthly loan payment is due. Please make the payment to avoid penalties.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      });
    });
    console.log("Monthly payment reminders sent.");
  } catch (error) {
    console.error("Failed to send payment reminders:", error);
  }
});

console.log("Scheduled job for monthly payment reminders loaded.");
