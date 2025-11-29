import * as userService from '../services/user.service.js';

//configurações dos cookies
const getCookieOptions = () => ({
    httpOnly: true, //impede acesso via JS
    secure: false, //usar true em produção e false em desenvolvimento
    sameSite: 'Lax',
    maxAge: 1000 * 60 * 60 * 24
});

//============ FUNÇÕES CRUD ============

export const register = async (req, res, next) => {
    try {
    
        const { user, token } = await userService.registerUser(req.body);

        res.cookie('access_token', token, getCookieOptions());

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
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

        res.cookie('access_token', token, getCookieOptions());

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};

//a função de logout expira o token automaticamente
export const logout = (req, res) => {
    res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: false, 
        sameSite: 'Lax'
    });

    res.status(200).json({ message: 'Logout realizado com sucesso!' });
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
        const requester = req.user;
        const requestedId = parseInt(req.params.id);
        if (requester.role === 'Patient' && requester.id !== requestedId) {
            const error = new Error('Acesso negado. Você só pode visualizar seu próprio perfil.');
            error.statusCode = 403;
            throw error;
        }
        //removemos a senha antes de retornar os dados do usuário (boa prática)
        const user = await userService.getUserById(requestedId);
        const userJson = user.toJSON();
        delete userJson.password;
        res.status(200).json(userJson);
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