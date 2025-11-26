import * as userService from '../services/user.service.js';

// --- CONFIGURAÇÃO DE COOKIE ---
// Configuração padrão para garantir segurança
const getCookieOptions = () => ({
    httpOnly: true, // ESSENCIAL: Impede acesso via JavaScript (Proteção XSS)
    secure: false, // Use 'true' em produção (HTTPS) e 'false' em desenvolvimento local (HTTP)
    sameSite: 'Lax', // Mitiga ataques CSRF
    maxAge: 1000 * 60 * 60 * 24 // 24 horas (ajustar conforme o '1d' do seu JWT)
});

// --- FIM DA CONFIGURAÇÃO DE COOKIE ---

export const register = async (req, res, next) => {
    try {
    
        const { user, token } = await userService.registerUser(req.body);

        // 1. Define o cookie HTTP-only com o token
        res.cookie('access_token', token, getCookieOptions());

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(201).json({
            message: 'Usuário registrado com sucesso! Token armazenado em cookie seguro',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body; 
        const { user, token } = await userService.loginUser(email, password);

        // 1. Define o cookie HTTP-only com o token
        res.cookie('access_token', token, getCookieOptions());

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(200).json({
            message: 'Login realizado com sucesso! Token armazenado em cookie seguro',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};

// 3. FUNÇÃO LOGOUT (Nova)
export const logout = (req, res) => {
    // Para remover o cookie, definimos ele novamente, mas com uma data de expiração passada.
    res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0), // Expira imediatamente
        secure: false, 
        sameSite: 'Lax'
    });

    res.status(200).json({ message: 'Logout realizado com sucesso.' });
};

export const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await userService.removeUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};