import { readFile } from "node:fs/promises";
import path from "node:path";
async function getUsers() {
  const filePath = path.join(process.cwd(), "users.json");
  const data = await readFile(filePath, "utf8");
  const users = JSON.parse(data);
  return users;
}
export default getUsers;
