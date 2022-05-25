export default class RyFExtras {
  static chatListeners (html) {
    html.on('click', '.dañoDesdeChat', this._onDañoDesdeChat.bind(this));
    html.on('click', '.aplicaDañoDesdeChat', this._onAplicaDañoDesdeChat.bind(this));
  }
   static _onDañoDesdeChat (event){
     const element = event.currentTarget;
     const dataset = element.dataset;
     if (dataset.exito=="true"){
     }else {
       return 1;
     }
     let tirada="";
     tirada=dataset.daño+"+"+dataset.efecto+"d6x"+"+"+dataset.bonos;
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
       objetivo_id=objetivo.data._id;
     }
     let causa_daño=false;
     if (total > 0 && objetivo){
       causa_daño=true;
     }
     else {
       total=0;
     }

     console.log ("CAUSA DAÑO")
     console.log (causa_daño)
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


  static _onAplicaDañoDesdeChat (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const objetivo=canvas.tokens.get(dataset.objetivo);
    let VidaActual=0;
    let Mensaje=""
    if (objetivo){
      VidaActual=Number(objetivo.document._actor.data.data.Puntos_de_Vida.value)-Number(dataset.daño)
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
