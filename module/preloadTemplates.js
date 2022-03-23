export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/RyF/templates/actors/Jugador_partes/Jugador_habilidades.html",
      "/systems/RyF/templates/actors/Jugador_partes/Jugador_inventario.html",
      "/systems/RyF/templates/actors/Jugador_partes/Jugador_talentos.html",
      "/systems/RyF/templates/actors/Jugador_partes/Jugador_biografia.html",
      "/systems/RyF/templates/dialogs/tirada_atributo.html"
    ];
        return loadTemplates(templatePaths);
};
