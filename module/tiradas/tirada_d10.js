export async function tiradaD10 (actor,nD10, bono, explota)
{


  let tirada="1d10";

  if (explota=="Si"){
    tirada=nD10+"d10x+"+bono;
  }
  else{
    tirada=nD10+"d10+"+bono;
  }

  let d10Roll = new Roll(tirada).roll({async: false});
  let total= 0;
  total=eval(d10Roll.result);
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tiradaDadoChat.html';
  const datos_template_chat = {
                          tirada: tirada,
                          total: total
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d10Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);





}
