export default function registerSystemSettings() {
    // Enable magic system
    game.settings.register("ryf", "advanced.magicEnabled", {
        name: "Activar Magia",
        hint: "Incluye los items de tipo Hechizo y activa la pestaña de hechizos en la ficha de personaje.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });
}