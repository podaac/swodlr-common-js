import Granule, {
  init as granuleInit,
  associate as granuleAssociate,
} from '../models/granule.js';
import L2RasterProduct, {
  init as l2RasterProductInit,
  associate as l2RasterProductAssociate,
} from '../models/l2-raster-product.js';
import ProductHistory, {
  init as productHistoryInit,
  associate as productHistoryAssociate,
} from '../models/product-history.js';
import RasterDefinition, {
  init as rasterDefinitionInit,
  associate as rasterDefinitionAssociate,
} from '../models/raster-definition.js';
import Status, {
  init as statusInit,
  associate as statusAssociate,
} from '../models/status.js';
import User, {
  init as userInit,
  associate as userAssociate,
} from '../models/user.js';

/**
 * Initialize all models
 * @param {Sequelize} sequelize - instance of Sequelize
 */
export default function init(sequelize) {
  userInit(sequelize);
  rasterDefinitionInit(sequelize);
  l2RasterProductInit(sequelize);
  granuleInit(sequelize);
  productHistoryInit(sequelize);
  statusInit(sequelize);

  userAssociate();
  rasterDefinitionAssociate();
  l2RasterProductAssociate();
  granuleAssociate();
  productHistoryAssociate();
  statusAssociate();
}

export {
  Granule,
  L2RasterProduct,
  ProductHistory,
  RasterDefinition,
  Status,
  User,
};
