export const registerHandleBarsHelpers = async function () {
    Handlebars.registerHelper('sum', function (a, b) {
        return Number(a)+Number(b);
      })
};
