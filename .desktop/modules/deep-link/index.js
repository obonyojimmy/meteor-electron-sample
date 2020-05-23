/* eslint-disable no-unused-vars */
import { protocol } from 'electron';
import moduleJson from './module.json';

/**
 * Example module.
 *
 * @param {Object} log         - Winston logger instance
 * @param {Object} skeletonApp - reference to the skeleton app instance
 * @param {Object} appSettings - settings.json contents
 * @param {Object} eventsBus   - event emitter for listening or emitting events
 *                               shared across skeleton app and every module/plugin
 * @param {Object} modules     - references to all loaded modules
 * @param {Object} settings    - module settings
 * @param {Object} Module      - reference to the Module class
 * @constructor
 */
export default class DeepLink {
  constructor({
    log, skeletonApp, appSettings, eventsBus, modules, settings, Module
  }) {
    const { builderOptions } = appSettings
    /**
     * You can also just have a one `config` param and do `Object.assign(this, config);`
     */
    this.module = new Module(moduleJson.name);

    // Get the automatically predefined logger instance.
    this.log = log;
    this.eventsBus = eventsBus;
    this.protocolPrefix = builderOptions.protocols[0].schemes[0]


    this.eventsBus.on('desktopLoaded', () => {
      this.init();
      // this.module.send('challegeCode', 'testing');
      /* this.eventsBus.on('windowCreated', () => {
        log.info('ok')
        // win.webContents.send('asynchronous-message', {'SAVED': 'File Saved'});
        this.module.send('challegeCode', 'testing');
      }) */
    });
  }

  init() {
    // Do some initialization if necessary.

    this.registerApi();

    // Lets inform that the module has finished loading.
    this.eventsBus.emit(`${moduleJson.name}.loaded`);
  }

  registerApi() {
    const protocolPrefix = this.protocolPrefix
    const log = this.log
    // const module = this.module
    // const eventsBus = this.eventsBus

    /* this.module.on('init', (event, fetchId) => {
      log.info('init received');
      this.module.respond('init', fetchId, 'blahblah');
    }); */

    protocol.registerHttpProtocol(protocolPrefix, (req, cb) => {
      const url = req.url
      const msg = url.substr(protocolPrefix.length + 3)
      this.module.send('challegeCode', msg);
      this.eventsBus.on('loadingFinished', ()=> {
        this.module.send('challegeCode', msg)
      })
      log(`${msg} Sent`)
    }, (err) => {
      if (!err) {
        log.info(`protocol ${protocolPrefix}:// registered`)
        // this.eventsBus.on('loadingFinished', ()=> {
        //  this.module.send('challegeCode', 'init')
        // })
      } else {
        log.error(`could not register protocol ${protocolPrefix}://`, err)
      }
    })
  }
}
