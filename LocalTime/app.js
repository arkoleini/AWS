const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="display:flex; justify-content:center; align-items:center; height:100vh;">
        <h1 id="time"></h1>

        <script>
          function updateTime() {
            const currentTime = new Date().toLocaleTimeString();
            document.getElementById('time').textContent = currentTime;
          }

          // Update the time every second (1000 milliseconds)
          setInterval(updateTime, 1000);

          // Initial update
          updateTime();
        </script>
      </body>
    </html>
  `);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
