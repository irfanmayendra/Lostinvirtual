import NextAuth from "next-auth";
import { authOptions } from "../../../../packages/auth/auth-options";

export default NextAuth(authOptions);
