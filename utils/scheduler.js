const cron = require("node-cron");


cron.schedule("0 0 * * *", () => {
  console.log("Running a scheduled task at midnight...");
  // User can add scheduling task here
});

console.log("Scheduler initialized");
