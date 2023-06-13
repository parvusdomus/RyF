export default class RyFItemSheet extends ItemSheet{
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryf", "sheet", "item"],
      width: 320,
      height: 450,
      resizable: false
    });
  }

  getData() {
    const superData = super.getData();
        const data = superData.data;
        data.system.descripcion = TextEditor.enrichHTML(data.system.descripcion, {async: false});
        return data;
  }

  get template(){
          return `systems/ryf/templates/items/${this.item.type}.html`;
      }
}
