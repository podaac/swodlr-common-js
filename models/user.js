import {DataTypes, Model} from 'sequelize';
import {v4 as uuidv4} from 'uuid';
import L2RasterProduct from './l2-raster-product.js';

/** User model */
export default class User extends Model {}

/**
 * Initialize the User model
 * @param {Sequelize} sequelize - a sequelize instance
 */
export function init(sequelize) {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
  User.belongsToMany(L2RasterProduct, {
    through: 'ProductHistory',
    foreignKey: 'requestedById',
  });
}
