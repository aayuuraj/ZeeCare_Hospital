import { Sequelize } from "sequelize";

let sequelize = null;

/**
 * Initialize the Sequelize instance.
 * Called AFTER dotenv has loaded env vars.
 */
function initSequelize() {
  // If DATABASE_URL is set (production — PlanetScale / Railway), use it.
  // Otherwise, fall back to individual env vars (local development).
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    sequelize = new Sequelize(
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD || null,
      {
        host: process.env.MYSQL_HOST || "localhost",
        port: process.env.MYSQL_PORT || 3306,
        dialect: "mysql",
        logging: false,
      }
    );
  }
}

/**
 * Returns the Sequelize instance, initializing it on first access.
 */
export function getSequelize() {
  if (!sequelize) {
    initSequelize();
  }
  return sequelize;
}

export const dbConnection = async () => {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    console.log("✅ MySQL connection established successfully.");
    await seq.sync({ alter: true });
    console.log("✅ All models synchronized with the database.");
  } catch (err) {
    console.log(
      `❌ Unable to connect to MySQL database: ${err.message}`
    );
    process.exit(1);
  }
};

// For backward compatibility — models import { sequelize } from this file.
// We export a proxy-like getter via a module-level variable that defers to getSequelize().
// NOTE: Models must call getSequelize() instead of importing `sequelize` directly.
export { sequelize };