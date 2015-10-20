angular.module("angular-resize", []);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module("angular-resize").factory("resizable", [
  "$timeout", function($timeout) {
    var Resizable;
    return Resizable = (function() {
      var getEl, modelIndex, stopPropagation;

      function Resizable(elem, model, max, key, threshold) {
        this.elem = elem;
        this.model = model;
        this.max = max;
        this.key = key != null ? key : "span";
        this.threshold = threshold != null ? threshold : 30;
        this.resize = bind(this.resize, this);
        this.stopResize = bind(this.stopResize, this);
        this.startResize = bind(this.startResize, this);
        this.unit = this.elem.outerWidth() / this.max;
        this.setup();
        this.regen();
      }

      Resizable.prototype.setup = function() {
        return this.elem.on("mousedown.angular-resize", ".Resizable", this.handle(this.startResize));
      };

      Resizable.prototype.destroy = function() {
        this.elem.off("mousedown.angular-resize", ".Resizable");
        this.elem.off("mousemove.angular-resize", ".Resizable");
        $("body").off("mousemove.angular-resize");
        return $("body").off("mouseup.angular-resize");
      };

      getEl = function(e) {
        return angular.element(e.target);
      };

      stopPropagation = function(e) {
        e = e.originalEvent != null ? e.originalEvent : e;
        if (e.stopPropagation != null) {
          e.stopPropagation();
        }
        return e;
      };

      Resizable.prototype.handle = function(next) {
        return (function(_this) {
          return function(e) {
            return next(stopPropagation(e));
          };
        })(this);
      };

      Resizable.prototype.merge = function(col1, col2) {
        return true;
      };

      modelIndex = function(el) {
        return el.index() / 2;
      };

      Resizable.prototype.savePositions = function(e) {
        var l, r;
        this.origin = e.pageX;
        l = this.resizer.elem.prev();
        this.left = {
          elem: l,
          index: modelIndex(l),
          width: l.width()
        };
        r = this.resizer.elem.next();
        this.right = {
          elem: r,
          index: modelIndex(r),
          width: r.width()
        };
        return this.resizer.margin = parseInt(this.resizer.elem.css("margin-left"));
      };

      Resizable.prototype.startResize = function(e) {
        var el;
        el = getEl(e).closest(".Resizable");
        this.resizer = {
          elem: el
        };
        this.savePositions(e);
        $("body").on("mousemove.angular-resize", this.handle(this.resize));
        return $("body").on("mouseup.angular-resize", this.handle(this.stopResize));
      };

      Resizable.prototype.stopResize = function(e) {
        this.reset();
        $("body").css("selector", "default");
        $("body").off("mousemove.angular-resize");
        return $("body").off("mouseup.angular-resize");
      };

      Resizable.prototype.resize = function(e) {
        var diff, ref, size;
        if (this.switching) {
          return;
        }
        diff = e.pageX - this.origin;
        switch (false) {
          case !(diff <= 0 && this.model[this.left.index][this.key] === 1):
            return;
          case !(diff >= 0 && this.model[this.right.index][this.key] === 1):
            return;
        }
        if ((-this.threshold < diff && diff < this.threshold)) {
          this.reset();
          return;
        }
        if ((-this.threshold < (ref = diff % this.unit) && ref < this.threshold)) {
          size = Math.round(diff / this.unit);
          this.model[this.left.index][this.key] += size;
          this.model[this.right.index][this.key] -= size;
          this.update();
          this.savePositions(e);
          this.switching = false;
          return;
        }
        this.left.elem.width(this.left.width + diff);
        this.right.elem.width(this.right.width - diff);
        return this.resizer.elem.css({
          "margin-left": this.resizer.margin + diff
        });
      };

      Resizable.prototype.reset = function() {
        if (this.left.elem.width() !== this.left.width || this.right.elem.width() !== this.right.width || parseInt(this.resizer.elem.css("margin-left")) !== this.resizer.margin) {
          this.left.elem.width(this.left.width);
          this.right.elem.width(this.right.width);
          return this.resizer.elem.css({
            "margin-left": this.resizer.margin
          });
        }
      };

      Resizable.prototype.update = function() {};

      Resizable.prototype.remove = function() {
        this.elem.remove(".Resizable");
        return console.log(this.elem.find(".Resizable"));
      };

      Resizable.prototype.regen = function() {
        var childs, height, i, j, left, ref, results, rez, right, width;
        this.remove();
        this.elem.css({
          position: 'relative'
        });
        childs = this.elem.children();
        results = [];
        for (i = j = 0, ref = childs.length - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          rez = $('<div class="Resizable" draggable="false"><div class="Handle" draggable="false"></div></div>');
          left = $(childs[i]);
          right = $(childs[i + 1]);
          height = left.height() > right.height() ? left.height() : right.height();
          rez.height(height);
          width = right.offset().left - (left.offset().left + left.width());
          rez.width(width);
          rez.insertAfter(left);
          rez.css({
            top: 0,
            'margin-left': right.position().left - width / 2
          });
          console.log({
            top: 0,
            left: right.position().left - width
          });
          results.push(console.log("height: " + height + ", width: " + width));
        }
        return results;
      };

      return Resizable;

    })();
  }
]);
