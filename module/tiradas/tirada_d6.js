export async function tiradaD6 (actor,nD6, bono, explota)
{


  let tirada="";

  if (explota=="Si"){
    tirada=nD6+"d6x+"+bono;
  }
  else{
    tirada=nD6+"d6+"+bono;
  }

  let d6Roll = new Roll(tirada).roll({async: false});
  let total= 0;
  total=eval(d6Roll.result);
  const archivo_template_chat = '/systems/RyF/templates/dialogs/tirada_D6_chat.html';
  const datos_template_chat = {
                          tirada: tirada,
                          total: total
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d6Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);





}
