(function() {
  var option = function(token) {
    return $('<li class="token-option" data-token-id="' + token.id + '">' + token.name + '</li>');
  }

  var token = function(option) {
    return $('<li class="token" data-token-id="' +
             option.attr('data-token-id') + '">' +
             option.text() + '<span class="close"></span></li>');
  }

  var targetUp = function(root) {
    var target = root.find('.token-option.target');
    var before = target.prev('.token-option');
    if (before.length > 0) {
      target.removeClass('target');
      before.addClass('target');
    }
  }

  var targetDown = function(root) {
    var target = root.find('.token-option.target');
    var after = target.next('.token-option');
    if (after.length > 0) {
      target.removeClass('target');
      after.addClass('target');
    }
  }

  var selectOption = function(root) {
    var target = root.find('.token-option.target');
    var input = root.find('input');
    input.parent().before(token(target));
    input.val('');
    refreshOptions(root);
  }

  var refreshOptions = function(root, tokens) {
    var input = root.find('input');
    var options = root.find('.token-options');
    if (input.val().trim().length == 0) {
      options.html('');
    }
    else {
      var query = new RegExp(input.val(), 'i');
      options.empty();
      var optionTags = tokens.filter(function(token) { return query.test(token.name); });
      var optionTags = optionTags
                             .filter(function(token) {
                               var tokens = $('.token');
                               for (var i = 0; i < tokens.length; i++) {
                                 if ($(tokens[i]).attr('data-token-id') == (token.id+ '')) {
                                   return false;
                                 }
                               }
                               return true;
                             });
      var optionTags = optionTags.map(function(token) { return option(token); });

      var firstTag = optionTags.shift();
      firstTag.addClass('target');
      options.append(firstTag);
      options.append(optionTags);
    }
  }

  window.tokenize = function(input, tokenList, prefill) {
    tokenList = tokenList || [];
    prefill = prefill || [];

    input.addClass("token-input");
    input.wrap($('<div class="token-container"><ul class="tokens"><li></li></ul></div>'));
    var container = input.parents('.token-container').first();

    var options = $('<ul class="token-options"></ul>');
    container.append(options);

    var tokens = container.find('.tokens');
    prefill.forEach(function(tok) {
      tokens.prepend(token(option(tok)));
    });

    container.on('click', function() {
      input.focus();
    });

    input.on('keyup', function(e) {
      if (e.which == 38) { // Up
        targetUp(container);
      }
      else if (e.which == 40) { // Down
        targetDown(container);
      }
      else if (e.which == 13) { // Enter
        e.preventDefault();
        e.stopPropagation();
        selectOption(container);
      }
      else {
        refreshOptions(container, tokenList);
      }
    });

    input.on('keydown', function(e) {
      if (e.which == 13) {
        e.preventDefault();
        e.stopPropagation();
      }
    })

    $('.token-option').live('mouseover', function(e) {
      var currentTarget = $('.token-option.target');
      var target = $(e.target);

      if (!target.hasClass('target')) {
        currentTarget.removeClass('target');
        target.addClass('target');
      }
    });

    $('.token-option').live('click', function(e) {
      selectOption(container);
      input.focus();
    });

    $('.token .close').live('click', function(e) {
      $(e.target).parents('.token').first().remove();
    });
  };
})();