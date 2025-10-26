import NextAuth, { type NextAuthConfig, type DefaultSession } from "next-auth";
import Discord, { type DiscordProfile } from "next-auth/providers/discord";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from "next-auth/jwt";
import { hasWhitelistedRole } from "@/lib/discordUtils";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      discord_id: string;
      hasAccess: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discord_id: string;
    username: string;
    hasAccess: boolean;
    last_role_check: number;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, profile, account, trigger }) {
      if (trigger === "signIn") {
        if (profile && account?.provider === "discord") {
          const discordProfile = profile as DiscordProfile;
          token.discord_id = discordProfile.id;
          token.username = discordProfile.username;

          try {
            token.hasAccess = await hasWhitelistedRole(token.discord_id);
            token.last_role_check = Date.now();
          } catch (error) {
            console.error(`Role fetch warning for ${token.username}: ${error}`);
          }
        }
      } else if (token) {
        const currentTime = Date.now();
        const timeDiff = currentTime - (token.last_role_check ?? 0);

        const TEN_MINUTES = 10 * 60 * 1000;
        const ONE_HOUR = 60 * 60 * 1000;

        if ((token.hasAccess && timeDiff > TEN_MINUTES) || (!token.hasAccess && timeDiff > ONE_HOUR)) {
          token.last_role_check = currentTime;
          console.debug(`Refreshing role information for user ${token.username}`);
          try {
            token.hasAccess = await hasWhitelistedRole(token.discord_id as string);
          } catch (error) {
            console.error(`Role fetch warning for ${token.username}: ${error}`);
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        username: token.username,
        discord_id: token.discord_id,
        hasAccess: token.hasAccess || false,
      };

      return session;
    },
  },

  events: {
    async signIn({ profile }) {
      console.debug(`User signed in: ${profile?.username} (${profile?.id})`);
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
