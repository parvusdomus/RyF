import {tiradaAtaque} from "../tiradas/tirada-ataque.js";
import {tiradaDano} from "../tiradas/tirada-dano.js";
export default class RyFSimpleNPJSheet extends ActorSheet{

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryf", "sheet", "actor", "SimplePNJ"],
      template: "systems/ryf/templates/actors/SimplePNJ.html",
      width: 800,
      height: 700,
      resizable: false
    });
  }

  getData() {
    const superData = super.getData();
        const data = superData.data;
        data.system.Descripcion = TextEditor.enrichHTML(data.system.Descripcion, {async: false});
        data.dtypes = ["String", "Number", "Boolean"];
        return data;
      }

      activateListeners(html) {
              super.activateListeners(html);

              // Si la hoja no es editable me salgo
              if (!this.options.editable) return;

              //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS
            //  html.find('.tiradaAtributo').click(this._onTiradaAtributo.bind(this));
            html.find('.tiradaAtaquePNJ').click(this._onTiradaAtaquePNJ.bind(this));
            //html.find('.tiradaDanoPNJ').click(this._onTiradaDanoPNJ.bind(this));
            html.find('.restauraVidaPNJ').click(this._onRestauraVidaPNJ.bind(this));
      }

      async _onTiradaAtaquePNJ(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        var tipo_dado = "objetivo";
        var val_habilidad=0;
        var archivo_template="";
        let objetivo = game.user.targets.first()
        let absorcion_armadura=0;
        let defensa_CaC = 0;
        let defensa_CaC_escudo =0;
        let defensa_Dist_escudo=0;
        let objetivo_id;
        if (objetivo){
          let objetivoSystem = Actor.get(objetivo.document.actorId).system;
          defensa_CaC=objetivoSystem.derivadas.defensa.base;
          if (objetivoSystem.derivadas.defensa.escudoCac){
            defensa_CaC_escudo=objetivoSystem.derivadas.defensa.escudoCac;
          }
          if (objetivoSystem.derivadas.defensa.escudoDist){
            defensa_Dist_escudo=objetivoSystem.derivadas.defensa.escudoDist;
          }
          if(objetivoSystem.derivadas.absorcion){
            absorcion_armadura=objetivoSystem.derivadas.absorcion;
          }
          objetivo_id=game.user.targets.first().document.actorId;
        }
        val_habilidad=dataset.habilidad;
        archivo_template = '/systems/ryf/templates/dialogs/tirada_arma_PNJ.html';
        const datos_template = {
                                nom_arma: dataset.arma,
                                nom_habilidad: "Ataque",
                                val_habilidad: val_habilidad,
                                danoDados: dataset.danodados,
                                danoBonificador: dataset.danobonificador,
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
               tiradaAtaque (document.getElementById("forzar").value, 0, val_habilidad, document.getElementById("bonos").value, document.getElementById("dificultad").value, dataset.arma, objetivo_id, absorcion_armadura, dataset.danobonificador, dataset.danodados);
             }
           },
           Dano: {
             icon: '<i class="fas fa-skull-crossbones"></i>',
             label: "Dano",
             callback: () => {
                tiradaDano (dataset.arma, objetivo_id, absorcion_armadura, dataset.danobonificador, dataset.danodados);
             }
           }
         },
         render: html => console.log("Register interactivity in the rendered dialog"),
         close: html => console.log("This always is logged no matter which option is chosen")
       });
       dialogo.render(true);
      }

      async _onRestauraVidaPNJ(event) {
        this.actor.update ({ "system.derivadas.puntosVida.value": this.actor.system.derivadas.puntosVida.max });
      }

}
