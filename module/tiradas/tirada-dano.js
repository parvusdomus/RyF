export async function tiradaDano (actor, dataset, val_atributo, val_habilidad, bonos, dificultad, tipo_dado, forzar, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, alcance_corto, alcance_medio, alcance_largo, dano_corto, dano_medio, dano_largo, absorcion_armadura, bonos_dano, dano)
{
  let tirada="";
  tirada=dano+"+"+bonos_dano;
  let objetivo_id=""
  let d6Roll = new Roll(tirada).roll({async: false});
  let total= 0;
  let resultado="";
  let causa_dano=false;
  resultado=eval(d6Roll.result);
  total=Number(resultado)-Number(absorcion_armadura ? absorcion_armadura : "0");
  if (objetivo){objetivo_id=objetivo.document.actorId}
  if (total > 0 && objetivo){
    causa_dano=true;
  }
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tirada_dano_chat.html';
  const datos_template_chat = {
                          tirada: tirada,
                          nom_habilidad: dataset.arma,
                          armadura: absorcion_armadura,
                          resultado: resultado,
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
