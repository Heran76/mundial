import WorldCup, { GRUPOS } from "./WorldCup.js";
import {Ranking} from "./WorldCup.js"


const FaseGrupos = 0;
const Octavos = 1;
const Cuartos = 2;
const SemiFinal = 3;
const ResultadoSemiF = 4
const Final = 5;


const LetrerOctavos ="=========== Octavos de final ===============\n";

const LetreroCuartos ="\n=========== Cuartos de final ===============\n";
const LetreroSemiFinal ="\n============== SemiFinales =================\n";
const LetreroTercerCuarto ="\n========= Tercer y Cuarto Puesto ============\n";
const LetreroFinal ="\n================= ¡¡¡Final!!! ====================\n";

let empate = 0;

export default class Eliminatorias extends WorldCup {
    constructor (){
        super ();
        this.golesSeleccion1= 0;
        this.golesseleccion2 = 0;
        this.equiposeleccion1 = "";
        this.equiposeleccion2 = "";

        this.seleccion1 = {};
        this.seleccion2 = {};
        this.ganador = {};

        this.lateral_izq = [];
        this.lateral_derch = [];

        this.lateral_izq_resu_final = [];
        this.lateral_derch_resu_final = [];
        this.lateral_inicio_final = -1;
        this.Final = 1;

        this.resultados();
    }

    contador () {
        for (let a = 0; a <= 5; ++a) {
            const equipoIzq = [];
            const equipoDerch = [];
            for (let b = 0; b < 8; ++b) {
                const seleccionIzq = {}
                const seleccionDrch = {}
                equipoIzq.push(seleccionIzq);
                equipoDerch.push(seleccionDrch);
            }
            this.lateral_izq.push(equipoIzq)
            this.lateral_derch.push(equipoDerch)
        }
    }

    // aqui lo dejo por hoy....
    PrimerSegundodecadaGrupo () {
        const Primer_Clasificado = 0;
        const Segundo_Clasificado = 1;
        const seleccionLateral_izq = [];
        const seleccionLateral_derch = [];


        Ranking.map((grupo, marcador_grupo) => {
            grupo.map((seleccion, marcador) => {
                if ((marcador_grupo+1) %2 !== 0) { //si es impar
                    if(marcador === Primer_Clasificado) {
                        seleccionLateral_izq.push(seleccion);
                    } else if (marcador === Segundo_Clasificado) {
                        seleccionLateral_derch.push(seleccion);
                    }
                } else {
                    if(marcador === Segundo_Clasificado) {
                        seleccionLateral_izq.push(seleccion);
                    } else if (marcador === Primer_Clasificado) {
                        seleccionLateral_derch.push(seleccion);
                    }
                }
            });
        });
        this.lateral_izq[FaseGrupos] = Object.assign({}, seleccionLateral_izq);
        this.lateral_derch[FaseGrupos]  = Object.assign({}, seleccionLateral_derch);
    }

    resultado_igual() {
        this.golesSeleccion1= 0;
        this.golesseleccion2 = 0;
        do {
            this.golesSeleccion1=this.resultado();
            this.golesseleccion2 = this.resultado();
        } while (this.golesSeleccion1=== this.golesseleccion2)
    }

    partidos(ganador, perdedor, empate, resultado) {
        let Empate_resultado = [];
        let Finalista = [];
        switch(empate) {
            case 1:
                Empate_resultado = this.lateral_izq[resultado];
            break;
            case 2:
                Empate_resultado = this.lateral_derch[resultado];
            break;
        };
        Empate_resultado[this.lateral_inicio_final].equipo = ganador.equipo; 

        if (resultado === ResultadoSemiF) {
            if(ganador.equipo !== undefined) {
                Finalista = this.lateral_izq[Final];
                ++this.Final;
                Finalista[this.Final].equipo = ganador.equipo;
                Finalista[this.Final - 2].equipo = perdedor.equipo;
            }
        }
    };

    marcadorpartido(ganador, perdedor, inicio, empate, inicializacion, resultado) {
        let empateresultado = [];
        let inicio1 = -1;
        let inicio2 = -1;
        switch(empate) {
            case 1:
                empateresultado = this.lateral_izq[resultado];

            break;
            case 2:
                empateresultado = this.lateral_derch[resultado];
            break;
        }
        switch(inicializacion) {
            case 1:
                inicio1 = inicio -1;
                inicio2 = inicio;
            break;
            case 2:
                inicio1 = inicio;
                inicio2 = inicio - 1;
            break;
        }

        empateresultado[inicio1] = Object.assign({}, ganador);
        empateresultado[inicio2] = Object.assign({}, perdedor);

        if (resultado !== Final) {
            this.partidos(ganador, perdedor, empate, resultado + 1); 
        }


    }

    Eliminatorias(seleccion,marcador,empate,resultado) {
        if ((marcador+1) %2 !== 0) { 
            this.equiposeleccion1 = seleccion.equipo; 
            ++this.lateral_inicio_final;
        } else {
            this.equiposeleccion2 = seleccion.equipo; 
            this.resultado_igual();
            let ganador = {};
            let perdedor = {};
            let inicializacion = 0;
            if (this.golesSeleccion1> this.golesseleccion2) {
                ganador = { equipo: this.equiposeleccion1, golesAfavor: this.golesSeleccion1};
                perdedor = { equipo: this.equiposeleccion2, golesAfavor: this.golesseleccion2 }
                inicializacion = 1;
            } else {
                ganador = { equipo: this.equiposeleccion2, golesAfavor: this.golesseleccion2 };
                perdedor = { equipo: this.equiposeleccion1, golesAfavor: this.golesSeleccion1}
                inicializacion = 2;
            }
                this.marcadorpartido(ganador, perdedor, marcador, empate, inicializacion, resultado);

                this.equiposeleccion1 = "";
                this.equiposeleccion2 = "";
        }
    }

    resultadoEliminatorias(resultado, pantalla) {
        let resultadoToCheck = resultado;
        if (resultado === Octavos) {resultadoToCheck = resultado - 1}

        this.lateral_izq_resu_final = this.lateral_izq[resultadoToCheck];
        this.lateral_derch_resu_final = this.lateral_derch[resultadoToCheck];

        this.lateral_izq_resu_final = Object.values(this.lateral_izq_resu_final);
        this.lateral_derch_resu_final = Object.values(this.lateral_derch_resu_final);

        this.lateral_inicio_final = -1;
        this.lateral_izq_resu_final.map((seleccion, marcador) => {
            empate = 1;
            this.Eliminatorias(seleccion,marcador,empate,resultado)
        })

        this.lateral_inicio_final = -1;
        this.lateral_derch_resu_final.map((seleccion, marcador) => {
            empate = 2;
            this.Eliminatorias(seleccion,marcador,empate,resultado)
        })

        this.imprimirTodosLados(pantalla, resultado);
    }

    imprimirLados(seleccion, marcador, resultado) {
        if ((marcador+1) %2 !== 0) { 
            this.seleccion1 = seleccion;
        } else {
            this.seleccion2 = seleccion;
            if (this.seleccion1.golesAfavor > this.seleccion2.golesAfavor) {
                this.ganador = this.seleccion1;
            } else {
                this.ganador = this.seleccion2;
            }
            
            if (this.seleccion1.equipo !== undefined) {
                if (resultado === Final && marcador === 1) { console.log(LetreroTercerCuarto); } 
                if (resultado === Final && marcador === 3) { console.log(LetreroFinal); } 

                console.log(`${this.seleccion1.equipo} ${this.seleccion1.golesAfavor} - ${this.seleccion2.golesAfavor} ${this.seleccion2.equipo} => ${this.ganador.equipo}`);
                
                if (resultado === Final && marcador === 3) { 
                    console.log("\n============================================");
                    console.log(`¡${this.seleccion1.equipo} campeón del mundo!`); 
                    console.log("============================================");
                }
            }
        }
    }

    imprimirTodosLados(pantalla, resultado) {
        if (resultado !== Final) { console.log(pantalla); }

        this.lateral_izq_resu_final = this.lateral_izq[resultado];
        this.lateral_derch_resu_final= this.lateral_derch[resultado];

        this.lateral_izq_resu_final.map((seleccion, marcador) => {
            this.imprimirLados(seleccion, marcador, resultado);
        });
        this.lateral_derch_resu_final.map((seleccion, marcador) => {
            this.imprimirLados(seleccion, marcador, resultado);
        });
    }

    resultados() {
        console.log("============================================");
        console.log("=== COMIENZO DE LA FASE DE ELIMINATORIAS ===");
        console.log("============================================\n");
        this.contador();
        this.PrimerSegundodecadaGrupo();
        this.resultadoEliminatorias(Octavos, LetrerOctavos);
        this.resultadoEliminatorias(Cuartos, LetreroCuartos);
        this.resultadoEliminatorias(SemiFinal, LetreroSemiFinal);
        this.resultadoEliminatorias(Final, LetreroFinal);

    }
}