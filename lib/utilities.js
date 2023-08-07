import fs from 'fs/promises';
import path from 'path';
import initModels from './models.js';
import Ajv from 'ajv/dist/2020.js';
import {SSM} from '@aws-sdk/client-ssm';
import {Sequelize} from 'sequelize';
import winston from 'winston';

/**
 * A utilities class used for hosting simple utility functions and singletons
 * of common tools
 */
export default class Utilities {
  static #instance;

  #ajv = new Ajv({
    useDefaults: true,
    removeAdditional: true,
  });
  #ssm = new SSM({});
  #ssmParameters = new Map();

  #sequelize;
  #loggers;
  #ssmPath;

  /**
   * Constructs a new Utilities class without initializing it
   * @param {String} appName root application name
   * @param {String} serviceName microservice name
   */
  constructor(appName, serviceName) {
    this.#ssmPath = `/service/${appName}/${serviceName}/`;
    this.#init();
  }

  /**
   * Initializes the Utilities class's required services
   */
  async #init() {
    await this.#loadSSMParameters();
    await this.#setupDatabase();
    await this.#preloadSchemas();
    this.#setupLogger();
  }

  /**
   * Preloads all the schemas in the schemas/ dir for later use. Enables cross
   * reference use of schemas via ajv's resolution
   */
  async #preloadSchemas() {
    const schemaDir = await fs.opendir('../schemas');
    for await (const entry of schemaDir) {
      if (!entry.isFile()) {
        continue;
      }

      const schema = JSON.parse(await fs.readFile(entry.path));
      const name = entry.name.split('.')[0]; // Use the base name
      this.#ajv.addSchema(name, schema);
    }
  }

  /**
   * Loads parameters from SSM by paginating through the SSM path
   */
  async #loadSSMParameters() {
    if (this.#ssmParameters.size > 0) return;

    let nextToken;
    do {
      const input = {
        Path: this.#ssmPath,
        WithDecryption: true,
      };
      if (nextToken) input['NextToken'] = nextToken;

      const res = await this.#ssm.getParametersByPath(input);
      nextToken = res?.NextToken;

      for (const param of res.Parameters) {
        const name = param.Name.replace(this.#ssmPath, '');
        this.#ssmParameters.set(name, param.Value);
      }
    } while (nextToken);
  }

  /**
   * Initializes a new Sequelize instance and initializes database models with
   * the instance
   */
  async #setupDatabase() {
    if (this.#sequelize) return;

    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: this.getParameter('db_host'),
      username: this.getParameter('db_username'),
      password: this.getParameter('db_password'),
      database: this.getParameter('db_name'),
    });
    initModels(sequelize);

    this.#sequelize = sequelize;
  }

  /**
   * Sets up the Winston logger with a application-wide log level and output to
   * the console
   */
  #setupLogger() {
    if (this.#loggers) return;

    this.#loggers = new winston.Container({
      level: this.getParameter('log_level') ?? 'info',
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  /**
   * Retrieves a parameter's value from the internal SSM parameter cache
   * @param {string} name parameter name
   * @return {string} parameter value
   */
  getParameter(name) {
    return this.#ssmParameters.get(name);
  }

  /**
   * Creates and returns a logger for use within a module. Adds extra formatting
   * to base winston config
   * @param {string} filepath the raw path to the module requesting a logger
   *                          (usually import.meta.url)
   * @return {winston.Logger} a logger for the module
   */
  getLogger(filepath) {
    const name = path.basename(filepath);

    if (this.#loggers.has(name)) {
      return this.#loggers.get(name);
    } else {
      return this.#loggers.add(name, {
        format: winston.format.combine(
            winston.format.errors({stack: true}),
            winston.format.simple(),
            winston.format.label({
              message: true,
              label: name,
            }),
        ),
      });
    }
  }

  /**
   * Loads a json schema from the Ajv internal store
   * @param {string} schemaName base filename of the json schema without the
   *                            .json extension
   * @return {function} a validation function from ajv
   */
  loadSchema(schemaName) {
    this.#ajv.getSchema(schemaName);
  }

  /**
   * Provides access to the internal sequelize instance
   */
  get sequelize() {
    return this.#sequelize;
  }
}
