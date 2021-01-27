const cds = require('@sap/cds')
const { Games } = cds.entities

/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
  srv.after ('READ', 'Games', each => new Date().getDay() === 5 && _addDiscount2(each))
})

/** Add some discount for friday games */
function _addDiscount2 (each) {
  each.name += ` -- 20% discount!`;
  each.price = Math.floor(each.price*0.8);
}

