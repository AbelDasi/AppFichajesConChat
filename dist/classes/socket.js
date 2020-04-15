const { io } = require('./server');



io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.emit('test', 'me pone to burro esto papi');


    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);
    });

});
    
