import express from 'express';
import type {Request, Response, Express} from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
  res.send({"message": "Hello, World!"});
});

app.get('/home', (req: Request, res: Response) => {
  res.send({"message": "Welcome to Home Page"})
})

export default app;