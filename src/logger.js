// logger.js
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors())
app.use(express.json());

app.post('/log', (req, res) => {
  console.log("Browser log:", req.body.log);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Listening on http://10.0.2.2:3000");
});