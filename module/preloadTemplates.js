export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ryf/templates/actors/jugador-tabs/Jugador_inventario.html",
      "/systems/ryf/templates/actors/jugador-tabs/Jugador_talentos.html",
      "/systems/ryf/templates/actors/jugador-tabs/Jugador_biografia.html",
      "/systems/ryf/templates/dialogs/tirada_atributo.html"
    ];
        return loadTemplates(templatePaths);
};
