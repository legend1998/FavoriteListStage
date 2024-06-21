// server.js
import app from "./index";

const port = 3000;
let server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default server;
