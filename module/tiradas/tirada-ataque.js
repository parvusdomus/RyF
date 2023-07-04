export async function tiradaAtaque (tipo_dado, val_atributo, val_habilidad, bonoAtaque, dificultad, arma, objetivo, absorcionArmadura, danoBonificador, danoNumeroDados)
{
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
  if (objetivo){
    objetivo_id=objetivo;
  }
  if (dado==="menor"){
    total=Number(d10s[0])+Number(val_habilidad)+Number(val_atributo)+Number(bonoAtaque);
    dado_elegido=0;
  }
  if (dado==="objetivo"){
    total=Number(d10s[1])+Number(val_habilidad)+Number(val_atributo)+Number(bonoAtaque);
    dado_elegido=1;
  }
  if (dado==="mayor"){
    total=Number(d10s[2])+Number(val_habilidad)+Number(val_atributo)+Number(bonoAtaque);
    dado_elegido=2;
  }
  
  if (Number(d10s[dado_elegido]) == 1 && (d10s[dado_elegido+1] && Number(d10s[dado_elegido+1]) <= 5)){
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
  const archivo_template_chat = '/systems/ryf/templates/dialogs/tiradaAtaqueChat.html';
  const datos_template_chat = {
                          val_atributo: val_atributo,
                          nom_habilidad: arma,
                          val_habilidad: val_habilidad,
                          bonos: bonoAtaque,
                          dado_menor: d10s[0],
                          dado_medio: d10s[1],
                          dado_mayor: d10s[2],
                          tipo_dado: dado,
                          dificultad: dificultad_total,
                          total: total,
                          resultado: resultado,
                          efecto: efecto,
                          danoBonificador: danoBonificador,
                          danoNumeroDados: danoNumeroDados,
                          objetivo_id: objetivo_id,
                          exito: exito,
                          absorcion_armadura: absorcionArmadura
                        };
  const contenido_Dialogo_chat = await renderTemplate(archivo_template_chat, datos_template_chat);
  const chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: d10Roll,
        content: contenido_Dialogo_chat,
    };
  ChatMessage.create(chatData);
}
