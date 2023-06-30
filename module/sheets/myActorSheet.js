import {tiradaAtributo} from "../tiradas/tirada-atributo.js";
import {tiradaHabilidad} from "../tiradas/tirada-habilidad.js";
import {tiradaHechizo} from "../tiradas/tirada-hechizo.js";
import {tiradaAtaque} from "../tiradas/tirada-ataque.js";
import {tiradaDano} from "../tiradas/tirada-dano.js";
export default class RyFActorSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["ryf", "sheet", "actor"],
            template: "systems/ryf/templates/actors/jugador.html",
            width: 800,
            height: 700,
            resizable: false,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
        });
    }

    getData() {
        const superData = super.getData();
        const data = superData.data;
        const settings = this.loadSettings();
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.type == 'jugador') {
            this._prepareCharacterItems(data);
            this._calculaValores(data);
        }
        data.system.descripcion = TextEditor.enrichHTML(data.system.descripcion, {async: false});
        data.settings = settings;
        return data;
    }
    _prepareCharacterItems(sheetData) {
        const actorData = sheetData;
        // Inicializo arrays para meter los objetos por tipo.
        //"arma", "armadura", "aspecto", "don", "habilidad", "limitacion", "maniobra", "objeto", "talento"
        const armas = [];
        const armaduras = [];
        const escudos = [];
        const habilidades = [];
        const hechizos = [];
        const objetos = [];
        const talentos = [];
        // Ordena los objetos por tipo y los mete en el array correspondiente
        for (let i of sheetData.items) {
            let itemSystem = i.system;
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === 'arma') {
                armas.push(i);
            }
            else if (i.type === 'armadura') {
                armaduras.push(i);
            }
            else if (i.type === "escudo") {
                escudos.push(i);
            }
            else if (i.type === "habilidad") {
                if (itemSystem.atributo=="F"){itemSystem.total=itemSystem.nivel+actorData.system.atributos.fisico}
                if (itemSystem.atributo=="D"){itemSystem.total=itemSystem.nivel+actorData.system.atributos.destreza}
                if (itemSystem.atributo=="I"){itemSystem.total=itemSystem.nivel+actorData.system.atributos.inteligencia}
                if (itemSystem.atributo=="P"){itemSystem.total=itemSystem.nivel+actorData.system.atributos.percepcion}
                if (itemSystem.atributo=="C"){itemSystem.total=itemSystem.nivel+actorData.system.atributos.carisma}
                habilidades.push(i);
            }
            else if (i.type === "hechizo") {
                hechizos.push(i);
            }
            else if (i.type === "objeto") {
                objetos.push(i);
            }
            else if (i.type === "talento") {
                talentos.push(i);
            }
        }
        //Asigno cada array al actordata
        actorData.system.items.armas = armas;
        actorData.system.items.armaduras = armaduras;
        actorData.system.items.escudos = escudos;
        actorData.system.habilidades = habilidades;
        actorData.system.hechizos = hechizos;
        actorData.system.items.objetos = objetos;
        actorData.system.talentos = talentos;
    }
    _calculaValores(actorData) {
        const data = actorData;
        const atributos = data.system.atributos;
        const habilidades = data.system.habilidades;
        const items = data.system.items;
        var puntosVida =0;
        var Iniciativa =0;
        var val_reflejos=0;
        var val_esquivar=0;
        var Defensa_Base=0;
        var Defensa_Escudo_CaC=0;
        var Defensa_Escudo_Dist=0;
        var estorbo=0;
        var puntosMana =0;
        var absorcion =0;
        //CALCULO PUNTOS DE VIDA
        puntosVida=Number(atributos.fisico)*Number(4);
        //CALCULO INICIATIVA
        let reflejos = habilidades.find((k) => k.name === "Reflejos");
        if (reflejos){
            val_reflejos=reflejos.system.nivel;
        }
        Iniciativa=Number(val_reflejos)+Number(atributos.percepcion);
        //CALCULO Defensa_Base
        let esquivar = habilidades.find((k) => k.name === "Esquivar");
        if (esquivar){
            val_esquivar=esquivar.system.nivel;
        }
        Defensa_Base= Number(atributos.destreza)+Number(val_esquivar)+Number(5);
        //CALCULO DEFENSA ESCUDO CaC y Dist
        let escudo = items.escudos.find((k) => k.type === "escudo" && k.system.equipado);
        if (escudo){
            Defensa_Escudo_CaC=escudo.system.defensa.cc;
            Defensa_Escudo_Dist=escudo.system.defensa.distancia;
            estorbo+=escudo.system.estorbo;
        }
        //CALCULO absorcion_armadura
        let armadura = items.armaduras.find((k) => k.type === "armadura" && k.system.equipado);
        if (armadura){
            absorcion=armadura.system.absorcion;
            estorbo+=armadura.system.estorbo;
        }
        //CALCULO MANA
        puntosMana=Number(atributos.inteligencia)*Number(3);
        //ACTUALIZO TODOS LOS VALORES
        this.actor.update ({ 'data.derivadas.puntosVida.max': puntosVida });
        this.actor.update ({ 'data.derivadas.iniciativa': Iniciativa });
        this.actor.update ({ 'data.derivadas.defensa.base': Defensa_Base });
        this.actor.update ({ 'data.derivadas.defensa.escudoCac': Defensa_Escudo_CaC });
        this.actor.update ({ 'data.derivadas.defensa.escudoDist': Defensa_Escudo_Dist });
        this.actor.update ({ 'data.derivadas.estorbo': estorbo });
        this.actor.update ({ 'data.derivadas.puntosMana.max': puntosMana });
        this.actor.update ({ 'data.derivadas.absorcion': absorcion });
    }
    activateListeners(html) {
        super.activateListeners(html);
        // Si la hoja no es editable me salgo
        if (!this.options.editable) return;
        // Anadir Objeto
        html.find('.item-create').click(this._onItemCreate.bind(this));
        // Editar objetos
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });
        // Borrar objetos
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const objeto_a_borrar = this.actor.items.get(li.data("itemId"));
            objeto_a_borrar.delete();
            this.render(false);
            li.slideUp(200, () => this.render(false));
        });
        //Equipar objeto, solo armadura y escudo
        html.find('.item-equip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const objeto_a_equipar = this.actor.items.get(li.data("itemId"));
            if (!objeto_a_equipar.system.equipado){
                objeto_a_equipar.update ({ 'system.equipado': true });
            } else {
                objeto_a_equipar.update ({ 'system.equipado': false });
            }
            this.render(false);
        });

        //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS
        html.find('.tiradaAtributo').click(this._onTiradaAtributo.bind(this));
        html.find('.tiradaHabilidad').click(this._onTiradaHabilidad.bind(this));
        html.find('.tiradaHechizo').click(this._onTiradaHechizo.bind(this));
        html.find('.tiradaArma').click(this._onTiradaArma.bind(this));
        html.find('.restauraVida').click(this._onRestauraVida.bind(this));
        html.find('.restauraMana').click(this._onRestauraMana.bind(this));
    }

    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            system: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.system["type"];
        // Finally, create the item!
        //     return this.actor.createOwnedItem(itemData);
        return Item.create(itemData, {parent: this.actor});
    }

    async _onTiradaAtributo(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log(dataset)
        var tipo_dado = "objetivo";
        if (Number(dataset.vida) <= Number(dataset.fisico)){
            tipo_dado = "menor"
        }
        const archivo_template = '/systems/ryf/templates/dialogs/tiradaAtributo.html';
        const datos_template = { nom_atributo: dataset.atributo,
            val_atributo: dataset.valor,
            tipo_dado: tipo_dado
        };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
        let dialogo = new Dialog({
            title: `Nueva tirada de ${dataset.atributo}`,
            content: contenido_Dialogo,
            buttons: {
                Lanzar: {
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Lanzar",
                    callback: () => {
                        tiradaAtributo (this.actor, dataset, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value);
                    }
                }
            },
            render: html => console.log("Register interactivity in the rendered dialog"),
            close: html => console.log("This always is logged no matter which option is chosen")
        });
        dialogo.render(true);
    }

    async _onTiradaHabilidad(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        var tipo_dado = "objetivo";
        if (Number(this.actor.system.derivadas.puntosVida.value) <= Number(this.actor.system.atributos.fisico) || Number(dataset.valor_habilidad)==0){
            tipo_dado = "menor"
        }
        let val_atributo=0;
        if (dataset.atributo==game.i18n.localize("RYF.attributes.strength")){val_atributo=this.actor.system.atributos.fisico};
        if (dataset.atributo==game.i18n.localize("RYF.attributes.dexterity")){val_atributo=this.actor.system.atributos.destreza};
        if (dataset.atributo==game.i18n.localize("RYF.attributes.intelligence")){val_atributo=this.actor.system.atributos.inteligencia};
        if (dataset.atributo==game.i18n.localize("RYF.attributes.perception")){val_atributo=this.actor.system.atributos.percepcion};
        if (dataset.atributo==game.i18n.localize("RYF.attributes.charisma")){val_atributo=this.actor.system.atributos.carisma};
        const archivo_template = '/systems/ryf/templates/dialogs/tiradaHabilidad.html';
        const datos_template = { nom_atributo: dataset.atributo,
            val_atributo: val_atributo,
            nom_habilidad: dataset.habilidad,
            val_habilidad: dataset.valor_habilidad,
            tipo_dado: tipo_dado
        };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
        let dialogo = new Dialog({
            title: `Nueva tirada de ${dataset.habilidad}`,
            content: contenido_Dialogo,
            buttons: {
                Lanzar: {
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Lanzar",
                    callback: () => {
                        tiradaHabilidad (this.actor, dataset, val_atributo, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value);
                    }
                }
            },
            render: html => console.log("Register interactivity in the rendered dialog"),
            close: html => console.log("This always is logged no matter which option is chosen")
        });
        dialogo.render(true);
    }

    async _onTiradaHechizo(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        var tipo_dado = "objetivo";
        if (Number(this.actor.system.derivadas.puntosVida.value) <= Number(this.actor.system.atributos.fisico) || Number(dataset.nivel)==0){
            tipo_dado = "menor"
        }
        let val_atributo=this.actor.system.atributos.inteligencia;
        const archivo_template = '/systems/ryf/templates/dialogs/tiradaHechizo.html';
        const datos_template = {
            val_atributo: val_atributo,
            val_alcance: dataset.alcance,
            nom_hechizo: dataset.hechizo,
            nivel_hechizo: dataset.nivel,
            val_dificultad: dataset.dificultad,
            val_mana: dataset.mana,
            tipo_dado: tipo_dado
        };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
        let dialogo = new Dialog({
            title: `Nueva tirada de ${dataset.hechizo}`,
            content: contenido_Dialogo,
            buttons: {
                Lanzar: {
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Lanzar",
                    callback: () => {
                        tiradaHechizo (this.actor, dataset, val_atributo, document.getElementById("bonos").value, dataset.dificultad, tipo_dado, document.getElementById("tipo_dado").value, dataset.mana);
                    }
                }
            },
            render: html => console.log("Register interactivity in the rendered dialog"),
            close: html => console.log("This always is logged no matter which option is chosen")
        });
        dialogo.render(true);
    }

    async _onTiradaArma(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        
        let tipoDado = "objetivo";
        let valAtributo = 0;
        let nomAtributo="";
        let valHabilidad=0;
        let HabilidadArma;
        let bonoAtaque = 0;
        let archivo_template="";
        let objetivo = game.user.targets.first();
        let absorcionArmadura=0;
        let defensaBase = 0;
        let defensaCacEscudo =0;
        let defensaDistanciaEscudo=0;
        let objetivo_id;
        
        if (objetivo){
            objetivo_id=objetivo.document.actorId;
            let objetivoActor = Actor.get(objetivo_id);
            defensaBase=objetivoActor.system.derivadas.defensa.base;
            if (objetivoActor.system.derivadas.defensa.escudoCac){
                defensaCacEscudo=objetivoActor.system.derivadas.defensa.escudoCac;
            }
            if (objetivoActor.system.derivadas.defensa.escudoDist){
                defensaDistanciaEscudo=objetivoActor.system.derivadas.defensa.escudoDist;
            }
            if(objetivoActor.system.derivadas.absorcion){
                absorcionArmadura=objetivoActor.system.derivadas.absorcion;
            }
        }

        if (dataset.habilidad=="Cuerpo a cuerpo"){
            valAtributo=this.actor.system.atributos.fisico;
            nomAtributo="Físico";
            archivo_template = '/systems/ryf/templates/dialogs/tiradaArma.html';
            HabilidadArma = this.actor.items.find((k) => k.type === "habilidad" && k.name === "Armas Cuerpo a Cuerpo");
            if (HabilidadArma){
                valHabilidad=HabilidadArma.system.nivel;
            }

        }
        if (dataset.habilidad=="Distancia"){
            valAtributo=this.actor.system.atributos.destreza;
            nomAtributo="Destreza";
            archivo_template = '/systems/ryf/templates/dialogs/tiradaArma.html';
            HabilidadArma = this.actor.items.find((k) => k.type === "habilidad" && k.name === "Armas a Distancia");
            if (HabilidadArma){
                valHabilidad=HabilidadArma.system.nivel;
            }
        }
        if (Number(this.actor.system.derivadas.puntosVida.value) <= Number(this.actor.system.atributos.fisico) || Number(valHabilidad)==0){
            tipoDado = "menor"
        }

        const datos_template = {
            nom_arma: dataset.arma,
            nom_atributo: nomAtributo,
            val_atributo: valAtributo,
            nom_habilidad: dataset.habilidad,
            val_habilidad: valHabilidad,
            bonificadorAtaque: 0,
            danoDados: dataset.danonumerodados,
            danoBonificador: dataset.danobonificador,
            tipo_dado: tipoDado,
            defensa_CaC: defensaBase,
            defensa_total_CaC: defensaBase+defensaCacEscudo,
            defensa_CaC_escudo: defensaCacEscudo,
            defensa_Dist_escudo: defensaDistanciaEscudo,
            absorcion_armadura: absorcionArmadura
        };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);

        let dialogo = new Dialog({
            title: `Tirada de ${dataset.arma}`,
            content: contenido_Dialogo,
            buttons: {
                Ataque: {
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Ataque",
                    callback: () => {
                        let dificultad = document.getElementById("dificultad").value;
                        bonoAtaque = document.getElementById("bonificadorAtaque").value;
                        tipoDado = document.getElementById("tipo_dado").value;
                        tiradaAtaque (tipoDado, valAtributo, valHabilidad, bonoAtaque, dificultad, dataset.arma, objetivo_id, absorcionArmadura, dataset.danobonificador, dataset.danonumerodados);
                    }
                },
                Dano: {
                    icon: '<i class="fas fa-skull-crossbones"></i>',
                    label: "Daño",
                    callback: () => {
                        tiradaDano (dataset.arma, objetivo_id, absorcionArmadura, dataset.danobonificador, dataset.danonumerodados);
                    }
                }
            },
            render: html => console.log("Register interactivity in the rendered dialog"),
            close: html => console.log("This always is logged no matter which option is chosen")
        });
        dialogo.render(true);
    }

    async _onRestauraVida(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        this.actor.update ({ 'data.derivadas.puntosVida.value': this.actor.system.derivadas.puntosVida.max });
    }

    async _onRestauraMana(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        this.actor.update ({ 'data.derivadas.puntosMana.value': this.actor.system.derivadas.puntosMana.max });
    }

    //Load settings that are used in the actor sheet
    loadSettings(){
        let settings = {};
        settings.magicEnabled = game.settings.get("ryf","advanced.magicEnabled");
        settings.charismaEnabled = game.settings.get("ryf","charismaEnabled");

        return settings;
    }



}
