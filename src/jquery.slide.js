/*!
 * jquery.slide v1.0.0
 * A simple jQuery slider.
 * https://github.com/cobish/jquery.slide

 * Copyright (c) 2016, cobish
 * Released under the MIT license.
 */
(function($, window) {
  'use strict';

  var slide = {
    // default options
    defaults: {
      // auto play
  isAutoSlide: true, 

  // auto pause on hover
  isHoverStop: true,

  // auto pause when the current windows loses focus
  isBlurStop: true,

  // shows pagination dots
  isShowDots: true,

  // shows navigation arrows
  isShowArrow: true, 

  // animation speed
  slideSpeed: 1000, 

  // transition delay
  switchSpeed: 500,

  // custom CSS classes
  dotsClass: 'dots',    
  dotActiveClass: 'active', 
  arrowClass: 'arrow', 
  arrowLeftClass: 'arrow-left', 
  arrowRightClass: 'arrow-right',

  // click or mouseover
  dotsEvent: 'click'
    },

    // curr options
    options: null,

    // 当前索引
    curIndex: 0,

    // 定时器
    timer: null,

    // 状态点集合
    dotsList: [],

    // init function
    init: function(elem, options) {
      var $self = $(elem),
          list = $self.find('ul li'),
          self = this;

      this.options = $.extend({}, this.defaults, options);

      // 显示状态点
      if (this.options.isShowDots) {
        this._createDots(elem, list);
      }

      // 显示左右箭头
      if (this.options.isShowArrow) {
        this._createArrow(elem, list);
      }

      // 显示第一个
      this._showBlock(list[this.curIndex]);

      // 自动轮播
      if (this.options.isAutoSlide) {
        this._defaultSlide(list);

        // 鼠标移入移除事件
        if (this.options.isHoverStop) {
          var className = $self.attr('class');
          $self.on('mouseover', function(e) {
            if (self.timer) {
              clearInterval(self.timer);
            }
          }).on('mouseout', function() {
            clearInterval(self.timer);
            self._defaultSlide(list);
          });
        }

        // Window获取失去焦点事件
        if (this.options.isBlurStop) {
          $(window).on('blur', function() {
            clearInterval(self.timer);
          }).on('focus', function() {
            clearInterval(self.timer);
            self._defaultSlide(list);
          });
        }
      }
    },

    // default slide
    _defaultSlide: function(list) {
      var self = this;
      this.timer = setInterval(function() {
        self._hideBlock(list[self.curIndex]);
        self.curIndex =  (self.curIndex + 1) % list.length;
        self._showBlock(list[self.curIndex]);
      }, this.options.slideSpeed);
    },

    // show block
    _showBlock: function(block) {
      var o = this.options,
          $block = $(block),
          bg = $(block).attr('data-bg');

      if (bg) {
        $block.css({
          'background': 'url(' + bg + ')',
          'opacity': '0',
          'z-index': '0',
		  'background-repeat': 'no-repeat',
		  'background-size': 'cover',
		  'background-position': '50% 50%',
        });
        $block.attr('data-bg', '');
      }

      $block.stop().animate({
        'opacity': '1',
        'z-index': '1'
      }, o.switchSpeed);

      if (o.isShowDots) {
        $(this.dotsList[this.curIndex]).addClass(o.dotActiveClass);
      }
    },

    // hide block
    _hideBlock: function(block) {
      var o = this.options;

      $(block).stop().animate({
        'opacity': '0',
        'z-index': '0'
      }, o.switchSpeed);

      if (o.isShowDots) {
        $(this.dotsList[this.curIndex]).removeClass(o.dotActiveClass);
      }
    },

    // create dots
    _createDots: function(elem, list) {
      var self = this,
          dotsEvent = this.options.dotsEvent;

      var dots = $('<ol/>', {
        class: this.options.dotsClass
      });

      var dotsList = [];
      for (var i = 0; i < list.length; i++) {
        dotsList[i] = $('<li/>');
        dots.append(dotsList[i]);
      }

      $(elem).append(dots);
      this.dotsList = dotsList;

      // dots添加事件
      if (dotsEvent === 'click' || dotsEvent === 'mouseover') {
        dots.find('li').on(dotsEvent, function() {
          self._hideBlock(list[self.curIndex]);
          self.curIndex =  $(this).index();
          self._showBlock(list[self.curIndex]);
        });
      }
    },

    // create arrowClass
    _createArrow: function(elem, list) {
      var self = this;

      var arrow = $('<div/>', {
        class: this.options.arrowClass
      });

      var leftArrow = $('<a/>', {
        class: this.options.arrowLeftClass
      });

      var rightArrow = $('<a/>', {
        class: this.options.arrowRightClass
      });

      arrow.append(leftArrow).append(rightArrow);
      $(elem).append(arrow);

      leftArrow.on('click', function() {
        self._hideBlock(list[self.curIndex]);
        self.curIndex = (list.length + (self.curIndex - 1)) % list.length;
        self._showBlock(list[self.curIndex]);
      });

      rightArrow.on('click', function() {
        self._hideBlock(list[self.curIndex]);
        self.curIndex =  (self.curIndex + 1) % list.length;
        self._showBlock(list[self.curIndex]);
      });
    }
  };

  // main function
  $.fn.slide = function(options) {
    slide.init(this, options);
    return this;
  };

})(jQuery, window);
