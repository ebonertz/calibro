var ContentfulService = require('../services/contentful.server.service.js');
var marked = require('marked');
var _ = require('lodash');
var config = require('../../config/config');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

function mapPropertiesToHtml(result, notProcess) {

  _.forEach(_.keys(result), function(key) {
    var shouldNotProcess = _.find(notProcess, function(item) {
      return item == key;
    });
    if (typeof result[key] === "string" && !shouldNotProcess) {
      result[key] = marked(result[key]);
    }
  });
  return result;
};

module.exports = function(app) {
  var controller = {};

  controller.help = function(req, res) {
    ContentfulService.help(function(err, result) {
      if (err) {
        return res.sendStatus(400);
      } else {
        res.json(mapPropertiesToHtml(result));
      }
    });
  };

  controller.eyewear = function(req, res) {
    var gender = req.params.gender;
    ContentfulService.eyewear(gender, function(err, result) {
      if (err) {
        return res.sendStatus(400);
      } else {
        res.json(mapPropertiesToHtml(result));
      }
    });
  };

  controller.sunglasses = function(req, res) {
    var gender = req.params.gender;
    ContentfulService.sunglasses(gender, function(err, result) {
      if (err) {
        return res.sendStatus(400);
      } else {
        res.json(mapPropertiesToHtml(result));
      }
    });
  };

  controller.menSummer = function(req, res) {
    ContentfulService.menSummer(function(err, result) {
      if (err) {
        return res.sendStatus(400);
      } else {
        res.json(mapPropertiesToHtml(result));
      }
    });
  };

  controller.womenSummer = function(req, res) {
    ContentfulService.womenSummer(function(err, result) {
      if (err) {
        return res.sendStatus(400);
      } else {
        res.json(mapPropertiesToHtml(result));
      }
    });
  };


  controller.getView = function(req, res) {
    var slug = req.params.slug;
    var timestamp = Date.now();

    ContentfulService.getView(slug).then(function(content){
      // console.log(content);
      return res.json(content);
    }).catch(function(err) {
      if(err.message === 'No entries found') {
        return res.sendStatus(404);
      } else {
        app.logger.error(err);
        return res.status(400).send(err.message);
      }
    })
  }

  /*
    Cache management
   */

  var flush_id = 0;

  controller.clearCache = function(req, res) {
    var current_flush_id = flush_id++;
    setTimeout(function() {
      ContentfulService.getCache().flushAll();
      app.logger.info('[Contentful.clearCache] FlushAll [' + current_flush_id + '] completed.');
    }, config.contentful.cache.flushTimeout * 1000);

    var message = 'FlushAll [' + current_flush_id + '] issued (' + config.contentful.cache.flushTimeout + 's timeout)';
    res.json(message);
    app.logger.info('[Contentful.clearCache]', message);
  }


  return controller;
}
