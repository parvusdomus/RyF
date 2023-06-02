export async function tiradaDano (actor, dataset, val_atributo, val_habilidad, bonos, dificultad, tipo_dado, forzar, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, alcance_corto, alcance_medio, alcance_largo, daño_corto, daño_medio, daño_largo, absorcion_armadura, bonos_daño, daño)
{
  let tirada="";
  tirada=daño+"+"+bonos_daño;
  let objetivo_id=""
  let d6Roll = new Roll(tirada).roll({async: false});
  let total= 0;
  let resultado="";
  let causa_daño=false;
  resultado=eval(d6Roll.result);
  total=Number(resultado)-Number(absorcion_armadura);
  if (objetivo){objetivo_id=objetivo.data._id}
  if (total > 0 && objetivo){
    causa_daño=true;
  }
  else {
    total=0;
  }
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
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d6Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);
}
