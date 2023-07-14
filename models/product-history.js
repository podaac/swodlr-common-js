import {DataTypes, Model} from 'sequelize';
import L2RasterProduct from './l2-raster-product.js';
import User from './user.js';

/** ProductHistory model */
export default class ProductHistory extends Model {}

/**
 * Initialize the ProductHistory model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  ProductHistory.init({
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
  });
}

/**
 * Setup model associations
 */
export function associate() {
  ProductHistory.belongsTo(L2RasterProduct, {
    foreignKey: 'rasterProductId',
  });
  ProductHistory.belongsTo(User, {
    foreignKey: 'requestedById',
  });
}
