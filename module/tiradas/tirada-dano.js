export async function tiradaDano (nombreArma, objetivo, absorcion, bonificador, numeroDados) {
    let tirada = "";
    tirada = numeroDados + "D6x+" + bonificador;
    if (absorcion) {
        tirada = tirada + "-" + absorcion;
    }
    let objetivo_id = ""
    let d6Roll = new Roll(tirada).roll({async: false});
    let d6Results = d6Roll.dice[0].results;
    let total = 0;
    let causa_dano = false;
    let resultadoTirada = "(";
    for (let i = 0; i < d6Results.length; i++){
        if(i > 0){
            resultadoTirada = resultadoTirada.concat("+");
        }
        resultadoTirada = resultadoTirada.concat(d6Results[i].result);
    }
  resultadoTirada = resultadoTirada + ") + " + bonificador;
  if(absorcion){
    resultadoTirada = resultadoTirada + "-" + absorcion;
  }
  total=d6Roll.total;
  if (objetivo){objetivo_id=objetivo}
  if (total > 0 && objetivo){
    causa_dano=true;
  }
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tiradaDanoChat.html';
  const datos_template_chat = {
      tirada: tirada,
      resultadoTirada: resultadoTirada,
      nombreArma: nombreArma,
      total: total,
      objetivo: objetivo_id,
      causa_dano: causa_dano
  };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d6Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);
}
