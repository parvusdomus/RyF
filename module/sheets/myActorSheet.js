import {tiradaAtributo} from "../tiradas/tirada-atributo.js";
import {tiradaHabilidad} from "../tiradas/tirada-habilidad.js";
import {tiradaHechizo} from "../tiradas/tirada-hechizo.js";
import {tiradaAtaque} from "../tiradas/tirada-ataque.js";
import {tiradaDano} from "../tiradas/tirada-dano.js";
import {tiradaD6} from "../tiradas/tirada_d6.js";
import {tiradaD10} from "../tiradas/tirada_d10.js";
import {tirada1o3D10} from "../tiradas/tirada_1o3d10.js";
export default class RyFActorSheet extends ActorSheet{

  static get defaultOptions() {
    if (game.settings.get ("ryf", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["ryf", "sheet", "actor"],
      template: "systems/ryf/templates/actors/Jugador.html",
      width: 800,
      height: 700,
      resizable: false,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
    });
  }

  getData() {
        const data = super.getData().data;
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.data.type == 'Jugador') {
          this._prepareCharacterItems(data);
          this._calculaValores(data);
        }
        return data;
      }


      _prepareCharacterItems(sheetData) {
      const actorData = sheetData;

      // Inicializo arrays para meter los objetos por tipo.
      //"arma", "armadura", "aspecto", "don", "habilidad", "limitacion", "maniobra", "objeto", "talento"
       const Armas = [];
       const Armaduras = [];
       const Escudos = [];
       const Habilidades = [];
       const Hechizos = [];
       const Objetos = [];
       const Talentos = [];
       // Ordena los objetos por tipo y los mete en el array correspondiente
      for (let i of sheetData.items) {
        let item = i.data;
        i.img = i.img || DEFAULT_TOKEN;
        if (i.type === 'Arma') {
          Armas.push(i);
        }
        else if (i.type === 'Armadura') {
          Armaduras.push(i);
        }
         else if (i.type === "Escudo") {
           Escudos.push(i);
         }
         else if (i.type === "Habilidad") {
           Habilidades.push(i);
           if (i.data.Atributo=="Físico"){i.data.Total=i.data.Nivel+actorData.data.Físico}
           if (i.data.Atributo=="Destreza"){i.data.Total=i.data.Nivel+actorData.data.Destreza}
           if (i.data.Atributo=="Inteligencia"){i.data.Total=i.data.Nivel+actorData.data.Inteligencia}
           if (i.data.Atributo=="Percepción"){i.data.Total=i.data.Nivel+actorData.data.Percepción}
         }
         else if (i.type === "Hechizo") {
           Hechizos.push(i);
         }
         else if (i.type === "Objeto") {
           Objetos.push(i);
         }
         else if (i.type === "Talento") {
           Talentos.push(i);
         }
      }
      //Asigno cada array al actordata
  actorData.Armas = Armas;
  actorData.Armaduras = Armaduras;
  actorData.Escudos = Escudos;
  actorData.Habilidades = Habilidades;
  actorData.Hechizos = Hechizos;
  actorData.Objetos = Objetos;
  actorData.Talentos = Talentos;
}

_calculaValores(actorData) {
const data = actorData;
var Puntos_de_Vida =0;
var Iniciativa =0;
var val_reflejos=0;
var val_esquivar=0;
var Defensa_Base=0;
var Defensa_Escudo_CaC=0;
var Defensa_Escudo_Dist=0;
var Estorbo_Total=0;
var Puntos_de_Mana =0;
var Absorción_Total =0;

//CALCULO PUNTOS DE VIDA
Puntos_de_Vida=Number(data.data.Físico)*Number(4);
//CALCULO INICIATIVA
let Reflejos = data.Habilidades.find((k) => k.name === "Reflejos");
if (Reflejos){
  val_reflejos=Reflejos.data.Nivel;
}
Iniciativa=Number(val_reflejos)+Number(data.data.Percepción);
//CALCULO Defensa_Base
let Esquivar = data.Habilidades.find((k) => k.name === "Esquivar");
if (Esquivar){

  val_esquivar=Esquivar.data.Nivel;
}
Defensa_Base= Number(data.data.Destreza)+Number(val_esquivar)+Number(5);
//CALCULO DEFENSA ESCUDO CaC y Dist
let Escudo = data.Escudos.find((k) => k.type === "Escudo" && k.data.Equipado=="true");
if (Escudo){
  Defensa_Escudo_CaC=Escudo.data.Defensa.CC;
  Defensa_Escudo_Dist=Escudo.data.Defensa.Distancia;
  Estorbo_Total+=Escudo.data.Estorbo;
}
//CALCULO absorcion_armadura
let Armadura = data.Armaduras.find((k) => k.type === "Armadura" && k.data.Equipado=="true");
if (Armadura){
  Absorción_Total=Armadura.data.Absorción;
  Estorbo_Total+=Armadura.data.Estorbo;
}
//CALCULO MANA
Puntos_de_Mana=Number(data.data.Inteligencia)*Number(3);
//ACTUALIZO TODOS LOS VALORES
this.actor.update ({ 'data.Puntos_de_Vida.max': Puntos_de_Vida });
this.actor.update ({ 'data.Iniciativa': Iniciativa });
this.actor.update ({ 'data.Defensa.Base': Defensa_Base });
this.actor.update ({ 'data.Defensa.Escudo_CAC': Defensa_Escudo_CaC });
this.actor.update ({ 'data.Defensa.Escudo_Dist': Defensa_Escudo_Dist });
this.actor.update ({ 'data.Estorbo_Total': Estorbo_Total });
this.actor.update ({ 'data.Puntos_de_Mana.max': Puntos_de_Mana });
this.actor.update ({ 'data.Absorción_Total': Absorción_Total });
}

activateListeners(html) {
        super.activateListeners(html);

        // Si la hoja no es editable me salgo
        if (!this.options.editable) return;

        // Añadir Objeto
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
          if (objeto_a_equipar.data.data.Equipado =="false"){
            objeto_a_equipar.update ({ 'data.Equipado': "true" });
          } else {
            objeto_a_equipar.update ({ 'data.Equipado': "false" });
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
        html.find('.D10Roll').click(this._onD10Roll.bind(this));
        html.find('.D6Roll').click(this._onD6Roll.bind(this));

}

      //Funcion de añadir objetos
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
          data: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data["type"];

        // Finally, create the item!
        //     return this.actor.createOwnedItem(itemData);
        return Item.create(itemData, {parent: this.actor});
      }

      async _onTiradaAtributo(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        var tipo_dado = "objetivo";
        if (Number(dataset.vida) <= Number(dataset.fisico)){
          tipo_dado = "menor"
        }
        const archivo_template = '/systems/ryf/templates/dialogs/tirada_atributo.html';
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
        if (Number(this.actor.data.data.Puntos_de_Vida.value) <= Number(this.actor.data.data.Físico) || Number(dataset.valor_habilidad)==0){
          tipo_dado = "menor"
        }
        let val_atributo=0;
        if (dataset.atributo=="Físico"){val_atributo=this.actor.data.data.Físico};
        if (dataset.atributo=="Destreza"){val_atributo=this.actor.data.data.Destreza};
        if (dataset.atributo=="Inteligencia"){val_atributo=this.actor.data.data.Inteligencia};
        if (dataset.atributo=="Percepción"){val_atributo=this.actor.data.data.Percepción};
        const archivo_template = '/systems/ryf/templates/dialogs/tirada_habilidad.html';
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
        if (Number(this.actor.data.data.Puntos_de_Vida.value) <= Number(this.actor.data.data.Físico) || Number(dataset.nivel)==0){
          tipo_dado = "menor"
        }
        let val_atributo=this.actor.data.data.Inteligencia;
        const archivo_template = '/systems/ryf/templates/dialogs/tirada_hechizo.html';
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
               tiradaHechizo (this.actor, dataset, val_atributo, document.getElementById("bonos").value, dataset.dificultad, tipo_dado, document.getElementById("forzar").value, dataset.mana);
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
        var tipo_dado = "objetivo";
        var val_atributo = 0;
        var nom_atributo="";
        var val_habilidad=0;
        var HabilidadArma;
        var archivo_template="";
        let listaObjetivos = game.user.targets;
        let objetivo = Array.from(listaObjetivos)[0];
        let absorcion_armadura=0;
        let defensa_CaC = 0;
        let defensa_CaC_escudo =0;
        let defensa_Dist_escudo=0;
        let objetivo_id;

        if (objetivo){
          defensa_CaC=objetivo.document._actor.data.data.Defensa.Base;
          if (objetivo.document._actor.data.data.Defensa.Escudo_CAC){
            defensa_CaC_escudo=objetivo.document._actor.data.data.Defensa.Escudo_CAC;
          }
          if (objetivo.document._actor.data.data.Defensa.Escudo_Dist){
            defensa_Dist_escudo=objetivo.document._actor.data.data.Defensa.Escudo_Dist;
          }
          absorcion_armadura=objetivo.document._actor.data.data.Absorción_Total;
          objetivo_id=objetivo.data._id;
        }

        if (dataset.habilidad=="CaC"){
          val_atributo=this.actor.data.data.Físico;
          nom_atributo="Físico";
          archivo_template = '/systems/ryf/templates/dialogs/tirada_arma_cac.html';
          HabilidadArma = this.actor.data.items.find((k) => k.data.type === "Habilidad" && k.data.name === "Armas Cuerpo a Cuerpo");
          if (HabilidadArma){
            val_habilidad=HabilidadArma.data.data.Nivel;
          }

        }
        if (dataset.habilidad=="Distancia"){
          val_atributo=this.actor.data.data.Destreza;
          nom_atributo="Destreza";
          archivo_template = '/systems/ryf/templates/dialogs/tirada_arma_distancia.html';
          HabilidadArma = this.actor.data.items.find((k) => k.data.type === "Habilidad" && k.data.name === "Armas a Distancia");
          if (HabilidadArma){
            val_habilidad=HabilidadArma.data.data.Nivel;
          }
        }
        if (Number(this.actor.data.data.Puntos_de_Vida.value) <= Number(this.actor.data.data.Físico) || Number(val_habilidad)==0){
          tipo_dado = "menor"
        }

        const datos_template = {
                                nom_arma: dataset.arma,
                                nom_atributo: nom_atributo,
                                val_atributo: val_atributo,
                                nom_habilidad: dataset.habilidad,
                                val_habilidad: val_habilidad,
                                alcance_corto: dataset.alcance_corto,
                                alcance_medio: dataset.alcance_medio,
                                alcance_largo: dataset.alcance_largo,
                                daño_corto: dataset.daño_corto,
                                daño_medio: dataset.daño_medio,
                                daño_largo: dataset.daño_largo,
                                tipo_dado: tipo_dado,
                                defensa_CaC: defensa_CaC,
                                defensa_total_CaC: defensa_CaC+defensa_CaC_escudo,
                                defensa_CaC_escudo: defensa_CaC_escudo,
                                defensa_Dist_escudo: defensa_Dist_escudo,
                                absorcion_armadura: absorcion_armadura
                              };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
        let dialogo = new Dialog({
          title: `Nueva tirada de ${dataset.arma}`,
          content: contenido_Dialogo,
          buttons: {
           Ataque: {
            icon: '<i class="fas fa-dice"></i>',
            label: "Ataque",
            callback: () => {
               tiradaAtaque (this.actor, dataset, val_atributo, val_habilidad, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, dataset.alcance_corto, dataset.alcance_medio, dataset.alcance_largo, dataset.daño_corto, dataset.daño_medio, dataset.daño_largo, absorcion_armadura, document.getElementById("bonos_daño").value, document.getElementById("daño_arma").value);
            }
  		    },
          Daño: {
           icon: '<i class="fas fa-skull-crossbones"></i>',
           label: "Daño",
           callback: () => {
              tiradaDano (this.actor, dataset, val_atributo, val_habilidad, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, dataset.alcance_corto, dataset.alcance_medio, dataset.alcance_largo, dataset.daño_corto, dataset.daño_medio, dataset.daño_largo, absorcion_armadura, document.getElementById("bonos_daño").value, document.getElementById("daño_arma").value);
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
        this.actor.update ({ 'data.Puntos_de_Vida.value': this.actor.data.data.Puntos_de_Vida.max });
      }

      async _onRestauraMana(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        this.actor.update ({ 'data.Puntos_de_Mana.value': this.actor.data.data.Puntos_de_Mana.max });
      }

      async _onD6Roll(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log ("D6 Roll")
        const archivo_template = '/systems/ryf/templates/dialogs/tirada_D6.html';
        const datos_template = {
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
               tiradaD6 (this.actor, document.getElementById("numD6").value, document.getElementById("mod").value, document.getElementById("explota").value);
            }
  		    }
         },
         render: html => console.log("Register interactivity in the rendered dialog"),
         close: html => console.log("This always is logged no matter which option is chosen")
       });
       dialogo.render(true);

      }

      async _onD10Roll(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log ("D10 Roll")
        const archivo_template = '/systems/ryf/templates/dialogs/tirada_D10.html';
        const datos_template = {
                              };
        const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
        let dialogo = new Dialog({
          title: `Nueva tirada de ${dataset.atributo}`,
          content: contenido_Dialogo,
          buttons: {
           Lanzar_d10: {
            icon: '<i class="fas fa-dice"></i>',
            label: "Lanzar D10",
            callback: () => {
               tiradaD10 (this.actor, document.getElementById("numD10").value, document.getElementById("mod").value, document.getElementById("explota").value);
            }
  		    },
          Lanzar_1o3d10: {
           icon: '<i class="fas fa-dice"></i>',
           label: "Lanzar 1o3D10",
           callback: () => {
              tirada1o3D10 (this.actor, document.getElementById("mod2").value, document.getElementById("forzar").value);
           }
         }

         },
         render: html => console.log("Register interactivity in the rendered dialog"),
         close: html => console.log("This always is logged no matter which option is chosen")
       });
       dialogo.render(true);

      }



}
