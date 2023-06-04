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

Hooks.on('renderTokenHUD', async (hud, html, token) => {
  const actor = game.actors.get(token.actorId)
  const buttonDisplay = await renderTemplate('/systems/ryf/templates/tokens/extended-hud.html')
  html.find('div.right')
      .append(buttonDisplay)
      .click((event) => {
          let activeButton, clickedButton, tokenButton;
          console.log(clickedButton);
          console.log(activeButton);
          console.log(tokenButton);
          let controlIcons = html.find('div.control-icon');
          for ( const button of controlIcons ) {
              if (button.classList.contains('active')) activeButton = button
              if (button === event.target.parentElement) clickedButton = button
              if (button.dataset.action === 'thwildcard-selector') tokenButton = button
          }

          if (clickedButton === tokenButton && activeButton !== tokenButton) {
              tokenButton.classList.add('active')

              html.find('.thwildcard-selector-wrap')[0].classList.add('active')
              const effectSelector = '.effects'
              html.find(`.control-icon${effectSelector}`)[0].classList.remove('active')
              html.find('.status-effects')[0].classList.remove('active')
          } else {
              tokenButton.classList.remove('active')
              html.find('.thwildcard-selector-wrap')[0].classList.remove('active')
          }
      })

  const buttons = html.find('.thwildcard-button-select')

  buttons.map((button) => {
      buttons[button].addEventListener('click', function (event) {
          event.preventDefault()
          event.stopPropagation()
          const controlled = canvas.tokens.controlled
          const index = controlled.findIndex(x => x.data._id === token._id)
          const tokenToChange = controlled[index]
          const updateTarget = is080 ? tokenToChange.document : tokenToChange

          const dimensions = getTokenDimensions(updateTarget, event.target.dataset.name)
          let updateInfo = { img: event.target.dataset.name, ...dimensions }

          updateTarget.update(updateInfo)
      })
  })
})