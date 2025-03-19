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

        // Verificar si el usuario ya existe
        const result = await pool.request()
            .input("UserName", sql.VarChar, username)
            .query(querys.queryLogin);

        if (result.recordset.length > 0) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        await pool.request()
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar, hashPassword)
            .query(querys.createUser);

        // Verificar que el usuario se haya creado
        const newUserResult = await pool.request()
            .input("UserName", sql.VarChar, username)
            .query(querys.queryLogin);

        if (newUserResult.recordset.length === 0) {
            throw new Error('User creation failed');
        }

        const user = newUserResult.recordset[0];

        // Asignar rol por defecto (por ejemplo, 2)
        const defaultRoleId = 2;
        await pool.request()
            .input("UserID", sql.Int, user.id)
            .input("RoleID", sql.Int, defaultRoleId)
            .query(querys.addRol);

        // Obtener el nombre del rol
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 10, // 10 horas
            path: '/',
        });

        return new Response(JSON.stringify({
            message: "User registered successfully",
            token: token,
            user: userDetails
        }), {
            status: 200,
            headers: { 'Set-Cookie': cookieStore },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Error registering user: " + error.message }, { status: 500 });
    }
}
