const app = require("./src/app");
const env = require("./src/config/env");

app.listen(env.PORT, () => {
  console.log(`Backend server running on port ${env.PORT}`);
});
