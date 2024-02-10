import { prepareModules } from "./utils";

prepareModules().catch((error) => {
  console.error(error);
  process.exit(1);
});
