import express, { Request, Response } from "express";
import fs from "node:fs";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Penis, Express with TypeScript!");
});

app.get("/favicon.ico", (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync("assets/computer_monitor_18859.ico");
    res.setHeader("Content-Type", "image/x-icon");
    res.status(200).send(data);
  } catch (err) {
    res.status(404);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
