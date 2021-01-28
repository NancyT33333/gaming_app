const cds = require('@sap/cds')
const { Games } = cds.entities
 const proxy = require('@sap/cds-odata-v2-adapter-proxy')
 
 cds.on('bootstrap', app => app.use(proxy()))
/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
  srv.after ('READ', 'Games', each => new Date().getDay() === 5 && _addDiscount2(each))
})

/** Add some discount for friday games */
function _addDiscount2 (each) {
  each.name += ` -- 20% discount!`;
  each.price = Math.floor(each.price*0.8);
}

