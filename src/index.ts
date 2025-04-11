import express, { Request, Response } from "express";
import fs from "node:fs";

const app = express();
const port = 3000;
let counter = 0;

let icon: Buffer | null = null;
let notFound: Buffer | null = null;
try {
  icon = fs.readFileSync("assets/computer_monitor_18859.ico");
  notFound = fs.readFileSync("src/PageNotFound.html");
} catch (err) {
  console.log("Server unable to load required asset files. =(");
  console.error(err);
}

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.get("/", (req: Request, res: Response) => {
  res.send("Penis, Express with TypeScript!");
});

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/x-icon");
  res.status(200).send(icon);
});

app.get("/counter", (req: Request, res: Response) => {
  res.send(`Counter is currently at ${counter}`);
});

app.post("/counter", (req: Request, res: Response) => {
  const value = parseInt(req.body.value);
  const hasValidValue = !isNaN(value);
  const delta = hasValidValue ? value : 0;

  if (!hasValidValue) {
    res.status(400).send("Value not a number");
    return;
  }

  if (delta > 1) {
    res.status(400).send("Value greater than 1");
    return;
  }

  if (delta < 1) {
    res.status(400).send("Value less than 1");
    return;
  }

  counter = counter + value;
  res.status(201).send(`Counter Updated to ${counter}`);
});

//!! IMPORTANT Wildcard goes last
app.get("/*notfound", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(notFound);
});

if (icon && notFound) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
