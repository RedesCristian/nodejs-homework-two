/* eslint-disable no-undef */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { login } = require('./users'); 

require('dotenv').config();

// eslint-disable-next-line no-undef
describe("Teste simplificate pentru login", () => {
    // eslint-disable-next-line no-undef
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);
    });

    // eslint-disable-next-line no-undef
    afterAll(async () => {
        // Șterge utilizatorul de test și închide conexiunea
        await User.deleteMany({ email: 'test@example.com' });
        await mongoose.disconnect();
    });

    // eslint-disable-next-line no-undef
    it("Ar trebui să returneze status 200 și un obiect cu token și user", async () => {
        // Creează un utilizator de test
        const plainPassword = 'password123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const testUser = await User.create({
            email: 'test@example.com',
            password: hashedPassword,
            subscription: 'starter',
        });

        // Simulează `req` și `res`
        const req = {
            body: {
                email: 'test@example.com',
                password: plainPassword,
            },
        };

        const res = {
            // eslint-disable-next-line no-undef
            status: jest.fn().mockReturnThis(),
            // eslint-disable-next-line no-undef
            json: jest.fn(),
        };

        // Apelează controller-ul `login`
        await login(req, res);

        // Verificări simplificate
        // eslint-disable-next-line no-undef
        expect(res.status).toHaveBeenCalledWith(200);
        // eslint-disable-next-line no-undef
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: expect.any(String),
            user: expect.objectContaining({
                email: 'test@example.com',
                subscription: 'starter',
            }),
        }));

        // Șterge utilizatorul de test
        await User.findByIdAndDelete(testUser._id);
    });
});
