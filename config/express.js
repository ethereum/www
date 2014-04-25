/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.express = {
  middleware: {
    poweredBy: false
  },
 
  customMiddleware: function (app) {
    app.disable('x-powered-by');
  }
};
 
module.exports.cache = {
	// The number of seconds to cache files being served from disk
	// (only works in production mode)
	maxAge: 31557600000
};

