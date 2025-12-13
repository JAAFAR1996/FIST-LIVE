
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
sql`SELECT count(*) FROM products`.then(res => {
    console.log("COUNT:", res[0].count);
    process.exit(0);
});
