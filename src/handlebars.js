export const registerHandleBarsHelpers = async function () {
  Handlebars.registerHelper('sum', function (a, b) {
    return Number(a)+Number(b);
  });
  Handlebars.registerHelper('readOnlyIfIsLocked', function (system) {
    return (system.locked && !game.user.isGM) ? "readonly" : "";
  });
};
