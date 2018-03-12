const readline = require('readline');
const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");


exports.helpCmd = rl => {
		log("Comandos:");
    	log("  h|help - Muestra esta ayuda.");
    	log("  list - Listar los quizzes existentes.");
    	log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
    	log("  add - Añadir un nuevo quiz interactivamente.");
    	log("  delete <id> - Borrar el quiz indicado.");
    	log("  edit <id> - Editar el quiz indicado.");
    	log("  test <id> - Probar el quiz indicado");
    	log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    	log("  credits - Créditos.");
    	log("  q|quit - Salir del programa.");
    rl.prompt();	

}

exports.playCmd = rl => {
	//log('Jugar', 'red');
	let score = 0;

	let toBeResolved = []; // Array con todos los ids de las preguntas que existen array de tamaño model.count

	for (i = 0; i < model.count(); i++) {
    toBeResolved[i] = i;
	};

	const playOne = () => {
	if(toBeResolved.length == 0){
		log('No hay nada más que preguntar.');
		log('Fin del examen. Aciertos:');
		biglog(`${score}`);
		rl.prompt();
	}else{

		let tamaño = toBeResolved.length - 1;

		let id = toBeResolved[Math.trunc(Math.random() * tamaño)];

		let quiz = model.getByIndex(id);

		for (i=0; i<toBeResolved.length; i++){
				if(toBeResolved[i] == id){
					//delete toBeResolved[i];
					toBeResolved.splice(i, 1);
				}
			}	

		rl.question(colorize(`${quiz.question}? `,'red'), answer => {
							
		if(quiz.answer.toLowerCase() === answer.trim().toLowerCase()){

			score = score+1;
			log(`Correcto - Lleva ${score} aciertos. `);
			
			playOne();

		} else{
			log('Incorrecto');
			log('Fin del examen. Aciertos:');
			biglog(`Aciertos : ${score}`,'magenta');
			rl.prompt();
			// Salgo de este método 
			};	
		});


		}
	}
 playOne();

}
exports.editCmd = (rl, id) => {
	//log('Editar el quiz indicado.','red');
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	}else{
		try{
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
				rl.question(colorize('Introduzca una pregunta: ','red'), question => {
					process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
						rl.question(colorize('Introduzca la respuesta: ','red'), answer => {
							model.update(id, question, answer);
							log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por : ${question} ${colorize('=>','magenta')} ${answer}`);
							rl.prompt();
				});
				
			});
		}catch(error){
			errorlog(error.mensaje);
			rl.prompt();
		}
	}
}
exports.deleteCmd = (rl, id) => {
	    //log('Borrar el quiz indicado.', 'red');
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	}else{
		try{
			model.deleteByIndex(id);
		}catch(error){
			errorlog(error.message);
		}
	}
	rl.prompt();

	    rl.prompt();
}
exports.creditsCmd = rl => {
	    log('Autor de la práctica:', 'green');
    	log('  Pablo Sanz Martín', 'green');
    	rl.prompt();
}
exports.testCmd = (rl, id) => {
	    //log('Probar el quiz indicado.','red');
	    if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	}else{
		try{
			const quiz = model.getByIndex(id);

			//log(`[${colorize(id,'magenta')}] : ${quiz.question}`);

			rl.question(colorize(`${quiz.question}? `,'red'), answer => {
							
					if(quiz.answer.toLowerCase() === answer.trim().toLowerCase()){

						log(`Su respuesta es correcta.`);
						// biglog('Correcta','green');
						rl.prompt();

					} else{
						log(`Su respuesta es incorrecta. `);
						// biglog('Incorrecta','red');
						rl.prompt();

					};	
				});

		}catch(error){
			errorlog(error.mensaje);
			rl.prompt();
		}
	}
}
exports.showCmd = (rl, id) => {
	//log('Mostrar en quiz indicado.', 'red');
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	}else{
		try{
			const quiz = model.getByIndex(id);
			log(`  [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		}catch(error){
			errorlog(error.message);
		}
	}
	rl.prompt();
}
exports.listCmd = rl => {
	    //log('Listar todos los quizzes existentes.', 'red');
	    model.getAll().forEach((quiz, id) => {
	    	log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`)

	    });
	    rl.prompt();
}
exports.quitCmd = rl => {
	rl.close();
	rl.prompt();
}
exports.addCmd = rl => {
	//log('Añadir un nuevo quiz.', 'red');
	rl.question(colorize('Introduzca una pregunta: ','red'), question => {
		rl.question(colorize('Introduzca la respuesta: ','red'), answer =>{
			model.add(question,answer);
			log(`[${colorize('Se ha añadido','magenta')}] : ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
	};
  
