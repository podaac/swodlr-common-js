import {DataTypes, Model} from 'sequelize';
import {v4 as uuidv4} from 'uuid';
import L2RasterProduct from './l2-raster-product.js';

/** Status model */
export default class Status extends Model {}

/**
 * Initialize the Status model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  Status.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
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
  Status.belongsTo(L2RasterProduct, {
    foreignKey: 'productId',
  });
}
