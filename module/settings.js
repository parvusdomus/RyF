export default function registerSystemSettings() {
    // Enable magic system
    game.settings.register("ryf", "magicEnabled", {
        name: "Activar Magia",
        hint: "Incluye los items de tipo Hechizo y activa la pestaña de hechizos en la ficha de personaje.",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    //Enable charisma attribute
    game.settings.register("ryf", "charismaEnabled", {
        name: "Activar Carisma",
        hint: "Habilita el atributo Carisma",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    //Enable charisma attribute
    game.settings.register("ryf", "hitPointsMultiplier", {
        name: "Multiplicador para vida maxima",
        hint: "La vida máxima se calcula con Físico * Multiplicador",
        scope: "world",
        type: Number,
        default: 4,
        config: true
    });
}