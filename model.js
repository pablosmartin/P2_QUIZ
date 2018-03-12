const fs = require('fs');



const DB_FILENAME = 'quizzes.json';
/*
*Inicializador del array/base de datos
*/
let quizzes = [
	{
		question: "Capital de Italia",
		answer: "Roma"

	},
	{
		question: "Capital de España",
		answer: "Madrid"

	},
	{
		question: "Capital de Francia",
		answer: "París"

	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"

	}
];


/**
*Devuelve el numero de elementos de quizzes, que son las preguntas existentes.
*
*/
exports.count = () => quizzes.length;

/**
*Añade una nueva pregunta al quiz.
*
*/
exports.add = (question, answer) => {
	
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
    });
};

/**
*Actualiza (modifica) el quiz situado en la posicion index.
*
*@param id        Quiz a actualizar
*@param pregunta  Nueva pregunta
*@param           Nueva respuesta
*/
exports.update = (id, question, answer) =>{

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim,
		answer: (answer || "").trim()
	});
	save();

};

/**
*Devuelve todos los elementos del array.
*Para ello hace string de todos los elementos y despues genera con parse otro array clon del primero.
*Esto es para evitar que accedan directamente a la 
*/
exports.getAll =() => JSON.parse(JSON.stringify(quizzes));


/**
*Devuelve un elemento del array por id (desde un array clon)
*
*/
exports.getByIndex = id =>{
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	return JSON.parse(JSON.stringify(quiz));
	
};

exports.deleteByIndex = id => {

	const quiz = quizzes [id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	quizzes.splice(id, 1);
};


const load = () => {
		fs.readFile(DB_FILENAME,(err,data) => {
			if(err){
				// La primera vez no existe el fichero 
				if(err.code === "ENOENT"){
					save();  // Valores iniciales.
					return;
				}
				throw err;
			}

			let json = JSON.parse(data);

			if(json){
				quizzes = json;
			}
		});

	};


	const save = () => {
		fs.writeFile(DB_FILENAME,JSON.stringify(quizzes), 
			err => {
			if(err) throw err;
		});
	};

	load();