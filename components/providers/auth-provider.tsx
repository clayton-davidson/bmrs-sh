"use client";

import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext } from "react";

type AuthContextType = {
  session: Session | null;
  isAdmin: boolean;
  isUser: boolean;
  userId: string;
  roles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roleList: string[]) => boolean;
  hasAllRoles: (roleList: string[]) => boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAdmin: false,
  isUser: false,
  userId: "",
  roles: [],
  hasRole: () => false,
  hasAnyRole: () => false,
  hasAllRoles: () => false,
  isAuthenticated: false,
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const roles = session?.user?.roles || [];
  const isAdmin = roles.includes("admin");
  const isUser = roles.includes("user");
  const userId = session?.user?.id || "";
  const isAuthenticated = !!session;

  const hasRole = (role: string) => roles.includes(role);
  const hasAnyRole = (roleList: string[]) =>
    roleList.some((role) => roles.includes(role));
  const hasAllRoles = (roleList: string[]) =>
    roleList.every((role) => roles.includes(role));

  return (
    <AuthContext.Provider
      value={{
        session,
        isAdmin,
        isUser,
        userId,
        roles,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthContext() {
  return useAuth();
}
