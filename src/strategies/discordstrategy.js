const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

passport.serializeUser((user, done) => {
    console.log("Serialize");
    done(null, user.id)
});



passport.deserializeUser(async (id, done) => {
    console.log("Deserializing");
    const user = await DiscordUser.findById(id);
    if(user) 
        done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: "684863651546529819",
    clientSecret: "08RNtWmJecnQEAHYYDX9w5JOpr6X54an",
    callbackURL: "http://localhost:3000/auth/redirect",
    scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({ discordId: profile.id });
        let avatar = profile.avatar
        if(!avatar) avatar = "data:image/png;base64,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"
        if(user)
        {
            console.log("User exists.");
            await user.updateOne({
                username: `${profile.username}#${profile.discriminator}`,
                guilds: profile.guilds,
                avatar: avatar,
                flags: profile.flags
            });
            done(null, user);
        }
        else {
            console.log("User does not exist");
            const newUser = await DiscordUser.create({
                discordId: profile.id,
                username: `${profile.username}#${profile.discriminator}`,
                guilds: profile.guilds,
                avatar: avatar,
                mod: false,
                postador: false,
                flags: profile.flags
            });

            const savedUser = await newUser.save();

            done(null, savedUser);
        }
    }

    catch(err) {
        console.log(err);
        done(err, null);
    }
}));

