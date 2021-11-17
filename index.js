const { app, sequelize } = require('./app');

app.listen({port: 8080}, () => {
    try {
        sequelize.authenticate();
        sequelize.sync({ alter:true });
        console.log('Connected to DB');
    } catch (error) {
        console.log('Failed to connect to DB', error);
    }
    console.log('Server is running');
});
