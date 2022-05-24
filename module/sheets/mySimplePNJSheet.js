import {tiradaAtaque} from "../tiradas/tirada-ataque.js";
import {tiradaDano} from "../tiradas/tirada-dano.js";
export default class RyFSimpleNPJSheet extends ActorSheet{

  static get defaultOptions() {
    if (game.settings.get ("RyF", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["RyF", "sheet", "actor", "SimplePNJ"],
      template: "systems/RyF/templates/actors/SimplePNJ.html",
      width: 490,
      height: 320,
      resizable: false
    });
  }

  getData() {
        const data = super.getData().data;
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.data.type == 'Monstruo' ) {

        }
        return data;
      }

      activateListeners(html) {
              super.activateListeners(html);

              // Si la hoja no es editable me salgo
              if (!this.options.editable) return;

              //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS
            //  html.find('.tiradaAtributo').click(this._onTiradaAtributo.bind(this));
            html.find('.tiradaAtaquePNJ').click(this._onTiradaAtaquePNJ.bind(this));
            //html.find('.tiradaDañoPNJ').click(this._onTiradaDañoPNJ.bind(this));
            html.find('.restauraVidaPNJ').click(this._onRestauraVidaPNJ.bind(this));
      }

      async _onTiradaAtaquePNJ(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log ("ENTRO EN TIRADA ATAQUE PNJ")
        console.log ("DATASET")
        console.log (dataset)
        var tipo_dado = "objetivo";
        var val_atributo = 0;
        var nom_atributo="";
        var val_habilidad=0;
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
        val_habilidad=dataset.habilidad;
        archivo_template = '/systems/RyF/templates/dialogs/tirada_arma_PNJ.html';
        const datos_template = {
                                nom_arma: dataset.arma,
                                val_atributo: val_atributo,
                                nom_habilidad: "Ataque",
                                val_habilidad: val_habilidad,
                                alcance_corto: 0,
                                alcance_medio: 0,
                                alcance_largo: 0,
                                daño_corto: dataset.daño,
                                daño_medio: dataset.daño,
                                daño_largo: dataset.daño,
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
               tiradaAtaque (this.actor, dataset, val_atributo, val_habilidad, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, dataset.alcance_corto, dataset.alcance_medio, dataset.alcance_largo, dataset.daño, dataset.daño, dataset.daño, absorcion_armadura, document.getElementById("bonos_daño").value, document.getElementById("daño_arma").value);
             }
           },
           Daño: {
             icon: '<i class="fas fa-skull-crossbones"></i>',
             label: "Daño",
             callback: () => {
                tiradaDano (this.actor, dataset, val_atributo, val_habilidad, document.getElementById("bonos").value, document.getElementById("dificultad").value, tipo_dado, document.getElementById("forzar").value, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, dataset.alcance_corto, dataset.alcance_medio, dataset.alcance_largo, dataset.daño, dataset.daño, dataset.daño, absorcion_armadura, document.getElementById("bonos_daño").value, document.getElementById("daño_arma").value);
             }
           }
         },
         render: html => console.log("Register interactivity in the rendered dialog"),
         close: html => console.log("This always is logged no matter which option is chosen")
       });
       dialogo.render(true);

      }

    //  async _onTiradaDañoPNJ(event) {
    //    const element = event.currentTarget;
    //    const dataset = element.dataset;
    //    console.log ("ENTRO EN TIRADA DAÑO PNJ")

    //  }

      async _onRestauraVidaPNJ(event) {
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log ("ENTRO EN RESTAURA VIDA PNJ")
        this.actor.update ({ 'data.Puntos_de_Vida.value': this.actor.data.data.Puntos_de_Vida.max });
      }

}
