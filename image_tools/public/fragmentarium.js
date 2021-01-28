/*
 *
 *
 * All Endpoints need to have at least the following:
 * annotationsList - current list of OA Annotations
 * dfd - Deferred Object
 * init()
 * search(uri)
 * create(oaAnnotation, returnSuccess, returnError)
 * update(oaAnnotation, returnSuccess, returnError)
 * deleteAnnotation(annotationID, returnSuccess, returnError) (delete is a reserved word)
 *
 */
(function (Mirador){

  Mirador.Fragmentarium = function (options) {
    this.catchOptions = {
      user: {
        id: this.userid,
        name: this.username
      },
      permissions: {
        'read':   [],
        'update': [this.userid],
        'delete': [this.userid],
        'admin': [this.userid]
      }
    };
    return Object.assign(this, {
      token: null,
      // prefix:    'annotation', /**/
      uri: null,
      url: options.url,
      dfd: null,
      // OA list for Mirador use
      annotationsList: [],
      // internal list for module use to map id to URI
      idMapper: {}
    }, options);

    // jQuery.extend(this, {
    //   token: null,
    //   // prefix:    'annotation', /**/
    //   uri: null,
    //   url: options.url,
    //   dfd: null,
    //   // OA list for Mirador use
    //   annotationsList: [],
    //   // internal list for module use to map id to URI
    //   idMapper: {}
    // }, options);

    this.init();
  };

  Mirador.Fragmentarium.prototype = {
    // Any set up for this endpoint, and triggers a search of the URI passed to object
    init: function (uri) {
    },

    create: function (oaAnnotation, returnSuccess, returnError) {
      var annotation = oaAnnotation;
      // mint an ID here.
      annotation['@id'] = Mirador.genUUID();

      var _this = this;

      jQuery.ajax({
        url: _this.url,
        type: 'POST',
        dataType: 'json',
        headers: {
          // 'x-annotator-auth-token': this.token
        },
        data: JSON.stringify(annotation),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          data.content.endpoint = _this;
          if (typeof returnSuccess === 'function') {
            returnSuccess(data.content);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to create annotation: ' + oaAnnotation['@id'] + ' due to ' + statusText);
          }
        }
      });
    },

    // Search endpoint for all annotations with a given URI
    search: function (options, successCallback, errorCallback) {
      var _this = this;

      this.annotationsList = []; // clear out current list
      jQuery.ajax({
        url: _this.url,
        cache: false,
        type: 'GET',
        dataType: 'json',
        headers: {
          // 'x-annotator-auth-token': this.token
        },
        data: {
          target_canvas: options.uri
        },

        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          _this.annotationsList = data; // gmr
          jQuery.each(_this.annotationsList, function(index, value) {
            value.endpoint = _this;
            // Ensure on is an array
          });
          if (typeof successCallback === 'function') {
            successCallback(data);
          } else {
            _this.dfd.resolve(true);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof errorCallback === 'function') {
            errorCallback();
          } else {
            _this.dfd.reject();
            console.log('The request for annotations has caused an error for endpoint: ' + options.uri + ' due to ' + statusText);
          }
        }

      });
    },

    deleteAnnotation: function (annotationID, returnSuccess, returnError) {
      var _this = this;
      jQuery.ajax({
        url: `${_this.url}${annotationID}`,
        type: 'DELETE',
        dataType: 'json',
        headers: {
          // 'x-annotator-auth-token': this.token
        },
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          if (typeof returnSuccess === 'function') {
            returnSuccess();
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to delete annotation ' + annotationID + ' due to ' + statusText);
          }
        }

      });
    },

    update: function (oaAnnotation, returnSuccess, returnError) {
      var annotation = oaAnnotation;
      var _this = this;
      var annotationID = annotation['@id'];

      // completely remove this reference and all dependents
      delete annotation.endpoint;

      jQuery.ajax({
        url: _this.url + annotationID, // this.prefix+
        type: 'PUT',
        dataType: 'json',
        headers: {
          // 'x-annotator-auth-token': this.token
        },
        data: JSON.stringify(annotation),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          if (typeof returnSuccess === 'function') {
            returnSuccess(data);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to update annotation: ' + oaAnnotation['@id'] + ' due to ' + statusText);
          }
        }
      });
      // this is what updates the viewer
      annotation.endpoint = _this;
    },
    set: function (prop, value, options) {
      if (options) {
        this[options.parent][prop] = value;
      } else {
        this[prop] = value;
      }
    },
    userAuthorize: (arguleams) => { return true; }
  };
}(Mirador));
