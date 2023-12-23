import { Sequelize, DataTypes, Model } from 'sequelize';

// database connection, this can be replaced with any type of database or ORM
const sequelize = new Sequelize("database", "alhareth", "test", {
    dialect: "sqlite",
    storage: "./database.sqlite"
});

export async function connect() {
    await sequelize.sync();
    try {
        await sequelize.authenticate();
        console.log("connected to the DB");
    } catch (error) {
        console.log(error);
    }
}

export class User extends Model { }

// User Model
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
    },
    password: DataTypes.STRING,
    googleId: DataTypes.STRING,
    salt: DataTypes.STRING
}, {
    sequelize,
    modelName: 'User'
});

