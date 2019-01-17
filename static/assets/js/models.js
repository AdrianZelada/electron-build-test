(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var tbs;
    tbs = window.tbs = window.tbs || {};
    tbs.setXomniHeaders = function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIm9hdXRoIiwicHVibGljIiwicHVibGljIl0sIlRva2VuSWQiOiIxIiwiUGh5c2ljYWxEZXZpY2VJZCI6IjIiLCJBcGlVc2VybmFtZSI6InNhbXBsZVVzZXIiLCJBcGlQYXNzd29yZCI6IjhVM3lxIiwiaXNzIjoiWE9NTkkiLCJhdWQiOiJodHRwOi8vdGhlYmlnc3BhY2UtMi5hcGkueG9tbmkuY29tIiwiZXhwIjoyMTQ1OTE2ODAwLCJuYmYiOjE0OTMyMTgxNzZ9.RtXwo6HlBqw3RXjaPZD_Usms1_DHRcbhZTolK6NEbwA');
        return xhr.setRequestHeader('Accept', 'application/vnd.xomni.api-v4_0, */*');
        
        //return xhr.setRequestHeader('Host', 'thebigspace.api.xomni.com');
    };
    tbs.RFIDPing = (function(_super) {
      __extends(RFIDPing, _super);

      function RFIDPing() {
        return RFIDPing.__super__.constructor.apply(this, arguments);
      }

      RFIDPing.prototype.url = tbs.RFIDServerUrl;

      RFIDPing.prototype.initialize = function() {
        RFIDPing.__super__.initialize.apply(this, arguments);
        this.on('change', this.rfidChanged);
        this.on('rfidRemoved', this.removeRFID);
        return this.on('sync', this.rfidLoaded);
      };

      RFIDPing.prototype.startTimer = null;

      RFIDPing.prototype.parse = function(response) {
        response.updated = _.union(response.updated, this.attributes.updated || []);
        response.added = _.union(response.added, this.attributes.added || []);
        return response;
      };

      RFIDPing.prototype.ping = function() {
        clearInterval(this.timeout);
        return this.fetch({
          success: (function(_this) {
            return function() {
              if (_this.shouldPing) {
                return _this.timeout = setTimeout(function() {
                  return _this.ping();
                }, tbs.RFIDPingInterval);
              }
            };
          })(this),
          error: (function(_this) {
            return function() {
              return setTimeout(function() { return _this.ping();}, tbs.RFIDPingInterval);
              return console.error("RFID Unavailable");
            };
          })(this)
        });
      };

      RFIDPing.prototype.startPinging = function() {
        if (this.shouldPing && this.timeout) {
          return;
        }
        this.shouldPing = true;
        return this.startTimer = setTimeout((function(_this) {
          return function() {
            return _this.ping();
          };
        })(this), tbs.RFIDStartDelay);
      };

      RFIDPing.prototype.stopPinging = function() {
        this.shouldPing = false;
        if (this.timeout) {
          clearInterval(this.timeout);
        }
        if (this.startTimer) {
          return clearTimeout(this.startTimer);
        }
      };

      RFIDPing.prototype.hasTags = function() {
        var _ref, _ref1;
        return !!(((_ref = this.get('added')) != null ? _ref.length : void 0) || ((_ref1 = this.get('updated')) != null ? _ref1.length : void 0));
      };

      RFIDPing.prototype.rfidLoaded = function() {
        if (!this.previous('added') && !this.previous('updated')) {
          this.trigger('rfid:loaded');
          return this.off('sync', this.rfidLoaded);
        }
      };

      RFIDPing.prototype.rfidChanged = function() {
        if (this.hasTags()) {    

        if(this.get('removed').length > 0){

          if(this.get('added').indexOf(this.get('removed')[0]) >= 0){
            this.get('added').splice(this.get('added').indexOf(this.get('removed')[0], 1));
          }

          if(this.get('updated').indexOf(this.get('removed')[0]) >= 0) {
            this.get('updated').splice(this.get('updated').indexOf(this.get('removed')[0], 1));
          }
        }
         var addedUpdated =  this.get('added').concat(this.get('updated'))
         return this.loadProducts(addedUpdated);
          //return this.loadProducts(this.get('added').concat(this.get('updated')));
        }
      };

      RFIDPing.prototype.removeRFID = function(rfid) {
          console.log('rfid:' + rfid);
          console.log("added rfids before remove:" + this.get('added'));
          console.log("updated rfids before remove:") + this.get('updated');
          
          if(this.get('added').indexOf(rfid) >= 0){
            this.get('added').splice(this.get('added').indexOf(rfid, 1));
          }

          if(this.get('updated').indexOf(rfid) >= 0) {
            this.get('updated').splice(this.get('updated').indexOf(rfid, 1));
          }        

          console.log("added rfids after remove:" + this.get('added'));
          console.log("updated rfids after remove:") + this.get('updated');          
      };


      RFIDPing.prototype.loadProducts = function(rfids) {
        var productModels, search, uniques, uniquesLength;
        productModels = [];
        search = new tbs.XOMNICatalogSearch();
        rfids = _.filter(rfids, (function(_this) {
          return function(rfid) {
            var _ref;
            return !((_ref = tbs.FittingRoom.products) != null ? _ref.findWhere({
              'RFID': rfid
            }) : void 0);
          };
        })(this));
        uniques = _.uniq(rfids);
        uniquesLength = uniques.length;
        return _.each(uniques, (function(_this) {         
          return function(rfid) {
             if(tbs.RFIDConstants.indexOf(rfid) >= 0 && _.filter(tbs.FittingRoom.products.models, function(item){ return item.attributes.RFID == rfid;}).length == 0){
            return search.fetch({
              data: {
                RFID: rfid
              },
              success: function(model, response, options) {
                productModels.push(model.toJSON());
                //if (productModels.length === uniquesLength) {
                  _this.addProducts(_.flatten(productModels));
               //}
                return _this.trigger('products:loaded');
              },
              error: function() {
                return _this.trigger('products:loaded');
              }
            });
          };
        };
        })(this));
      };

      RFIDPing.prototype.addProducts = function(products) {
        if(products != null &&  products.length > 0 && _.filter(tbs.FittingRoom.products.models, function(item){ return item.attributes.RFID == products[0].RFID;}).length == 0)
        {
          this.get('added').splice(this.get('added').indexOf(products[0].RFID),1);
          this.get('updated').splice(this.get('updated').indexOf(products[0].RFID),1);
        var _ref;
        return (_ref = tbs.FittingRoom.products) != null ? _ref.add(products, {
          merge: true
        }) : void 0;
          }
      };

      RFIDPing.prototype.removeProducts = function(rfids) {
        return _.each(rfids, (function(_this) {
          return function(rfid) {
            var _ref, _ref1;
            return (_ref = tbs.FittingRoom.products) != null ? _ref.remove((_ref1 = tbs.FittingRoom.products) != null ? _ref1.findWhere({
              'RFID': rfid
            }) : void 0) : void 0;
          };
        })(this));
      };

      return RFIDPing;

    })(Backbone.Model);
    tbs.Product = (function(_super) {
      __extends(Product, _super);

      function Product() {
        return Product.__super__.constructor.apply(this, arguments);
      }

      Product.prototype.urlRoot = tbs.XOMNIApiRoot + 'catalog/item/';

      Product.prototype.parse = function(response, options) {
        if (response.Data != null) {
          return response.Data.Item;
        } else {
          return response;
        }
      };

      Product.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options.data = {
          //IncludeItemMetadata: true,
          //DocumentAssetDetail: 4,
          IncludeItemStaticProperties: true,
          ImageAssetDetail: 1
        };
        return Product.__super__.fetch.call(this, options);
      };

      Product.prototype.sync = function(method, model, options) {
        options.beforeSend = tbs.setXomniHeaders;
        return Product.__super__.sync.apply(this, arguments);
      };

      return Product;

    })(Backbone.Model);
    tbs.ProductsCollection = (function(_super) {
      __extends(ProductsCollection, _super);

      function ProductsCollection() {
        return ProductsCollection.__super__.constructor.apply(this, arguments);
      }

      ProductsCollection.prototype.idAttribute = 'Id';

      return ProductsCollection;

    })(Backbone.Collection);
    tbs.XOMNIAPICollection = (function(_super) {
      __extends(XOMNIAPICollection, _super);

      function XOMNIAPICollection() {
        return XOMNIAPICollection.__super__.constructor.apply(this, arguments);
      }

      XOMNIAPICollection.prototype.sync = function(method, collection, options) {
        options.beforeSend = tbs.setXomniHeaders;
        return XOMNIAPICollection.__super__.sync.apply(this, arguments);
      };

      return XOMNIAPICollection;

    })(Backbone.Collection);
    tbs.XOMNICatalogSearch = (function(_super) {
      __extends(XOMNICatalogSearch, _super);

      function XOMNICatalogSearch() {
        return XOMNICatalogSearch.__super__.constructor.apply(this, arguments);
      }

      XOMNICatalogSearch.prototype.idAttribute = 'Id';

      XOMNICatalogSearch.prototype.url = "" + tbs.XOMNIApiRoot + "catalog/items?includeItemInStoreMetadata=false";//"/catalog/items?includeItemMetadata=true";

      XOMNICatalogSearch.prototype.model = tbs.Product;

      XOMNICatalogSearch.prototype.fetched = false;

      XOMNICatalogSearch.prototype.initialize = function() {
        XOMNICatalogSearch.__super__.initialize.apply(this, arguments);
        this.listenTo(this, 'sync', (function(_this) {
          return function() {
            return _this.fetched = true;
          };
        })(this));
        return this.listenTo(this, 'reset', (function(_this) {
          return function() {
            return _this.fetched = false;
          };
        })(this));
      };

      XOMNICatalogSearch.prototype.parse = function(response, options) {
        return response.Data.SearchResult.Items;
      };

      XOMNICatalogSearch.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options.type = 'POST';
        options.data = _.extend({
          Skip: 0,
          Take: 3,
          IncludeItemStaticProperties: true,
          ImageAssetDetail: 4,
          DocumentAssetDetail: 4
        }, options.data);
        return XOMNICatalogSearch.__super__.fetch.call(this, options);
      };

      return XOMNICatalogSearch;

    })(tbs.XOMNIAPICollection);
    return tbs.XOMNIRelatedItemsSearch = (function(_super) {
      __extends(XOMNIRelatedItemsSearch, _super);

      function XOMNIRelatedItemsSearch() {
        return XOMNIRelatedItemsSearch.__super__.constructor.apply(this, arguments);
      }

      XOMNIRelatedItemsSearch.prototype.idAttribute = 'Id';

      XOMNIRelatedItemsSearch.prototype.url = "" + tbs.XOMNIApiRoot + "catalog/relatedItems";

      return XOMNIRelatedItemsSearch;

    })(tbs.XOMNIAPICollection);
  })();

}).call(this);
