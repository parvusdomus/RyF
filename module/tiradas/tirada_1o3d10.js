export async function tirada1o3D10 (actor, bono, forzar)
{
  console.log ("TIRADA 1o3D10, actor, bono, forzar")
  console.log (actor)
  console.log (bono)
  console.log (forzar)
  let tirada="1d10x+1d10x+1d10x";
  let d10Roll = new Roll(tirada).roll({async: false});
  let d10s = d10Roll.result.split(" + ").sort((a, b) => a - b);
  let dado_elegido = "";
  let total= 0;
  if (forzar==="menor"){
    total=Number(d10s[0])+Number(bono);
    dado_elegido="menor";
  }
  if (forzar==="objetivo"){
    total=Number(d10s[1])+Number(bono);
    dado_elegido="objetivo";
  }
  if (forzar==="mayor"){
    total=Number(d10s[2])+Number(bono);
    dado_elegido="mayor";
  }
  if (forzar===""){
    total=Number(d10s[1])+Number(bono);
    dado_elegido="objetivo";
  }
  console.log ("TOTAL")
  console.log (total)
  console.log ("DADO")
  console.log (dado_elegido)
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tirada_1o3D10_chat.html';
  const datos_template_chat = {
                          total: total,
                          dado_menor: d10s[0],
                          dado_medio: d10s[1],
                          dado_mayor: d10s[2],
                          bonos: bono,
                          tipo_dado: dado_elegido
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d10Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);





}
