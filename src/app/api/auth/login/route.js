import { NextResponse } from "next/server";
import { getConnection, sql, querys } from "../../../../models/index.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { serialize } from "cookie";
import { TOKEN_SECRET } from '../../../../../config.js';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de cifrado (debe coincidir con tu sistema existente)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('La longitud de la clave de cifrado debe ser de exactamente 32 caracteres.');
}

const IV_LENGTH = 16;

// Función para descifrar contraseñas (igual que en tu documento)
const decryptPassword = (text) => {
    try {
        const [iv, encryptedText] = text.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Error al descifrar la contraseña');
    }
};

// Función para cifrar contraseñas (para registro/actualización)
const encryptPassword = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({
                message: "Username and password are required"
            }, { status: 400 });
        }

        const pool = await getConnection();

        // Verificar si el usuario existe
        const result = await pool.request()
            .input("UserName", sql.VarChar, username)
            .query(querys.queryLogin);

        if (result.recordset.length === 0) {
            return NextResponse.json({
                message: "User does not exist"
            }, { status: 400 });
        }

        const user = result.recordset[0];

        // Descifrar y verificar la contraseña usando crypto (igual que tu sistema existente)
        let isValidPassword = false;
        try {
            const decryptedPassword = decryptPassword(user.password);
            isValidPassword = password === decryptedPassword;
        } catch (error) {
            console.error("Error al descifrar contraseña:", error);
            return NextResponse.json({
                message: "Error de autenticación"
            }, { status: 400 });
        }

        if (!isValidPassword) {
            return NextResponse.json({
                message: "Invalid password"
            }, { status: 400 });
        }

        // Obtener roles del usuario
        const rolesResult = await pool.request()
            .input("user_id", sql.Int, user.id)
            .query(querys.querySelectRolesByuserID);

        const roles = rolesResult.recordset;

        const userDetails = {
            _id: user.id,
            nombre: user.nombre,
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
            secure: false, // true en producción
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
        return NextResponse.json({
            message: "Error logging in: " + error.message
        }, { status: 500 });
    }
}

// Función auxiliar para registro/actualización de usuarios (si la necesitas)
export const encryptUserPassword = encryptPassword;