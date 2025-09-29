import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/users.routes.ts";

const app = express();
app.use(bodyParser.json());

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
