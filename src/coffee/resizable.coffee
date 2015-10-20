angular.module("angular-resize").factory("resizable", [
  "$timeout"
  (
    $timeout
  )->

    class Resizable

      constructor: (@elem, @model, @max, @key = "span", @threshold = 30) ->
        @unit = @elem.outerWidth() / @max
        @setup()
        @regen()

      setup: ->
        @elem.on("mousedown.angular-resize", ".Resizable", @handle(@startResize))

      destroy: ->
        @elem.off("mousedown.angular-resize", ".Resizable")
        @elem.off("mousemove.angular-resize", ".Resizable")
        $("body").off("mousemove.angular-resize")
        $("body").off("mouseup.angular-resize")

      getEl = (e) -> angular.element(e.target)

      stopPropagation = (e) ->
        e = if e.originalEvent? then e.originalEvent else e
        if e.stopPropagation? then e.stopPropagation()
        e

      handle: (next) ->
        (e) => next(stopPropagation(e))

      merge: (col1, col2) -> true

      modelIndex = (el) -> el.index() / 2

      savePositions: (e) ->
        @origin = e.pageX
        l = @resizer.elem.prev()
        @left =
          elem: l
          index: modelIndex(l)
          width: l.width()
        r = @resizer.elem.next()
        @right =
          elem: r
          index: modelIndex(r)
          width: r.width()
        @resizer.margin = parseInt(@resizer.elem.css("margin-left"))

      startResize: (e) =>
        el = getEl(e).closest(".Resizable")
        @resizer = {elem: el}
        @savePositions(e)
        $("body").on("mousemove.angular-resize", @handle(@resize))
        $("body").on("mouseup.angular-resize", @handle(@stopResize))

      stopResize: (e) =>
        @reset()
        $("body").css("selector", "default")
        $("body").off("mousemove.angular-resize")
        $("body").off("mouseup.angular-resize")

      resize: (e) =>
        if @switching then return
        diff = e.pageX - @origin
        switch
          when diff <= 0 and @model[@left.index][@key] == 1 then return
          when diff >= 0 and @model[@right.index][@key] == 1 then return
        #console.log {"left", @left, "right": @right}

        if -@threshold < diff < @threshold
          @reset()
          return
        if -@threshold < diff % @unit < @threshold
          size = Math.round(diff / @unit)
          @model[@left.index][@key] += size
          @model[@right.index][@key] -= size
          @update()
          @savePositions(e)
          @switching = false
          return

        @left.elem.width(@left.width + diff)
        @right.elem.width(@right.width - diff)
        @resizer.elem.css({"margin-left": @resizer.margin + diff})

      reset: ->
        if @left.elem.width() != @left.width or
        @right.elem.width() != @right.width or
        parseInt(@resizer.elem.css("margin-left")) != @resizer.margin
          @left.elem.width(@left.width)
          @right.elem.width(@right.width)
          @resizer.elem.css({"margin-left": @resizer.margin})

      update: ->

      remove: ->
        @elem.remove(".Resizable")
        console.log @elem.find(".Resizable")

      regen: ->
        @remove()
        @elem.css({position: 'relative'})
        childs =  @elem.children()
        for i in [0..childs.length - 2]
          rez = $('<div class="Resizable" draggable="false"><div class="Handle" draggable="false"></div></div>')
          left = $(childs[i])
          right = $(childs[i + 1])
          height = if left.height() > right.height() then left.height() else right.height()
          rez.height(height)
          width = right.offset().left - (left.offset().left + left.width())
          rez.width(width)

          rez.insertAfter(left)
          rez.css({top: 0, 'margin-left': right.position().left - width / 2})
          console.log {top: 0, left: right.position().left - width}
          console.log "height: #{height}, width: #{width}"

])
