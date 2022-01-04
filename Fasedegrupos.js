import {GRUPOS, LOCAL, VISITANTE, Ranking} from "./clases/WorldCup.js";

const SeleccionInformacion = [];
const partidos_calendarios = [];


import WorldCup from "./clases/WorldCup.js";

export default class FasedeGrupos extends WorldCup{
    constructor(equipos) {
        super(equipos); //esto quiere decir que voy a usar el equipos de la clase padre
        this.ranking = [];
        this.gupos_preparados = [];
        this.SeleccionAleatoria = [];
        this.seleccionAleatoria_asignacion_grupos();
        this.calendario_campeonato();
        this.informacion_inicial_seleccion();
        this.resultado_fase_grupos();
        this.imprimir_ronda_grupo();  /**Esto es obligatorio **/
        
    }


    seleccionAleatoria_asignacion_grupos () {
        this.SeleccionAleatoria = this.equipos.shuffle();
        let incio = 0;
        let Final = 3;
    
        GRUPOS.map(equipo => {
            const selecciones = [];
            for (let a = incio; a <= Final; ++a) {
                selecciones.push(this.SeleccionAleatoria[a]);
            }
            incio += 4;
            Final += 4;
            this.gupos_preparados.push(selecciones);
        });
    }
    
    informacion_inicial_seleccion () {
        let a = 0;
        this.SeleccionAleatoria.map( (equipo, inicio) => {
            const seleccion = {
                grupo: GRUPOS[a],
                equipo: equipo,
                contra: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], //array of objects , who won? drawn, lost, how many goles against and golesfor
                puntos: 0,
                golesAfavor: 0,
                golesEnContra: 0,
                goles_diferencia: 0,
            }
            SeleccionInformacion.push(seleccion);
           
            if ((inicio+1) %4 === 0) { ++a }
        });
    }
 //aqui seguimos.....   
    esquema_partidos_jornadas_grupos () {
        const plantillas = [];
        const seleciones_grupos = 4;
        const numero_partidos = seleciones_grupos - 2;
        const coincidencias = (seleciones_grupos / 2) -1;
        for (let a = 0; a <= numero_partidos; ++a) {
            const partido = [];
            for (let b = 0; b <= coincidencias; ++b) {
                partido.push([LOCAL,VISITANTE]);
            }
            plantillas.push(partido);
        }
        return plantillas;
    }

    jornada_clasificacion(grupo) {
        const plantillas= this.esquema_partidos_jornadas_grupos();
        let recuento = 0;
        let recuento_dos = grupo.length - 2;
        const ultimaseleccion = grupo.length - 1
        const Ultimajornada = grupo.length - 2;
        plantillas.map((ronda, ronda_inicial) => {
            ronda.map((partido,partido_inicial) => {
                if (partido_inicial === 0) {
                    if (ronda_inicial === 0 || ronda_inicial%2 === 0) {
                        partido[LOCAL] = recuento;
                        partido[VISITANTE] = ultimaseleccion;
                    } else {
                        partido[LOCAL] = ultimaseleccion;
                        partido[VISITANTE] = recuento;
                    }
                } else {
                    partido[LOCAL] = recuento;
                    partido[VISITANTE] = recuento_dos;
                    --recuento_dos;
                    if (recuento_dos === -1) { recuento_dos = Ultimajornada; }
                }
                ++recuento;
                if (recuento === ultimaseleccion){ recuento = 0; }
            });
        });
        return plantillas;
    }
    
    calendario_campeonato () {
        this.gupos_preparados.map((grupo) => {
            const canlendario_grupos= this.jornada_clasificacion(grupo);
            partidos_calendarios.push(canlendario_grupos);
        }); 
    }
    
    imprimir_consola_grupos (marcador_grupo) {
        console.log(`\nGrupo ${GRUPOS[marcador_grupo]}`);
        console.log("---------------------------------------");
        const grupo_salida_consola= this.gupos_preparados[marcador_grupo];
        grupo_salida_consola.map(seleccion => {
            console.log(seleccion);
        });
    }    
    
    seleccion_equipos (seleccion_numero, marcador_grupo){
        const grupo = this.gupos_preparados[marcador_grupo];
        return grupo[seleccion_numero];
    }
    
    imprimir_ronda_grupo () {
        console.log("\nGrupos y Selecciones");
        console.log("=======================================");
        partidos_calendarios.map((partido_equipos,partido_inicial) => {
            this.imprimir_consola_grupos(partido_inicial);
            partido_equipos.map((ronda, ronda_inicial) => {
                console.log(`\nJornada ${ronda_inicial+1}:`)
                ronda.map(partido => {
                    console.log(`-${this.seleccion_equipos(partido[LOCAL],partido_inicial)} vs ${this.seleccion_equipos(partido[VISITANTE],partido_inicial)}`)
                })
            });
        });
    }
    

    
    marcadorprincipal (marcador, goles_inicio, golesAfavor) {
        SeleccionInformacion[marcador].contra[goles_inicio] = golesAfavor;
    }
    
    puntosmarcador (marcador, golesAfavor, golesEnContra) {
        if (golesAfavor > golesEnContra) {
            SeleccionInformacion[marcador].puntos = SeleccionInformacion[marcador].puntos + 3;
        } else if (golesAfavor === golesEnContra) {
            SeleccionInformacion[marcador].puntos = SeleccionInformacion[marcador].puntos + 1;
         }
    }
    
    marcadorgoles(marcador, golesAfavor, golesEnContra) {
        SeleccionInformacion[marcador].golesAfavor = SeleccionInformacion[marcador].golesAfavor + golesAfavor;
        SeleccionInformacion[marcador].golesEnContra = SeleccionInformacion[marcador].golesEnContra + golesEnContra;
        SeleccionInformacion[marcador].goles_diferencia = SeleccionInformacion[marcador].golesAfavor - SeleccionInformacion[marcador].golesEnContra;
    }

    marcador_local (marcador_grupo, marcador) {
        return marcador_grupo * 4 + marcador;
    }
    
    marcador_seleccion(marcador_grupo, marcador, golesAfavor, goles_inicio, golesEnContra) {
        const posicion_seleccion = this.marcador_local(marcador_grupo, marcador);
        const contra_seleccion = this.marcador_local(marcador_grupo, goles_inicio);
        this.marcadorprincipal (posicion_seleccion, contra_seleccion, golesAfavor);
        this.puntosmarcador (posicion_seleccion, golesAfavor, golesEnContra);
        this.marcadorgoles (posicion_seleccion, golesAfavor, golesEnContra);
    }
    
    //.....
    vuelta_puntos (informacion_vuelta) {
        informacion_vuelta.sort((seleccionInfo1,seleccionInfo2) => {
            return seleccionInfo2.puntos - seleccionInfo1.puntos;
        });
        return informacion_vuelta;
    }
    
    rankingSeleccion(marcador_grupo){ 
        const incio = marcador_grupo * 4;
        const Final =  marcador_grupo * 4 + 4;
        this.ranking = SeleccionInformacion.slice(incio,Final)
    }
    
    informacion_actual(marcador_grupo) {
        const inicio = marcador_local(marcador_grupo, 0);
        this.SeleccionInformacion.splice(inicio, 4, ranking)
    }
    //sort
    puntuacion_ranking() {
        this.ranking.sort((seleccionB, seleccionA) => {
            return seleccionA.puntos - seleccionB.puntos;
        });
    }
    
    ranking_ordenado() {
        this.ranking.sort((seleccionB, seleccionA) => {
            if (seleccionA.puntos === seleccionB.puntos) {
                const goles_de_a_b = SeleccionInformacion.findIndex( seleccion => {return seleccion.equipo === seleccionB.equipo} );
                const goles_de_b_a = SeleccionInformacion.findIndex( seleccion => {return seleccion.equipo === seleccionA.equipo} );
    
                const goles_a_b = seleccionA.contra[goles_de_a_b];
                const goles_b_a = seleccionB.contra[goles_de_b_a];
    
                const resultado_final = (goles_a_b !== -1 && goles_b_a !== -1) ? true : false;
    
                if (resultado_final) { 
                    if (goles_a_b < goles_b_a) {
                        return -1;
                    }
                    if (goles_b_a > goles_a_b) {
                        return 1;
                    }
                    if (goles_a_b === goles_b_a) {
                        if (seleccionA.equipo > seleccionB.equipo) {
                            
                            return -1
                        }
                        if (seleccionA.equipo < seleccionB.equipo) {
                        
                            return 1
                        }
                    }
                }
            } else {
                return 1;
            }
        });
    }
    
    ranking_de_grupos() {
        Ranking.push(this.ranking);
    }
    
    ranking_partidos(marcador_grupo) {
        this.rankingSeleccion(marcador_grupo);
        this.puntuacion_ranking();
        this.ranking_ordenado();
      console.table(this.ranking, ["equipo","puntos","golesAfavor","golesEnContra","goles_diferencia"]);
    }
    
    resultado_fase_grupos() {
        console.log ("\n===============================================================================");
        console.log ("========================== COMIENZA EL MUNDIAL ================================");
        console.log ("===============================================================================\n");
        partidos_calendarios.map((grupo,marcador_grupo) => {
            grupo.map((ronda, ronda_inicial) => {
                console.log(`Grupo ${GRUPOS[marcador_grupo]} - Jornada ${ronda_inicial+1}:`);
                console.log("----------------------------------------");
                ronda.map(partido => { 
                    const golesAfavorseleccion1 = this.resultado();
                    const golesAfavorseleccion2 = this.resultado();
                    console.log(`-${this.seleccion_equipos(partido[LOCAL], marcador_grupo)} ${golesAfavorseleccion1} - ${golesAfavorseleccion2} ${this.seleccion_equipos(partido[VISITANTE], marcador_grupo)} \n`)
                    this.marcador_seleccion(marcador_grupo, partido[LOCAL], golesAfavorseleccion1, partido[VISITANTE], golesAfavorseleccion2);
                    this.marcador_seleccion(marcador_grupo, partido[VISITANTE], golesAfavorseleccion2, partido[LOCAL], golesAfavorseleccion1);
                })
                this.ranking_partidos(marcador_grupo);
            });
            this.ranking_de_grupos();
        });
    }
}