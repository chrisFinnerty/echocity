import jwt from '../node_modules/jsonwebtoken/index.js';
import { SECRET_KEY } from '../config.js';

const createToken = (user) => {
    let payload = {
        id: user.id,
        username: user.username,
        email: user.email
    }

    return jwt.sign(payload, SECRET_KEY);
}

export default createToken;