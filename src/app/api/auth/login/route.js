import { NextResponse } from "next/server";
import { getConnection, sql, querys } from "../../../../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { serialize } from "cookie";
import { TOKEN_SECRET } from '../../../../../config.js';

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
        }

        const pool = await getConnection();

        // Verificar si el usuario existe
        const result = await pool.request()
            .input("UserName", sql.VarChar, username)
            .query(querys.queryLogin);

        if (result.recordset.length === 0) {
            return NextResponse.json({ message: "User does not exist" }, { status: 400 });
        }

        const user = result.recordset[0];

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        // Obtener roles del usuario
        const rolesResult = await pool.request()
            .input("user_id", sql.Int, user.id)
            .query(querys.querySelectRolesByuserID);
        const roles = rolesResult.recordset;

        const userDetails = {
            _id: user.id,
            username: username.toLowerCase(),
            roles: roles
        };

        // Generar token
        const token = jwt.sign({
            _id: user.id,
            username: username.toLowerCase(),
            roles: roles
        }, TOKEN_SECRET, { expiresIn: '10h' });

        const cookieStore = serialize('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 10, // 10 hours
            path: '/',
        });

        return new Response(JSON.stringify({
            message: "User logged in successfully",
            token: token,
            user: userDetails
        }), {
            status: 200,
            headers: { 'Set-Cookie': cookieStore },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Error logging in: " + error.message }, { status: 500 });
    }
}
