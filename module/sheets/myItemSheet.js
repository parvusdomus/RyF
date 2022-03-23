export default class RyFItemSheet extends ItemSheet{
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["RyF", "sheet", "item"],
      width: 320,
      height: 450,
      resizable: false
    });
  }
  get template(){
          return `systems/RyF/templates/items/${this.item.data.type}.html`;
      }
}
