import {tiradaDano} from "../tiradas/tirada-dano.js";

export default class RyFExtras {
  static chatListeners (html) {
    html.on('click', '.danoDesdeChat', this._onDanoDesdeChat.bind(this));
    html.on('click', '.aplicaDanoDesdeChat', this._onaplicaDanoDesdeChat.bind(this));
  }

  static leftSideBar(controls){
    if (canvas == null) {
      return;
    }
    controls.push(
      {
          name: "dices",
          title: "Dices",
          icon: "fas fa-dice-d10",
          layer: "dices",
          visible: true,
          button: true,
          onClick: () => {
            console.log("Enhorabuena xD")
          },
          tools: [
              {
                  name: "Dados",
                  title: "Ventana para tirar dados",
                  icon: "fas fa-dice",
                  layer: "dices",
                  onClick: () => {
                      console.log("TODO xD")
                  }
              }
          ],
          activeTool: "dices",
      }
    );
  }

  static _onDanoDesdeChat (event){
     const element = event.currentTarget;
     const dataset = element.dataset;
     let objetivo;
     let numeroDados = Number(dataset.danonumerodados);
     let bonificador = dataset.danobonificador;
     let absorcion=0;
     let nombreArma = dataset.arma;
     console.log(dataset)
     if(dataset.efecto && dataset.efecto > 0){
      numeroDados += Number(dataset.efecto);
     }
     
     if (dataset.absorcion_armadura){absorcion=dataset.absorcion_armadura}
     if (dataset.objetivo){
       objetivo=canvas.tokens.get(dataset.objetivo);
     }
     tiradaDano(nombreArma, objetivo, absorcion, bonificador, numeroDados);
  }


  static _onaplicaDanoDesdeChat (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const objetivo=canvas.tokens.get(dataset.objetivo);
    let VidaActual=0;
    let Mensaje=""
    if (objetivo){
      VidaActual=Number(objetivo.document._actor.system.derivadas.puntosVida.value)-Number(dataset.dano)
      if (VidaActual < 0){VidaActual=0}
      objetivo.document._actor.update ({ 'data.derivadas.puntosVida.value': VidaActual });
      Mensaje = dataset.dano + " puntos de dano aplicado/s a "+objetivo.document._actor.data.name;
      ui.notifications.notify(Mensaje);
    }
    else {
      return 1;
    }

  }
}
