import type { Lang } from "@teleb/validations/errors";
import type { User } from "@teleb/types/auth";

export type AppEnv = {
  Variables: {
    lang: Lang;
    user: User;
    requestId?: string;
  };
};