export default class RyFItemSheet extends ItemSheet{
  static get defaultOptions() {
    if (game.settings.get ("ryf", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["ryf", "sheet", "item"],
      width: 320,
      height: 450,
      resizable: false
    });
  }
  get template(){
          return `systems/ryf/templates/items/${this.item.data.type}.html`;
      }
}
