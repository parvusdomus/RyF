export default class RyFExtras {
  static chatListeners (html) {
    html.on('click', '.danoDesdeChat', this._onDanoDesdeChat.bind(this));
    html.on('click', '.aplicaDanoDesdeChat', this._onaplicaDanoDesdeChat.bind(this));
  }
   static _onDanoDesdeChat (event){
     const element = event.currentTarget;
     const dataset = element.dataset;
     console.log("AAAAA");
     console.log(dataset);
     if (dataset.exito=="true"){
     }else {
       return 1;
     }
     let tirada=dataset.daño +"+"+dataset.bonos;
     if(dataset.efecto && dataset.efecto > 0){
      tirada = tirada + "+" + dataset.efecto+"d6x"
     }
     let objetivo_id=""
     let d6Roll = new Roll(tirada).roll({async: false});
     let total= 0;
     let resultado="";
     let absorcion_armadura=0;
     if (dataset.absorcion_armadura){absorcion_armadura=dataset.absorcion_armadura}
     resultado=eval(d6Roll.result);
     total=Number(resultado)-Number(absorcion_armadura);
     let objetivo;
     if (dataset.objetivo){
       objetivo=canvas.tokens.get(dataset.objetivo);
       objetivo_id=objetivo;
     }
     let causa_daño=total > 0 && objetivo;
     const archivo_template_chat = '/systems/ryf/templates/dialogs/tirada_daño_chat.html';
     const datos_template_chat = {
                             tirada: tirada,
                             nom_habilidad: dataset.arma,
                             armadura: absorcion_armadura,
                             resultado: resultado,
                             total: total,
                             objetivo: objetivo_id,
                             causa_daño: causa_daño
                           };
    var contenido_Dialogo_chat;
    renderTemplate(archivo_template_chat, datos_template_chat).then(
    (contenido_Dialogo_chat)=> {
      const chatData = {
             type: CONST.CHAT_MESSAGE_TYPES.ROLL,
             roll: d6Roll,
             content: contenido_Dialogo_chat,
         };
      ChatMessage.create(chatData);
    } )

  }


  static _onaplicaDanoDesdeChat (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const objetivo=canvas.tokens.get(dataset.objetivo);
    let VidaActual=0;
    let Mensaje=""
    if (objetivo){
      VidaActual=Number(objetivo.document._actor.system.Puntos_de_Vida.value)-Number(dataset.daño)
      if (VidaActual < 0){VidaActual=0}
      objetivo.document._actor.update ({ 'data.Puntos_de_Vida.value': VidaActual });
      Mensaje = dataset.daño + " puntos de daño aplicado/s a "+objetivo.document._actor.data.name;
      ui.notifications.notify(Mensaje);
    }
    else {
      return 1;
    }

  }
}
