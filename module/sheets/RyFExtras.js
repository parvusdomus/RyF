import {tiradaDano} from "../tiradas/tirada-dano.js";
import {tiradaD6} from "../tiradas/tirada_d6.js";
import {tiradaD10} from "../tiradas/tirada_d10.js";
import {tirada1o3D10} from "../tiradas/tirada_1o3d10.js";

export default class RyFExtras {
  static chatListeners (html) {
    html.on('click', '.danoDesdeChat', this._onDanoDesdeChat.bind(this));
    html.on('click', '.aplicaDanoDesdeChat', this._onaplicaDanoDesdeChat.bind(this));
  }

  static async _onD6Roll() {
    const archivo_template = '/systems/ryf/templates/dialogs/tiradaD6.html';
    const datos_template = {
    };
    const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
    let dialogo = new Dialog({
        title: `Nueva tirada D6`,
        content: contenido_Dialogo,
        buttons: {
            Lanzar: {
                icon: '<i class="fas fa-dice-d6"></i>',
                label: "Lanzar",
                callback: () => {
                    tiradaD6 (document.getElementById("numD6").value, document.getElementById("mod").value, document.getElementById("explota").value);
                }
            }
        },
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
    });
    dialogo.render(true);

}

static async _onD10Roll() {
    const archivo_template = '/systems/ryf/templates/dialogs/tiradaD10.html';
    const datos_template = {
    };
    const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
    let dialogo = new Dialog({
        title: `Nueva tirada D10`,
        content: contenido_Dialogo,
        buttons: {
            Lanzar_d10: {
                icon: '<i class="fas fa-dice-d10"></i>',
                label: "Lanzar D10",
                callback: () => {
                    tiradaD10 (this.actor, document.getElementById("numD10").value, document.getElementById("mod").value, document.getElementById("explota").value);
                }
            },
            Lanzar_1o3d10: {
                icon: '<i class="fas fa-bullseye"></i>',
                label: "Lanzar 1o3D10",
                callback: () => {
                    tirada1o3D10 (this.actor, document.getElementById("mod").value, document.getElementById("forzar").value, document.getElementById("explota").value);
                }
            }

        },
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
    });
    dialogo.render(true);

}

  static leftSideBar(controls){
    if (canvas == null) {
      return;
    }
    controls.push(
      {
          name: "dices",
          title: "Dices",
          icon: "fas fa-dice",
          layer: "dices",
          visible: true,
          button: true,
          tools: [
          {
            name: "D6",
            title: "D6",
            layer: "dices",
            icon: "fas fa-dice-d6",
            onClick: () => {
              this._onD6Roll();
            },
        },
        {
          name: "D10",
          title: "D10",
          icon: "fas fa-dice-d10",
          layer: "dices",
          onClick: () => {
            this._onD10Roll();
          },
      }
          ],
          activeTool: "dices",
      }
    );
  }

  static _onDanoDesdeChat (event){
    
     const element = event.currentTarget;
     const dataset = element.dataset;
     let objetivo=dataset.objetivo;;
     let numeroDados = Number(dataset.danonumerodados);
     let bonificador = dataset.danobonificador;
     let absorcion=0;
     let nombreArma = dataset.arma;
     if(dataset.efecto && dataset.efecto > 0){
      numeroDados += Number(dataset.efecto);
     }
     if (dataset.absorcion_armadura){absorcion=dataset.absorcion_armadura}
     tiradaDano(nombreArma, objetivo, absorcion, bonificador, numeroDados);
  }


  static _onaplicaDanoDesdeChat (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const objetivoLinkeadoActor = game.user.targets.first().document.actorLink;
    let objetivo;
    if(!objetivoLinkeadoActor){
      let actorDelta = game.user.targets.first().document.delta;
      if(actorDelta.name === null){
        game.user.targets.first().document.delta.apply();
      }
      objetivo=game.user.targets.first().document.actor;
    } else {
      objetivo=Actor.get(dataset.objetivo)
    }
    let VidaActual=0;
    let Mensaje=""
    if (objetivo){
      VidaActual=Number(objetivo.system.derivadas.puntosVida.value)-Number(dataset.dano)
      if (VidaActual < 0){VidaActual=0}
      objetivo.update ({ 'system.derivadas.puntosVida.value': VidaActual });
      Mensaje = dataset.dano + " puntos de dano aplicado/s a "+objetivo.name;
      ui.notifications.notify(Mensaje);
    }
    else {
      return 1;
    }

  }
}
