const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    res.status(200).json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
