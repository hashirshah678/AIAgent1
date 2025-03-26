const { exec } = require("child_process");
const interval = 10 * 1000; // 10 seconds

setInterval(() => {
  exec(
    'node generateCommitMessage.js && git add . && git commit -m "$(node generateCommitMessage.js)" && git push',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Commit error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Commit stderr: ${stderr}`);
        return;
      }
      console.log(`Commit stdout: ${stdout}`);
    }
  );
}, interval);
