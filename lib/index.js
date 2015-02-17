// Generated by CoffeeScript 1.9.0
(function() {
  var Colors, Couchbase, CouchbaseConstants, Promise, Repository, ViewQuery;

  Colors = require('colors');

  Couchbase = require('couchbase');

  ViewQuery = Couchbase.ViewQuery;

  Promise = require('bluebird');

  'use strict';

  CouchbaseConstants = {
    COUCHBASE_KEY_ENOENT: 0x0d
  };

  Repository = (function() {
    function Repository() {}

    Repository.cluster;

    Repository.bucket;

    Repository.init = function(connectionString, bucketName) {
      if (!connectionString) {
        console.error('Repository error: The connection string is missing!');
      }
      if (!bucketName) {
        console.error('Repository error: The bucket name is missing!');
      }
      this.cluster = new Couchbase.Cluster(connectionString);
      return this.bucket = this.cluster.openBucket(bucketName, function(err) {
        if (err != null) {
          console.error(("Repository error: Failed to connect to the '" + bucketName + "' bucket on the Couchbase cluster: " + connectionString).red.bold);
          return process.exit(1);
        } else {
          return console.log(("Successfully connected to the '" + bucketName + "' bucket on the Couchbase cluster " + connectionString).green);
        }
      });
    };

    Repository.existsAsync = function(docId) {
      return new Promise(function(fulfill, reject) {
        return Repository.bucket.get(docId, function(error, result) {
          if (error != null) {
            if (error.code === CouchbaseConstants.COUCHBASE_KEY_ENOENT) {
              return fulfill(false);
            } else {
              return reject(error);
            }
          } else {
            return fulfill(true);
          }
        });
      });
    };

    Repository.getAsync = function(docId) {
      return new Promise(function(fulfill, reject) {
        return Repository.bucket.get(docId, function(error, result) {
          if (error != null) {
            return reject(error);
          } else {
            return fulfill(result.value);
          }
        });
      });
    };

    Repository.getViewAsync = function(designDocumentName, viewName, key) {
      return new Promise(function(fulfill, reject) {
        var query;
        query = ViewQuery.from(designDocumentName, viewName).key(key).stale(ViewQuery.Update.BEFORE);
        return Repository.bucket.query(query, function(error, results) {
          if (error != null) {
            return reject(error);
          } else {
            return fulfill(results);
          }
        });
      });
    };

    Repository.createAsync = function(docId, docContent) {
      return new Promise(function(fulfill, reject) {
        return Repository.bucket.insert(docId, docContent, function(error, result) {
          if (error != null) {
            return reject(error);
          } else {
            return fulfill(null);
          }
        });
      });
    };

    Repository.replaceAsync = function(docId, docContent) {
      return new Promise(function(fulfill, reject) {
        return Repository.bucket.replace(docId, docContent, function(error, result) {
          if (error != null) {
            return reject(error);
          } else {
            return fulfill(null);
          }
        });
      });
    };

    Repository.deleteAsync = function(docId) {
      return new Promise(function(fulfill, reject) {
        return Repository.bucket.remove(docId, function(error, result) {
          if (error != null) {
            return reject(error);
          } else {
            return fulfill(null);
          }
        });
      });
    };

    return Repository;

  })();

  module.exports = Repository;

}).call(this);

//# sourceMappingURL=index.js.map