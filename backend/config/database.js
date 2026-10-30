import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caPath = path.join(__dirname, "ca.pem");

const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
dialect: "mysql",
logging: false,
dialectOptions: {
ssl: {
ca: fs.readFileSync(caPath),
rejectUnauthorized: true,
},
},
pool: {
max: 5,
min: 0,
acquire: 30000,
idle: 10000,
},
}
);

export const connectDB = async () => {
try {
await sequelize.authenticate();
console.log("MySQL Connected Successfully");
} catch (error) {
console.error("MySQL Connection Failed:", error.message);
process.exit(1);
}
};

export default sequelize;
