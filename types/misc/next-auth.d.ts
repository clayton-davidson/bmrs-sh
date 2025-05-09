import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    roles?: string[];
    accessToken?: string;
  }

  interface Session {
    user: User & {
      id: string;
      roles?: string[];
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    roles?: string[];
    accessToken?: string;
  }
}
