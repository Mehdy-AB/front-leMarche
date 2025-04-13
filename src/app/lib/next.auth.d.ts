import NextAuth from "next-auth";

declare module "next-auth"{
    interface Session{
        user: {
            id: number,
            userName: string,
            firstName: string,
            lastName: string,
            email: string,
            number: string|null,
            passwordVersion: string | Date,
            createdAt: string | Date,
            lastActive: string | Date
        },
        backendToken: {
            accessToken: string,
            refreshToken: string,
        }
    }
}

import {JWT} from "next-auth/jwt"
declare module "next-auth/jwt"{
    interface JWT{
        user: {
            id: number,
            userName: string,
            firstName: string,
            lastName: string,
            email: string,
            number: string|null,
            passwordVersion: string | Date,
            createdAt: string | Date,
            lastActive: string | Date
        },
        backendToken: {
            accessToken: string,
            refreshToken: string,
        }
    }
}
