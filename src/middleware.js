import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const token = request.cookies.get("token");
    const loginOrRegisterPath = request.nextUrl.pathname.includes("/login") || request.nextUrl.pathname.includes("/register");

    if (!token || token === "undefined") {
        if (loginOrRegisterPath) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url));
    } else {
        try {
            const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.TOKEN_SECRET));

            if (loginOrRegisterPath) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            console.error("JWT verification error:", error);

            if (!loginOrRegisterPath) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
