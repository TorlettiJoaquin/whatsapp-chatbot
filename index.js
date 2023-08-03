const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Conexion exitosa!');
});

let turnosInterval;

client.on('message', message => {
    console.log(message.body);
	if(message.body === 'Hola') {
		client.sendMessage(message.from, 'Hola buenas tardes');
	} else if(message.body === 'Chau') {
        client.sendMessage(message.from, 'Chau buenas noches');
	} else if(message.body === '') {
        client.sendMessage(message.from, 'TIEMPOS 350$ c/15 min. Se empezara a contar automaticamente en 5 minutos.');
    } else if(message.body === 'Pelotero') {
        client.sendMessage(message.from, 'TIEMPOS 350$ c/15 min.');
        // Programamos el envio de mensajes cada 15 min
        turnosInterval = setInterval(() => {
            client.sendMessage(message.from, 'Paso un turno de 15 min.');
        }, 1 * 60 * 1000); // 15 min en milisegundos
    } else if(message.body === 'Adios') {
        client.sendMessage(message.from, 'Hasta pronto! Esperamos su visita.');
        clearInterval(turnosInterval);
    }
});

client.on('participantAdded', async participant => {
    // Envía un mensaje de bienvenida cuando alguien se une al chat
    const chat = await participant.getChat();
    client.sendMessage(chat.id._serialized, '¡Bienvenido! ¿En qué puedo ayudarte?');
});

client.initialize();