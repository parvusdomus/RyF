export default function registerSystemSettings() {
    // Force font size
    game.settings.register("ryf", "forceFontSize", {
        name: "Forzar Tamano de Fuente",
        hint: "Activa esta opción si la ficha se ve rara. Activarla forzará el tamano de la fuente a 5.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    // Enable magic system
    game.settings.register("ryf", "advanced.magicEnabled", {
        name: "Activar Magia",
        hint: "Incluye los items de tipo Hechizo y activa la pestaña de hechizos en la ficha de personaje.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });
}