import RyFActorSheet from "./module/sheets/myActorSheet.js";
import RyFItemSheet from "./module/sheets/myItemSheet.js";
import RyFExtras from "./module/sheets/RyFExtras.js";
import RyFSimpleNPJSheet from "./module/sheets/mySimplePNJSheet.js"

import { preloadHandlebarsTemplates } from "./module/preloadTemplates.js";

Hooks.once("init", function(){
    console.log("test | Initializing BOL CHARSHEETS");

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("ryf", RyFActorSheet, {
      makeDefault: true,
      types: ['Jugador']
    });
    Actors.registerSheet("ryf", RyFSimpleNPJSheet, {
      makeDefault: true,
      types: ['PNJ']
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ryf", RyFItemSheet);
    console.log ("test | CHARSEETS DONE");
    console.log ("test | LOADING TEMPLATES");
    preloadHandlebarsTemplates();
    console.log ("test | DONE LOADING TEMPLATES");
    game.settings.register("ryf", "forceFontSize", {
      name: "Forzar Tamaño de Fuente",
      hint: "Activa esta opción si la ficha se ve rara. Activarla forzará el tamaño de la fuente a 5.",
      scope: "world",
      type: Boolean,
      default: false,
      config: true
    });
    CONFIG.Combat.initiative = {
    formula: "{1d10x, 1d10x, 1d10x}dh1kh1 + @Iniciativa - @Estorbo_Total",
    decimals: 0};

});

Hooks.on('renderChatLog', (app, html, data) => RyFExtras.chatListeners(html))
