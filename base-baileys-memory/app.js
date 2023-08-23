const {
	createBot,
	createProvider,
	createFlow,
	addKeyword,
} = require('@bot-whatsapp/bot');

const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

let nombre;

const flowAdios = addKeyword([
	'Boton 1',
	'Adios',
	'ADIÓS',
	'ADIOS 👇',
	'ADIOS 👇👋',
	'A DIOS',
	'👋',
	'bye',
	'bai',
	'bay',
	'chau',
]).addAnswer('Espero que hayas disfrutado! 🥳 Hasta pronto! 🎊');

const flowBotones = addKeyword('Botones').addAnswer(
	'Este mensaje envia tres botones',
	{
		buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
	},
	null,
	flowAdios
);

const flowPrincipal = addKeyword([
	'hola',
	'alo',
	'hello',
	'hi',
	'hoa',
	'holi',
	'ola',
	'oli',
	'hoa',
	'hol',
])
	.addAnswer('🎊 Hola bienvenido/a al pelotero de *PLAYGROUND* 🥳')
	.addAnswer(
		['Por favor, escriba a continuacion solo el *NOMBRE* del niño o niña 🎉'],
		{
			capture: true,
		},
		async (ctx, { flowDynamic }) => {
			nombre = ctx.body;
			return flowDynamic(`Hola *${nombre}* y Muchas gracias!👋
			\nAl momento de RETIRAR a *${nombre}* por favor escriba ADIOS 👇👋`);
		}
	);

const main = async () => {
	const adapterDB = new MockAdapter();
	const adapterFlow = createFlow([flowPrincipal, flowBotones, flowAdios]);
	const adapterProvider = createProvider(BaileysProvider);

	createBot({
		flow: adapterFlow,
		provider: adapterProvider,
		database: adapterDB,
	});
};

main();
