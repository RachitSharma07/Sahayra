const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user"
        });
    }
};

module.exports = createUser;