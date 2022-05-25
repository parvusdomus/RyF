export async function tiradaAtaque (actor, dataset, val_atributo, val_habilidad, bonos, dificultad, tipo_dado, forzar, objetivo, defensa_CaC, defensa_CaC_escudo, defensa_Dist_escudo, alcance_corto, alcance_medio, alcance_largo, daño_corto, daño_medio, daño_largo, absorcion_armadura)
{
  console.log ("TIRADA ATAQUE DATASET")
  console.log (dataset)
  let tirada="1d10x+1d10x+1d10x";
  let d10Roll = new Roll(tirada).roll({async: false});
  let d10s = d10Roll.result.split(" + ").sort((a, b) => a - b);
  let dado = tipo_dado;
  let total= 0;
  let dado_elegido=0;
  let resultado="";
  let efecto =0;
  let objetivo_id;
  let dificultad_total=Number(dificultad);
  let exito=false;
  if (dataset.habilidad=="Distancia"){
    dificultad_total+= defensa_Dist_escudo;
  }
  if (objetivo){
    objetivo_id=objetivo_id=objetivo.data._id;
  }
  if ( forzar != ""){
    dado=forzar;
  }
  if (dado==="menor"){
    total=Number(d10s[0])+Number(val_habilidad)+Number(val_atributo)+Number(bonos);
    dado_elegido=0;
  }
  if (dado==="objetivo"){
    total=Number(d10s[1])+Number(val_habilidad)+Number(val_atributo)+Number(bonos);
    dado_elegido=1;
  }
  if (dado==="mayor"){
    total=Number(d10s[2])+Number(val_habilidad)+Number(val_atributo)+Number(bonos);
    dado_elegido=2;
  }
  if (Number(d10s[dado_elegido]) == 1 && Number(d10s[dado_elegido+1]) <= 5){
    resultado="PIFIA"
  } else if (total < Number(dificultad_total) || Number(d10s[dado_elegido]) == 1){
    resultado="FALLO";
  }
  else {
      exito=true;
      resultado="ÉXITO";
      efecto = Math.floor((total - Number(dificultad_total))/10);
      if (efecto >= 1){
        resultado="CRÍTICO: +";
        resultado +=efecto;
        resultado +="d6"
      }
  }
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tirada_ataque_chat.html';
  const datos_template_chat = {
                          val_atributo: val_atributo,
                          nom_habilidad: dataset.arma,
                          val_habilidad: val_habilidad,
                          bonos: bonos,
                          dado_menor: d10s[0],
                          dado_medio: d10s[1],
                          dado_mayor: d10s[2],
                          tipo_dado: dado,
                          dificultad: dificultad_total,
                          total: total,
                          resultado: resultado,
                          efecto: efecto,
                          daño: daño_corto,
                          objetivo_id: objetivo_id,
                          exito: exito,
                          absorcion_armadura: absorcion_armadura
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d10Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);
}
