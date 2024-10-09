/**
 * Simulate a log polling API client.
 */
const LogService = {
    /**
     * This function will invoke the callback with a new log message,
     * until the logs are exhausted, with a delay between each one.
     */
    poll(callback) {
      fetch(window.location.href + "/logs.txt")
        .then(response => {
          return response.text();
        })
        .then(data => {
          const logs = data.split("\n").map(line => line.trim());
          console.debug("Loaded %d lines from log file", logs.length);
          (function loop(i) {
            const log = logs[i];
            if (log) {
              callback(log);
              setTimeout(() => {
                loop(i + 1);
              }, Math.random() * 500);
            }
          })(0);
        });
    }
  };
  
  export default LogService;