const jwt = require('jsonwebtoken');
const https = require('https');
const querystring = require('querystring');
const { User } = require('../models');

const GOOGLE_CLIENT_ID = '735071305838-t06qvvaqhjf9o2sbtcae0ogk2npo6jj0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const googleFetch = (url, options = {}) =>
  new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

      const isValid = await user.comparePassword(password);
      if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas.' });

      const token = generateToken(user.id);
      res.json({ token, user: user.toJSON() });
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: 'Email já cadastrado.' });

      const user = await User.create({ name, email, password });
      const token = generateToken(user.id);
      res.status(201).json({ token, user: user.toJSON() });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
    }
  },

  async googleAuthCode(req, res) {
    try {
      const { code, codeVerifier, redirectUri } = req.body;
      if (!code) return res.status(400).json({ message: 'Código não fornecido.' });

      // Exchange code for tokens
      const body = querystring.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
      });

      const tokens = await googleFetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
        body,
      });

      if (tokens.error) return res.status(401).json({ message: `Google: ${tokens.error_description || tokens.error}` });

      // Get user info
      const userInfo = await googleFetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );

      const { email, name, picture } = userInfo;
      let user = await User.findOne({ where: { email } });
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-20);
        user = await User.create({ name: name || email.split('@')[0], email, password: randomPassword, avatar: picture || null, role: 'manager' });
      } else if (picture && !user.avatar) {
        await user.update({ avatar: picture });
      }

      const token = generateToken(user.id);
      res.json({ token, user: user.toJSON() });
    } catch (error) {
      res.status(500).json({ message: 'Erro na autenticação com Google.', error: error.message });
    }
  },

  async googleAuth(req, res) {
    try {
      const { id_token } = req.body;
      if (!id_token) return res.status(400).json({ message: 'Token Google não fornecido.' });

      // Verify id_token directly with Google's tokeninfo endpoint
      const googleData = await new Promise((resolve, reject) => {
        const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`;
        https.get(url, (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch { reject(new Error('Resposta inválida do Google.')); }
          });
        }).on('error', reject);
      });

      if (googleData.error) return res.status(401).json({ message: 'Token Google inválido.' });

      const { email, name, picture } = googleData;
      let user = await User.findOne({ where: { email } });
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-20);
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          password: randomPassword,
          avatar: picture || null,
          role: 'manager',
        });
      } else if (picture && !user.avatar) {
        await user.update({ avatar: picture });
      }

      const token = generateToken(user.id);
      res.json({ token, user: user.toJSON() });
    } catch (error) {
      res.status(500).json({ message: 'Erro na autenticação com Google.', error: error.message });
    }
  },

  async me(req, res) {
    res.json({ user: req.user.toJSON() });
  },

  async updateProfile(req, res) {
    try {
      const { name, avatar } = req.body;
      await req.user.update({ name, avatar });
      res.json({ user: req.user.toJSON() });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar perfil.', error: error.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const isValid = await req.user.comparePassword(currentPassword);
      if (!isValid) return res.status(400).json({ message: 'Senha atual incorreta.' });
      await req.user.update({ password: newPassword });
      res.json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao alterar senha.', error: error.message });
    }
  },
};

module.exports = authController;
