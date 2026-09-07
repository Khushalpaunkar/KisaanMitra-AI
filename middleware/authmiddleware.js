const isAuthenticated = (req, res, next) => {
    if(req.session.userId) {
        next();
    } else {
        res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
    }
};

module.exports = isAuthenticated ;