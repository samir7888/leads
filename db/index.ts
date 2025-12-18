import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as authSchema from "./schema/auth"
import * as leadsSchema from "./schema/leads"
import * as ledgersSchema from "./schema/ledgers"
import * as transactionsSchema from "./schema/transactions"
import * as relationsSchema from "./schema/relations"

const connectionString = process.env.AUTH_DRIZZLE_URL!;
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool, {
    schema: {
        ...authSchema,
        ...leadsSchema,
        ...ledgersSchema,
        ...transactionsSchema,
        ...relationsSchema,
    }
});