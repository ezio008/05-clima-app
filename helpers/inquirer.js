const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('========================'.green);
    console.log(' Seleccione una opción'.white);
    console.log('========================\n'.green);

    const { opcion } = await inquirer.prompt(questions);

    return opcion;
}

const pausa = async () => {

    console.log('\n');
    await inquirer.prompt([
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'Enter'.green} para continuar`,
        }
    ]);
}

const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]
    const { desc } = await inquirer.prompt(question);
    return desc;
}

const confirmacion = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const listarLugares = async (choices = []) => {
    const options = [
        {
            type: 'list',
            name: 'del',
            message: 'Seccione lugar:',
            choices
        }
    ]
    const { del } = await inquirer.prompt(options);
    return del;
}

const mostrarListadoChecklist = async (choices = []) => {
    const options = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccionen',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(options);
    return ids;
}

module.exports = { inquirerMenu, pausa, leerInput, listarLugares, confirmacion, mostrarListadoChecklist };