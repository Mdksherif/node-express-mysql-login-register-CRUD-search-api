const environments = {
    development: {
        database: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS,
            database: process.env.DB_NAME || 'node_mysql_crud_dev'
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        },
        port: process.env.PORT || 3000
    },
    staging: {
        database: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME || 'node_mysql_crud_staging'
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: '2h'
        },
        port: process.env.PORT || 4000
    }
};

const currentEnv = process.env.NODE_ENV || 'development';
module.exports = environments[currentEnv];