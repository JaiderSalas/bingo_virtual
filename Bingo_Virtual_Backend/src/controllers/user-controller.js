import User from "../models/User.js";
import bcrypt from "bcrypt";
import {createAccessToken} from "../libs/jwt.js";
import dotenv from "dotenv";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userFount = await User.findOne({email});
        if (userFount) return res.status(400).json(['El usuario ya existe']); 
        const passwordHash = await bcrypt.hash(password, 10);
        
        const newUser = new User({ name, email, password: passwordHash });

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie('token', token)
        res.json({
            message: 'Usuario creado correctamente',
            user: userSaved,
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error al crear el usuario',
            error,
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
       
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = await createAccessToken({ id: user._id });
        res.cookie('token', token)
        res.json({ message: 'Inicio de sesión correcto', username: user.name, email: user.email });

      } catch (error) {
        res.status(400).json({ message: 'Error al iniciar sesión', error });
      }
}

export const logout = async (req, res) => {
    res.cookie('token', '', {
        experies: new Date(0),
    });
    return res.json({ message: 'Logout' });
}

export const profile = async (req, res) => {
    const user = await User.findById(req.user.id)

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    res.json(user);
    ;
}

export const verifyToken = async (req, res) => {
    const {token} = req.cookies;
    if (!token) return res.status(400).json({ message: 'No autorizado' });

    jwt.verify(token, dotenv.config(),parsed.JWT_SECRET, async (error, decoded) => {
        if (error) return res.status(401).json({ message: 'No autorizado' });
        
        const userFound = await User.findById(decoded.id)
        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });
    
        return res.json(
            {id: userFound._id, name: userFound.name, email: userFound.email}
        );
    });
};