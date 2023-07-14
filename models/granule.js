import {DataTypes, Model} from 'sequelize';
import {v4 as uuidv4} from 'uuid';
import L2RasterProduct from './l2-raster-product.js';

/** Granule model */
export default class Granule extends Model {}

/**
 * Initialize the Granule model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  Granule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    uri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });
}

/**
 * Setup model associations
 */
export function associate() {
  Granule.belongsTo(L2RasterProduct, {
    foreignKey: 'productId',
  });
}
