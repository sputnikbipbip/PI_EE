const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = (email, password, done) => {
        getUserByEmail(email, (error, user) => {
            if (user == null) {
                //req.flash('No user with that email')
                return done(null, false, {message: "No user with that email"})
            } try {
                if ( password === user.password) {
                    return done(null, user);
                } else {
                    //req.flash('Password incorrect')
                    return done(null, false, {message: "Password incorrect"})
                }
            } catch (e) {
                return done(e)
            }
        })
    }

    passport.use(new LocalStrategy({usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        getUserById(id, done)
    })
}

module.exports = initialize