export async function tiradaHechizo (actor, dataset, val_atributo, bonos, dificultad, tipo_dado, forzar, mana)
{
  if (actor.system.derivadas.puntosMana.value - mana < 0){
    ui.notifications.warn("No tienes suficiente MANA para lanzar ese hechizo");
    return 1;
  }
  let manaActual=actor.system.derivadas.puntosMana.value - mana;
  actor.update ({ 'data.derivadas.puntosMana.value': manaActual });
  let tirada="1d10x+1d10x+1d10x";
  let d10Roll = new Roll(tirada).roll({async: false});
  let d10s = d10Roll.result.split(" + ").sort((a, b) => a - b);
  let dado = tipo_dado;
  let total= 0;
  let dado_elegido=0;
  let resultado="";
  let efecto =0;
  if (dado==="menor"){
    total=Number(d10s[0])+Number(dataset.nivel)+Number(val_atributo)+Number(bonos)-actor.system.derivadas.estorbo;
    dado_elegido=0;
  }
  if (dado==="objetivo"){
    total=Number(d10s[1])+Number(dataset.nivel)+Number(val_atributo)+Number(bonos)-actor.system.derivadas.estorbo;
    dado_elegido=1;
  }
  if (dado==="mayor"){
    total=Number(d10s[2])+Number(dataset.nivel)+Number(val_atributo)+Number(bonos)-actor.system.derivadas.estorbo;
    dado_elegido=2;
  }
  if (Number(d10s[dado_elegido]) == 1 && Number(d10s[dado_elegido+1]) <= 5){
    resultado="PIFIA"
  } else if (total < Number(dificultad) || Number(d10s[dado_elegido]) == 1){
    resultado="FALLO";
  }
  else {
      resultado="ÉXITO";
      efecto = Math.floor((total - Number(dificultad))/10);
      if (efecto >= 1){
        resultado="CRÍTICO: +";
        resultado +=efecto;
        resultado +="d6"
      }
  }
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tiradaHechizoChat.html';
  const datos_template_chat = {
                          val_atributo: val_atributo,
                          nom_habilidad: dataset.hechizo,
                          val_habilidad: dataset.nivel,
                          bonos: bonos,
                          dado_menor: d10s[0],
                          dado_medio: d10s[1],
                          dado_mayor: d10s[2],
                          tipo_dado: dado,
                          dificultad: dificultad,
                          total: total,
                          resultado: resultado,
                          efecto: efecto,
                          estorbo: actor.system.derivadas.estorbo
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d10Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);
}
