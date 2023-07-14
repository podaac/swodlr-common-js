import {DataTypes, Model} from 'sequelize';
import {v4 as uuidv4} from 'uuid';
import User from './user.js';

/** RasterDefinition model */
export default class RasterDefinition extends Model {}

/**
 * Initialize the RasterDefinition model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  RasterDefinition.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
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
  RasterDefinition.belongsTo(User, {
    foreignKey: 'userId',
  });
}
