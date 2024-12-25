import "dotenv/config";
import * as env from "env-var";

interface EnvVars {
    PORT: number;
}

export const envs: EnvVars = {
    PORT: env.get("PORT").required().asPortNumber()
};