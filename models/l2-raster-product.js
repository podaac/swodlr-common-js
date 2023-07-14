import {DataTypes, Model} from 'sequelize';
import {v4 as uuidv4} from 'uuid';
import Granule from './granule.js';
import Status from './status.js';
import User from './user.js';

/** L2RasterProduct model */
export default class L2RasterProduct extends Model {}

/**
 * Initialize the L2RasterProduct model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  L2RasterProduct.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pass: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scene: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    outputGranuleExtentFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    outputSamplingGridType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rasterResolution: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    utmZoneAdjust: {
      type: DataTypes.INTEGER,
    },
    mgrsBandAdjust: {
      type: DataTypes.INTEGER,
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
  L2RasterProduct.hasMany(Granule, {
    foreignKey: 'productId',
  });
  L2RasterProduct.hasMany(Status, {
    foreignKey: 'productId',
  });
  L2RasterProduct.belongsToMany(User, {
    through: 'ProductHistory',
    foreignKey: 'rasterProductId',
  });
}
