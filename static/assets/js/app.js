(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var tbs;
    tbs = window.tbs = window.tbs || {};
     tbs.AssociateClientHubUrl = "http://192.168.1.37:537/signalr";
    tbs.HubConnectionEstablished = false;
    tbs.AssociateClientHubAPI = {
      NotifyAssociate: function(selectedItem) {
        return tbs.AssociateClientHub.server.notifyAssociate(selectedItem);
      }
    };
    $.connection.hub.url = tbs.AssociateClientHubUrl;
    tbs.AssociateClientHub = $.connection.associateClientHub;
    $.connection.hub.start().done(function() {
      tbs.HubConnectionEstablished = true;
      return console.log("connected to associate client hub successfully");
    }).fail(function() {
      tbs.HubConnectionEstablished = false;
      return console.log("failed to connect to associate client hub");
    });
    tbs.NavigationAPI = {
      showHome: (function(_this) {
        return function() {
          var _ref;
          if (((_ref = tbs.FittingRoom.mainRegion.currentView) != null ? _ref.pageName : void 0) !== 'fitting') {
            tbs.FittingRoom.mainRegion.transitionToView(new tbs.HomeView());
            return tbs.FittingRoom.rfid.startPinging();
          }
        };
      })(this),
      showScreenSaver: (function(_this) {
        return function(d) {
          var _ref;
          if (((_ref = tbs.FittingRoom.mainRegion.currentView) != null ? _ref.pageName : void 0) !== 'screensaver') {
            tbs.FittingRoom.mainRegion.transitionToView(new tbs.ScreenSaverView());
            if (typeof d === 'object' && typeof d.delayPing === 'number') {
              return setTimeout(function() {
                return tbs.FittingRoom.rfid.startPinging();
              }, d.delayPing);
            } else {
              return tbs.FittingRoom.rfid.startPinging();
            }
          }
        };
      })(this),
      showCart: (function(_this) {
        return function() {
          tbs.FittingRoom.mainRegion.transitionToView(new tbs.CartView());
          return tbs.FittingRoom.rfid.stopPinging();
        };
      })(this),
      showPayment: (function(_this) {
        return function() {
          tbs.FittingRoom.mainRegion.transitionToView(new tbs.PaymentView());
          return tbs.FittingRoom.rfid.stopPinging();
        };
      })(this)
    };
    tbs.FittingRoomAppRouter = (function(_super) {
      __extends(FittingRoomAppRouter, _super);

      function FittingRoomAppRouter() {
        return FittingRoomAppRouter.__super__.constructor.apply(this, arguments);
      }

      FittingRoomAppRouter.prototype.appRoutes = {
        'home': 'showHome',
        'screensaver': 'showScreenSaver',
        'products ': 'showHome',
        'cart': 'showCart',
        'payment': 'showPayment',
        'payment/sign': 'showPayment',
        'payment/swipe': 'showPayment'
      };

      FittingRoomAppRouter.prototype.controller = tbs.NavigationAPI;

      return FittingRoomAppRouter;

    })(Marionette.AppRouter);
    tbs.FittingRoomApplication = (function(_super) {
      __extends(FittingRoomApplication, _super);

      function FittingRoomApplication() {
        this.dismissModal = __bind(this.dismissModal, this);
        this.showModal = __bind(this.showModal, this);
        return FittingRoomApplication.__super__.constructor.apply(this, arguments);
      }

      FittingRoomApplication.prototype.initialize = function() {
        FittingRoomApplication.__super__.initialize.apply(this, arguments);
        this.rfid = new tbs.RFIDPing();
        this.addInitializer((function(_this) {
          return function() {
            return new tbs.FittingRoomAppRouter();
          };
        })(this));
        this.addRegions({
          navRegion: '#nav-region',
          mainRegion: {
            selector: '#main',
            regionClass: TransitionRegion
          },
          modalRegion: {
            selector: '#modal',
            regionClass: TransitionRegion
          }
        });
        this.products = new tbs.ProductsCollection();
        return this.initNavigationEvents();
      };

      FittingRoomApplication.prototype.initNavigationEvents = function() {
        this.on('home:show', (function(_this) {
          return function() {
            _this.navigate('');
            return tbs.NavigationAPI.showHome();
          };
        })(this));
        this.on('screensaver:show', (function(_this) {
          return function(d) {
            return tbs.NavigationAPI.showScreenSaver(d);
          };
        })(this));
        this.on('cart:show', (function(_this) {
          return function() {
            _this.navigate('cart');
            return tbs.NavigationAPI.showCart();
          };
        })(this));
        this.on('payment:show', (function(_this) {
          return function() {
            _this.navigate('payment');
            return tbs.NavigationAPI.showPayment();
          };
        })(this));
        this.on('payment:swipe:show', (function(_this) {
          return function() {
            return _this.navigate('payment/swipe');
          };
        })(this));
        return this.on('payment:sign:show', (function(_this) {
          return function() {
            return _this.navigate('payment/sign');
          };
        })(this));
      };

      FittingRoomApplication.prototype.navigate = function(route, options) {
        if (options == null) {
          options = {};
        }
        Backbone.history.navigate(route, options);
        return this.trigger('route:changed', route);
      };

      FittingRoomApplication.prototype.getCurrentRoute = function() {
        return Backbone.history.fragment;
      };

      FittingRoomApplication.prototype.getPreviousRoute = function() {};

      FittingRoomApplication.prototype.showModal = function(modal) {
        this.modalRegion.$el.show();
        return this.modalRegion.transitionToView(modal);
      };

      FittingRoomApplication.prototype.dismissModal = function() {
        this.modalRegion.on('empty', (function(_this) {
          return function() {
            _this.modalRegion.$el.hide();
            return _this.modalRegion.off('empty');
          };
        })(this));
        return this.modalRegion.transitionToView();
      };

      FittingRoomApplication.prototype.start = function() {
        FittingRoomApplication.__super__.start.apply(this, arguments);
        this.nav = new tbs.TopNavView();
        this.navRegion.show(this.nav);
        if (Backbone.history) {
          Backbone.history.start();
        }
        if (this.getCurrentRoute() != null) {
          this.trigger('route:changed', this.getCurrentRoute());
        }
        this.listenTo(this.rfid, 'products:loaded', (function(_this) {
          return function() {
            var _ref;
            if (!((_ref = tbs.FittingRoom.products) != null ? _ref.length : void 0)) {
              return _this.trigger('screensaver:show');
            } else {
              return _this.trigger('home:show');
            }
          };
        })(this));
        return this.rfid.startPinging();
      };

      return FittingRoomApplication;

    })(Marionette.Application);
    tbs.FittingRoom = new tbs.FittingRoomApplication();
    return tbs.FittingRoom.start();
  })();

}).call(this);
