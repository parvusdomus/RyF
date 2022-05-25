export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ryf/templates/actors/Jugador_partes/Jugador_habilidades.html",
      "/systems/ryf/templates/actors/Jugador_partes/Jugador_inventario.html",
      "/systems/ryf/templates/actors/Jugador_partes/Jugador_talentos.html",
      "/systems/ryf/templates/actors/Jugador_partes/Jugador_biografia.html",
      "/systems/ryf/templates/dialogs/tirada_atributo.html"
    ];
        return loadTemplates(templatePaths);
};
