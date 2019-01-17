(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Backbone.Marionette.Renderer.render = function(template, data) {
    return _.template($(template).html(), data, {
      variable: 'data'
    });
  };

  (function() {
    var tbs;
    tbs = window.tbs = window.tbs || {};
    tbs.FittingRoomView = (function(_super) {
      __extends(FittingRoomView, _super);

      function FittingRoomView() {
        return FittingRoomView.__super__.constructor.apply(this, arguments);
      }

      FittingRoomView.prototype.className = 'secton--full';

      FittingRoomView.prototype.pageName = '';

      return FittingRoomView;

    })(Marionette.ItemView);
    tbs.FittingRoomLayoutView = (function(_super) {
      __extends(FittingRoomLayoutView, _super);

      function FittingRoomLayoutView() {
        return FittingRoomLayoutView.__super__.constructor.apply(this, arguments);
      }

      FittingRoomLayoutView.prototype.className = 'secton--full';

      FittingRoomLayoutView.prototype.pageName = '';

      FittingRoomLayoutView.prototype.setView = function(region, view) {
        if (!region.$el.length) {
          return region.show(view);
        } else {
          return region.transitionToView(view);
        }
      };

      return FittingRoomLayoutView;

    })(Marionette.LayoutView);
    tbs.Modal = (function(_super) {
      __extends(Modal, _super);

      function Modal() {
        return Modal.__super__.constructor.apply(this, arguments);
      }

      Modal.prototype.template = '#modal-template';

      Modal.prototype.className = 'modal';

      Modal.prototype.ui = {
        close: '.modal--close'
      };

      Modal.prototype.events = {
        'click @ui.close': 'closeClicked'
      };

      Modal.prototype.closeClicked = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.dismissModal();
      };

      return Modal;

    })(Marionette.ItemView);
    tbs.TopNavView = (function(_super) {
      __extends(TopNavView, _super);

      function TopNavView() {
        return TopNavView.__super__.constructor.apply(this, arguments);
      }

      TopNavView.prototype.template = '#topnav-template';

      TopNavView.prototype.tagName = 'nav';

      TopNavView.prototype.className = 'top-nav';

      TopNavView.prototype.model = new Backbone.Model({
        products: []
      });

      TopNavView.prototype.ui = {
        close: '.nav--close',
        prev: '.nav--prev',
        cart: '.nav--cart',
        cartCount: '#cart-count'
      };

      TopNavView.prototype.events = {
        'click @ui.cart': 'showCart',
        'click @ui.prev': 'goBack'
      };

      TopNavView.prototype.initialize = function() {
        TopNavView.__super__.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change', this.render);
        return tbs.FittingRoom.on('route:changed', this.render);
      };

      TopNavView.prototype.goBack = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.trigger("" + ($(e.currentTarget).attr('href').split('#').join('')) + ":show");
      };

      TopNavView.prototype.showCart = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.trigger('cart:show');
      };

      TopNavView.prototype.addToCart = function(model) {
        var products;
        products = this.model.get('products');
        this.model.set('products', products.concat([model]));
        this.model.trigger('change');
        $(this.ui.cartCount).one("animationend webkitAnimationEnd", (function(_this) {
          return function() {
            return $(_this.ui.cartCount).removeClass('an-cart-plus');
          };
        })(this));
        return $(this.ui.cartCount).addClass('an-cart-plus');
      };

      TopNavView.prototype.removeFromCart = function(index) {
        var products;
        products = this.model.get('products');
        products.splice(index, 1);
        this.model.set('products', products);
        return this.model.trigger('change');
      };

      TopNavView.prototype.getCartProducts = function() {
        return this.model.get('products');
      };

      return TopNavView;

    })(Marionette.ItemView);
    tbs.ScreenSaverView = (function(_super) {
      __extends(ScreenSaverView, _super);

      function ScreenSaverView() {
        this.changeImage = __bind(this.changeImage, this);
        return ScreenSaverView.__super__.constructor.apply(this, arguments);
      }

      ScreenSaverView.prototype.template = '#screensaver-template';

      ScreenSaverView.prototype.pageName = 'screensaver';

      ScreenSaverView.prototype.className = 'secton--full screensaver';

      ScreenSaverView.prototype.ui = {
        images: '.img'
      };

      ScreenSaverView.prototype.initialize = function() {
        ScreenSaverView.__super__.initialize.apply(this, arguments);
        this.interval = setInterval(this.changeImage, tbs.ScreenSaverInterval);
        this.listenTo(tbs.FittingRoom.rfid, 'products:loaded', this.checkRFID);
        return this.checkRFID();
      };

      ScreenSaverView.prototype.render = function() {
        ScreenSaverView.__super__.render.apply(this, arguments);
        if (!this.ui.images.filter('.active').length) {
          return this.ui.images.eq(0).addClass('active');
        }
      };

      ScreenSaverView.prototype.checkRFID = function() {
        var _ref;
        if ((_ref = tbs.FittingRoom.products) != null ? _ref.length : void 0) {
          return tbs.FittingRoom.trigger('home:show');
        }
      };

      ScreenSaverView.prototype.nextImageIndex = function(index) {
        index++;
        if (index >= this.ui.images.length) {
          return 0;
        } else {
          return index;
        }
      };

      ScreenSaverView.prototype.changeImage = function() {
        var index;
        index = this.ui.images.filter('.active').removeClass('active').index();
        return this.ui.images.eq(this.nextImageIndex(index)).addClass('active');
      };

      ScreenSaverView.prototype.destroy = function() {
        clearInterval(this.interval);
        return ScreenSaverView.__super__.destroy.apply(this, arguments);
      };

      return ScreenSaverView;

    })(tbs.FittingRoomView);
    tbs.HomeView = (function(_super) {
      __extends(HomeView, _super);

      function HomeView() {
        this.checkRFID = __bind(this.checkRFID, this);
        this.onGoToScreensaver = __bind(this.onGoToScreensaver, this);
        return HomeView.__super__.constructor.apply(this, arguments);
      }

      HomeView.prototype.template = '#fitting-room-template';

      HomeView.prototype.pageName = 'fitting';

      HomeView.prototype.regions = {
        productsRegion: '.list--products'
      };

      HomeView.prototype.initialize = function() {
        HomeView.__super__.initialize.apply(this, arguments);
        this.listenTo(tbs.FittingRoom.rfid, 'change', this.checkRFID);
        this.listenTo(tbs.FittingRoom.products, 'remove', this.onCollectionRemove);
        return this.checkRFID();
      };

      HomeView.prototype.timer = null;

      HomeView.prototype.onGoToScreensaver = function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        return this.timer = setTimeout((function(_this) {
          return function() {
            $('.item--product').remove();
            tbs.FittingRoom.rfid.clear();
            return tbs.FittingRoom.trigger('screensaver:show', {
              delayPing: 5000,
              callback: _this.onAfterGoToScreensaver
            });
          };
        })(this), 1000);
      };

      HomeView.prototype.onAfterGoToScreensaver = function() {
        return tbs.FittingRoom.rfid.clear();
      };

      HomeView.prototype.onCollectionRemove = function() {
        var _ref;
        if (!((_ref = tbs.FittingRoom.products) != null ? _ref.length : void 0)) {
          tbs.FittingRoom.rfid.stopPinging();
          return this.onGoToScreensaver();
        }
      };

      HomeView.prototype.render = function() {
        HomeView.__super__.render.apply(this, arguments);
        return this.productsRegion.show(new tbs.ProductCollectionView({
          collection: tbs.FittingRoom.products
        }));
      };

      HomeView.prototype.checkRFID = function() {
        var _ref;
        if ((_ref = tbs.FittingRoom.products) != null ? _ref.length : void 0) {
          clearTimeout(this.timer);
          return $('.app--content').removeClass('empty');
        } else {
          $('.app--content').addClass('empty');
          return this.onGoToScreensaver();
        }
      };

      return HomeView;

    })(tbs.FittingRoomLayoutView);
    tbs.ProductItemView = (function(_super) {
      __extends(ProductItemView, _super);

      function ProductItemView() {
        return ProductItemView.__super__.constructor.apply(this, arguments);
      }

      ProductItemView.prototype.template = '#product-template';

      ProductItemView.prototype.className = 'item--product an-fadeInToTop';

      ProductItemView.prototype.ui = {
        request: '.button--request',
        add: '.button--add',
        remove: '.button--remove-alt'
      };

      ProductItemView.prototype.events = {
        'click @ui.request': 'requestProduct',
        'click @ui.add': 'addProduct',
        'click @ui.remove': 'removeProduct'
      };

      ProductItemView.prototype.buttonsIndex = 0;

      ProductItemView.prototype.render = function() {
        this.$el.attr('data-id', this.model.get('Id')).attr('data-rfid', this.model.get('RFID'));
        return ProductItemView.__super__.render.apply(this, arguments);
      };

      ProductItemView.prototype.requestProduct = function(e) {
        var productModal;
        e.preventDefault();
        return productModal = new tbs.ProductModal({
          model: this.model,
          related: new tbs.XOMNICatalogSearch(),
          success: function() {
            return tbs.FittingRoom.showModal(productModal);
          }
        });
      };

      ProductItemView.prototype.removeProduct = function(e) {
        e.preventDefault();
        this.$el.bind('oanimationend animationend webkitAnimationEnd', (function(_this) {
          return function() {
            return _this.remove();
          };
        })(this));
        return this.model.collection.remove(this.model);
      };

      ProductItemView.prototype.addProduct = function(e) {
        var $el;
        $el = $(e.target);
        e.preventDefault();
        return this.animateAddToCart($el);
      };

      ProductItemView.prototype.animateAddToCart = function($target) {
        var $app, $cart, $cloneBtn, $el, animationEvent, animationTime, cartPosition, distanceFromTop, indexKeyframe, initialDistance, targetDistance, targetPosition;
        animationEvent = "animationend webkitAnimationEnd";
        $app = $('.app--window');
        $cart = $('#cart-count');
        cartPosition = $cart.offset();
        targetPosition = $target.offset();
        $el = $('<div class="button--wrapper"></div>');
        $cloneBtn = $target.clone();
        distanceFromTop = targetPosition.top - cartPosition.top + $target.outerHeight();
        indexKeyframe = 'buttonToCart' + this.buttonsIndex;
        animationTime = 1000;
        initialDistance = distanceFromTop - 100;
        targetDistance = distanceFromTop - $target.outerHeight() / 2 - 20;
        $el.css({
          'width': $target.outerWidth(),
          'top': cartPosition.top,
          'left': targetPosition.left - $app.offset().left,
          'height': distanceFromTop,
          'zIndex': '9000',
          'position': 'absolute',
          'pointer-events': 'none'
        });
        $el.append($cloneBtn);
        $app.append($el);
        $target.hide();
        $.keyframe.define([
          {
            name: indexKeyframe,
            '0%': {
              'transform': 'translate(0, 0) scale(1)',
              'border-radius': '0',
              'width': '274px',
              'height': '80px'
            },
            '40%': {
              'transform': 'translate(100px, 0)  scale(1)',
              'border-radius': '100%',
              'width': '80px',
              'height': '80px'
            },
            '60%': {
              'transform': 'translate(100px, 0)  scale(1)',
              'border-radius': '100%',
              'width': '80px',
              'height': '80px'
            },
            '90%': {
              'transform': "translate(200px,  -" + initialDistance + "px) scale(0.7)",
              'border-radius': '100%',
              'width': '80px',
              'height': '80px',
              'opacity': '1'
            },
            '100%': {
              'transform': "translate(220px,  -" + targetDistance + "px) scale(0.4)",
              'border-radius': '100%',
              'width': '80px',
              'height': '80px',
              'opacity': '0'
            }
          }
        ]);
        $cloneBtn.playKeyframe(indexKeyframe + ' ' + animationTime + 'ms cubic-bezier(0.645, 0.045, 0.355, 1.000) 0 1 normal forwards');
        setTimeout((function(_this) {
          return function() {
            tbs.FittingRoom.nav.addToCart(_this.model);
            $el.remove();
            return $target.fadeIn();
          };
        })(this), animationTime);
        return this.buttonsIndex++;
      };

      return ProductItemView;

    })(Marionette.ItemView);
    tbs.ProductCollectionView = (function(_super) {
      __extends(ProductCollectionView, _super);

      function ProductCollectionView() {
        return ProductCollectionView.__super__.constructor.apply(this, arguments);
      }

      ProductCollectionView.prototype.childView = tbs.ProductItemView;

      ProductCollectionView.prototype.anInClass = 'an-fadeInToTop';

      ProductCollectionView.prototype.anOutClass = 'an-removeItem';

      ProductCollectionView.prototype.addStaggerIndex = 1;

      ProductCollectionView.prototype.events = {
        'render': 'onRender'
      };

      ProductCollectionView.prototype.initialize = function() {
        return ProductCollectionView.__super__.initialize.apply(this, arguments);
      };

      ProductCollectionView.prototype.onRender = function() {
        this.unbind('render');
        this.listenTo(this.collection, 'add', this.onAdd);
        return this.listenTo(this.collection, 'remove', this.onRemove);
      };

      ProductCollectionView.prototype.onAdd = function(model) {
        var $el, multiplier, time, view;
        view = new this.childView({
          model: model
        });
        $el = view.render().$el;
        multiplier = 0.15;
        if (this.addDelayTimer) {
          clearTimeout(this.addDelayTimer);
        }
        time = this.addStaggerIndex * multiplier;
        $el.attr('style', "-webkit-animation-delay: " + time + "s;");
        this.$el.append($el);
        this.addStaggerIndex++;
        return this.addDelayTimer = setTimeout(function() {
          return this.addStaggerIndex = 1;
        }, 1000);
      };

      ProductCollectionView.prototype.onRemove = function(models, collection, options) {
        var doRemove;
        doRemove = (function(_this) {
          return function(model) {
            return _this.$("[data-rfid='" + (model != null ? model.get('RFID') : void 0) + "']").removeClass(_this.anInClass).addClass(_this.anOutClass);
          };
        })(this);
        if (models != null ? models.length : void 0) {
          return _.each(models, doRemove);
        } else {
          return doRemove(models);
        }
      };

      return ProductCollectionView;

    })(Marionette.CollectionView);
    tbs.ProductModal = (function(_super) {
      __extends(ProductModal, _super);

      function ProductModal() {
        return ProductModal.__super__.constructor.apply(this, arguments);
      }

      ProductModal.prototype.template = '#product-modal-template';

      ProductModal.prototype.className = 'modal modal--fitting';

      ProductModal.prototype.ui = {
        request: '.modal--action',
        close: '.modal--close',
        listItem: '.item--color, .item--size',
        relatedItems: '.list--colors .item--color.big',
        sizeItems: '.item--size.big'
      };

      ProductModal.prototype.events = {
        'click @ui.request': 'requestProduct',
        'click @ui.close': 'closeClicked',
        'click @ui.relatedItems': 'setSelectedRelatedItem',
        'click @ui.sizeItems': 'setSizeSelection'
      };

      ProductModal.prototype.initialize = function(attributes) {
        var _ref;
        ProductModal.__super__.initialize.apply(this, arguments);
        this.related = attributes.related;
        this.listenTo(this.model, 'change', this.render);
        return (_ref = this.related) != null ? _ref.fetch({
          data: {
            DefaultItemId: this.model.get('DefaultItemId' || this.model.get('Id'))
          },
          success: (function(_this) {
            return function() {
              _this.onRelatedLoaded();
              if (attributes.success) {
                return attributes.success();
              }
            };
          })(this)
        }) : void 0;
      };

      ProductModal.prototype.onRelatedLoaded = function() {
        this.related.each((function(_this) {
          return function(model, index) {
            if (model.get('Id') === _this.model.get('Id')) {
              return _this.model.set('activeIndex', index);
            }
          };
        })(this));
        return this.model.set('related', this.related.toJSON());
      };

      ProductModal.prototype.setSelectedRelatedItem = function(e) {
        var $el, relatedItemModel;
        e.preventDefault();
        $el = $(e.currentTarget);
        relatedItemModel = this.related.findWhere({
          Id: $el.data('id')
        });
        relatedItemModel.set('activeIndex', $(e.currentTarget).index());
        relatedItemModel.set('activeSizeIndex', this.model.get('activeSizeIndex'));
        this.model = relatedItemModel;
        this.onRelatedLoaded();
        return this.render();
      };

      ProductModal.prototype.setSizeSelection = function(e) {
        e.preventDefault();
        this.model.set('activeSizeIndex', $(e.currentTarget).index());
        return this.render();
      };

      ProductModal.prototype.requestProduct = function(e) {
        tbs.AssociateClientHubAPI.NotifyAssociate(this.model.attributes);
        e.preventDefault();
        return tbs.FittingRoom.showModal(new tbs.ProductRequestModal({
          model: this.model
        }));
      };

      ProductModal.prototype.closeClicked = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.dismissModal();
      };

      return ProductModal;

    })(tbs.Modal);
    tbs.ProductRequestModal = (function(_super) {
      __extends(ProductRequestModal, _super);

      function ProductRequestModal() {
        return ProductRequestModal.__super__.constructor.apply(this, arguments);
      }

      ProductRequestModal.prototype.template = '#request-modal-template';

      ProductRequestModal.prototype.className = 'modal modal--sendrequest';

      ProductRequestModal.prototype.ui = {
        close: '.modal--close',
        cancel: '.modal--action.button--alt'
      };

      ProductRequestModal.prototype.events = {
        'click @ui.close': 'closeClicked',
        'click @ui.cancel': 'closeClicked'
      };

      ProductRequestModal.prototype.initialize = function() {
        var related, relatedItemResults;
        ProductRequestModal.__super__.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change', this.render);
        related = new tbs.XOMNICatalogSearch();
        relatedItemResults = new tbs.XOMNIRelatedItemsSearch();
        return relatedItemResults.fetch({
          data: {
            itemId: this.model.get('Id')
          },
          success: (function(_this) {
            return function() {
              return related.fetch({
                data: {
                  ItemIds: relatedItemResults.get('Data'),
                  Take: 3
                },
                success: function() {
                  return _this.model.set('related', related.toJSON());
                }
              });
            };
          })(this)
        });
      };

      return ProductRequestModal;

    })(tbs.Modal);
    tbs.CartView = (function(_super) {
      __extends(CartView, _super);

      function CartView() {
        this.getTotal = __bind(this.getTotal, this);
        this.getTax = __bind(this.getTax, this);
        this.getSubtotal = __bind(this.getSubtotal, this);
        this.getItemCount = __bind(this.getItemCount, this);
        return CartView.__super__.constructor.apply(this, arguments);
      }

      CartView.prototype.template = '#cart-template';

      CartView.prototype.pageName = 'cart';

      CartView.prototype.anOutClass = 'an-removeItem';

      CartView.prototype.ui = {
        pay: '.button--pay',
        remove: '.button--remove'
      };

      CartView.prototype.events = {
        'click @ui.pay': 'pay',
        'click @ui.remove': 'removeFromCart'
      };

      CartView.prototype.templateHelpers = function() {
        return {
          getSubtotal: this.getSubtotal,
          getTax: this.getTax,
          getTotal: this.getTotal,
          getItemCount: this.getItemCount
        };
      };

      CartView.prototype.initialize = function() {
        CartView.__super__.initialize.apply(this, arguments);
        this.model = new Backbone.Model({
          products: this.getProducts()
        });
        return this.listenTo(tbs.FittingRoom.nav.model, 'change', (function(_this) {
          return function() {
            return _this.model.set('products', _this.getProducts());
          };
        })(this));
      };

      CartView.prototype.getProducts = function() {
        return _.map(tbs.FittingRoom.nav.getCartProducts(), function(model) {
          return model.attributes;
        });
      };

      CartView.prototype.removeFromCart = function(e) {
        var $el;
        e.preventDefault();
        return $el = $(e.target).parents('.item--product.product--cart').one('animationend webkitAnimationEnd', (function(_this) {
          return function() {
            tbs.FittingRoom.nav.removeFromCart($el.index());
            return _this.render();
          };
        })(this)).addClass(this.anOutClass);
      };

      CartView.prototype.getItemCount = function() {
        return !!this.model.get('products').length;
      };

      CartView.prototype.getSubtotal = function() {
        var pluckedNormalPrice, pluckedPrices, price;
        price = 0;
        if (this.getItemCount()) {
          pluckedPrices = _.pluck(this.model.get('products'), 'Prices');
          pluckedNormalPrice = _.pluck(_.flatten(pluckedPrices), 'NormalPrice');
          if (pluckedNormalPrice && pluckedNormalPrice.length > 0) {
            price = _.reduce(pluckedNormalPrice, function(memo, num) {
              return memo + num;
            });
          }
        }
        if (price !== parseInt(price)) {
          return price.toFixed(2);
        } else {
          return price;
        }
      };

      CartView.prototype.getTax = function() {
        var tax;
        tax = this.getSubtotal() * 0.045;
        if (tax !== parseInt(tax)) {
          return tax.toFixed(2);
        } else {
          return tax;
        }
      };

      CartView.prototype.getTotal = function() {
        var total;
        total = parseFloat(this.getSubtotal()) + parseFloat(this.getTax());
        if (total !== parseInt(total)) {
          return total.toFixed(2);
        } else {
          return total;
        }
      };

      CartView.prototype.pay = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.trigger('payment:show');
      };

      return CartView;

    })(tbs.FittingRoomView);
    tbs.PaymentTabsView = (function(_super) {
      __extends(PaymentTabsView, _super);

      function PaymentTabsView() {
        return PaymentTabsView.__super__.constructor.apply(this, arguments);
      }

      PaymentTabsView.prototype.template = '#payment-tabs-template';

      PaymentTabsView.prototype.ui = {
        swipe: '.process--swipe',
        sign: '.process--sign'
      };

      PaymentTabsView.prototype.events = {
        'click @ui.swipe': 'showSwipe',
        'click @ui.sign': 'showSign'
      };

      PaymentTabsView.prototype.initialize = function() {
        PaymentTabsView.__super__.initialize.apply(this, arguments);
        tbs.FittingRoom.on('payment:swipe:show', this.render);
        return tbs.FittingRoom.on('payment:sign:show', this.render);
      };

      PaymentTabsView.prototype.render = function() {
        PaymentTabsView.__super__.render.apply(this, arguments);
        if (tbs.FittingRoom.getCurrentRoute() === 'payment/sign') {
          return this.ui.sign.addClass('active');
        } else {
          return this.ui.swipe.addClass('active');
        }
      };

      PaymentTabsView.prototype.showSwipe = function() {
        return tbs.FittingRoom.trigger('payment:swipe:show');
      };

      PaymentTabsView.prototype.showSign = function() {
        return tbs.FittingRoom.trigger('payment:sign:show');
      };

      PaymentTabsView.prototype.onBeforeDestroy = function() {
        tbs.FittingRoom.off('payment:swipe:show', this.render);
        return tbs.FittingRoom.off('payment:sign:show', this.render);
      };

      return PaymentTabsView;

    })(Marionette.ItemView);
    tbs.PaymentSwipeView = (function(_super) {
      __extends(PaymentSwipeView, _super);

      function PaymentSwipeView() {
        return PaymentSwipeView.__super__.constructor.apply(this, arguments);
      }

      PaymentSwipeView.prototype.template = '#payment-swipe-template';

      PaymentSwipeView.prototype.ui = {
        confirm: '.button.button--full'
      };

      PaymentSwipeView.prototype.events = {
        'click @ui.confirm': 'confirm'
      };

      PaymentSwipeView.prototype.confirm = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.trigger('payment:sign:show');
      };

      return PaymentSwipeView;

    })(Marionette.ItemView);
    tbs.PaymentSignView = (function(_super) {
      __extends(PaymentSignView, _super);

      function PaymentSignView() {
        return PaymentSignView.__super__.constructor.apply(this, arguments);
      }

      PaymentSignView.prototype.template = '#payment-sign-template';

      PaymentSignView.prototype.ui = {
        confirm: '.button.button--full',
        canvas: '#signature-area'
      };

      PaymentSignView.prototype.events = {
        'click @ui.confirm': 'confirm'
      };

      PaymentSignView.prototype.render = function() {
        PaymentSignView.__super__.render.apply(this, arguments);
        return $(this.ui.canvas).sketch();
      };

      PaymentSignView.prototype.confirm = function(e) {
        e.preventDefault();
        return tbs.FittingRoom.showModal(new tbs.PaymentConfirmModal());
      };

      return PaymentSignView;

    })(Marionette.ItemView);
    tbs.PaymentView = (function(_super) {
      __extends(PaymentView, _super);

      function PaymentView() {
        this.showSign = __bind(this.showSign, this);
        this.showSwipe = __bind(this.showSwipe, this);
        return PaymentView.__super__.constructor.apply(this, arguments);
      }

      PaymentView.prototype.template = '#payment-template';

      PaymentView.prototype.pageName = 'payment';

      PaymentView.prototype.initialize = function() {
        PaymentView.__super__.initialize.apply(this, arguments);
        this.addRegions({
          tabsRegion: '#payment-tabs-region',
          contentRegion: {
            selector: '#payment-content-region',
            regionClass: TransitionRegion
          }
        });
        tbs.FittingRoom.on('payment:swipe:show', this.showSwipe);
        return tbs.FittingRoom.on('payment:sign:show', this.showSign);
      };

      PaymentView.prototype.render = function() {
        PaymentView.__super__.render.apply(this, arguments);
        this.tabsRegion.show(new tbs.PaymentTabsView());
        if (tbs.FittingRoom.getCurrentRoute() === 'payment/sign') {
          return this.showSign();
        } else {
          return this.showSwipe();
        }
      };

      PaymentView.prototype.showSwipe = function() {
        var _ref;
        if (!((_ref = this.$el) != null ? _ref.children.length : void 0)) {
          this.render();
        }
        return this.setView(this.contentRegion, new tbs.PaymentSwipeView());
      };

      PaymentView.prototype.showSign = function() {
        var _ref;
        if (!((_ref = this.$el) != null ? _ref.children.length : void 0)) {
          this.render();
        }
        return this.setView(this.contentRegion, new tbs.PaymentSignView());
      };

      PaymentView.prototype.onBeforeDestroy = function() {
        tbs.FittingRoom.off('payment:swipe:show', this.showSwipe);
        return tbs.FittingRoom.off('payment:sign:show', this.showSign);
      };

      return PaymentView;

    })(tbs.FittingRoomLayoutView);
    return tbs.PaymentConfirmModal = (function(_super) {
      __extends(PaymentConfirmModal, _super);

      function PaymentConfirmModal() {
        return PaymentConfirmModal.__super__.constructor.apply(this, arguments);
      }

      PaymentConfirmModal.prototype.template = '#payment-confirm-modal-template';

      PaymentConfirmModal.prototype.className = 'modal modal--payment';

      PaymentConfirmModal.prototype.ui = {
        buttons: 'a'
      };

      PaymentConfirmModal.prototype.events = {
        'click @ui.buttons': 'closeClicked'
      };

      PaymentConfirmModal.prototype.closeClicked = function() {
        PaymentConfirmModal.__super__.closeClicked.apply(this, arguments);
        return tbs.FittingRoom.trigger('home:show');
      };

      return PaymentConfirmModal;

    })(tbs.Modal);
  })();

}).call(this);
