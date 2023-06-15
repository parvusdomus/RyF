export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ryf/templates/actors/jugador-tabs/Jugador_biografia.html",
      "/systems/ryf/templates/dialogs/tiradaAtributo.html"
    ];
        return loadTemplates(templatePaths);
};
