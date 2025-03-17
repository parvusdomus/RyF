export default class RyFItemSheet extends ItemSheet{
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ryf", "sheet", "item"],
      width: 320,
      height: 450,
      resizable: false
    });
  }

  getData() {
    const superData = super.getData();
    const data = superData.data;
    const settings = this.loadSettings();
    data.settings = settings;
    data.system.descripcion = TextEditor.enrichHTML(data.system.descripcion, {async: false});
    return data;
  }

  get template(){
    return `systems/ryf/templates/items/${this.item.type}.html`;
  }


  //Load settings that are used in the actor sheet
  loadSettings(){
    let settings = {};
    settings.charismaEnabled = game.settings.get("ryf","charismaEnabled");
    return settings;
  }
}
