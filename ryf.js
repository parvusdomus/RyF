import RyFActorSheet from "./module/sheets/myActorSheet.js";
import RyFItemSheet from "./module/sheets/myItemSheet.js";
import RyFExtras from "./module/sheets/RyFExtras.js";
import RyFSimpleNPJSheet from "./module/sheets/mySimplePNJSheet.js"
import registerSystemSettings from "./module/settings.js";
import { preloadHandlebarsTemplates } from "./module/preloadTemplates.js";

Hooks.once("init", function(){
    console.log("test | Initializing BOL CHARSHEETS");
    console.log("Language on init Hook (game.i18n.lang): "+game.i18n.lang)
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("ryf", RyFActorSheet, {
      makeDefault: true,
      types: ['jugador']
    });
    Actors.registerSheet("ryf", RyFSimpleNPJSheet, {
      makeDefault: true,
      types: ['pnj']
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ryf", RyFItemSheet);
    console.log ("test | CHARSEETS DONE");
    console.log ("test | LOADING TEMPLATES");
    preloadHandlebarsTemplates();
    console.log ("test | DONE LOADING TEMPLATES");

    CONFIG.Combat.initiative = {
    formula: "{1d10x, 1d10x, 1d10x}dh1kh1 + @iniciativa - @estorbo",
    decimals: 0};

    registerSystemSettings();

});

Hooks.on('renderChatLog', (app, html, data) => RyFExtras.chatListeners(html))

Hooks.on('renderTokenHUD', async (hud, html, token) => {
  const actor = game.actors.get(token.actorId)
  const buttonDisplay = await renderTemplate('/systems/ryf/templates/tokens/extended-hud.html')
  html.find('div.right')
      .append(buttonDisplay)
      .click((event) => {
          let activeButton, clickedButton, tokenButton;
          let controlIcons = html.find('div.control-icon');
          for ( const button of controlIcons ) {
              if (button.classList.contains('active')) activeButton = button
              if (button === event.target.parentElement) clickedButton = button
              if (button.dataset.action === 'thwildcard-selector') tokenButton = button
          }

          if (clickedButton === tokenButton) {
              console.log("Clic en el boton custom")
          }
      })
})