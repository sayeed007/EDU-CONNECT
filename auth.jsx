import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "./model/user-model";
import bcrypt from "bcryptjs";

async function refreshAccessToken(token) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            });

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST'
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens?.access_token,
            accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
            refreshToken: refreshedTokens?.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error(error);

        return {
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    const user = await User.findOne({
                        email: credentials.email,
                    });

                    if (user) {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        if (isMatch) {
                            return user;
                        } else {
                            throw new Error("Check your password");
                        }
                    } else {
                        throw new Error("User not found");
                    }
                } catch (error) {
                    console.error(error);
                    throw new Error(error);
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    accessTokenExpires: Date.now() + account.expires_in * 1000,
                    refreshToken: account.refresh_token,
                    user,
                };
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            session.error = token.error;

            return session;
        },
    },
});

console.log("Auth.js configuration secret:", process.env.NEXT_AUTH_SECRET);
