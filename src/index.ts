import express, { Request, Response } from "express";
import fs from "node:fs";

const app = express();
const port = 3000;

let icon: Buffer | null = null;
let notFound: Buffer | null = null;
try {
  icon = fs.readFileSync("assets/computer_monitor_18859.ico");
  notFound = fs.readFileSync("src/PageNotFound.html");
} catch(err) {
  console.log("Server unable to load required asset files. =(");
  console.error(err);
}

app.get("/", (req: Request, res: Response) => {
  res.send("Penis, Express with TypeScript!");
});

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/x-icon");
  res.status(200).send(icon);
});

app.get("/*notfound", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(notFound);
});

if (icon && notFound) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
