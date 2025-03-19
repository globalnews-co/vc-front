import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { TOKEN_SECRET } from "../../../../../config";

export async function POST(req, res) {
    const token = req.cookies.get("token");

    if (!token) {
       
        return NextResponse.json({ mensaje: "No hay token" }, { status: 401 });
    }
    try	{
    verify(token.value, TOKEN_SECRET);
    const cookieStore = serialize('token', null, {
        httpOnly: true,
        secure: false,//cambiar a true en produccion si tenemos https
        sameSite : 'strict', //cambiar a 'none' si da problemas con el login
        maxAge: 0, // 10 horas
        path: '/',
        //...
      });
      return new Response(JSON.stringify({ mensaje:"sesion cerrada" }), {
        status: 200,
        headers: { 'Set-Cookie': cookieStore},
      });
    }catch (error){
        return NextResponse.json({ mensaje: "Token No Autorizado"+(error) }, { status: 401 });
    }
}