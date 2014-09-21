$$('.sidebar-touch').swipeRight(function() {
        var checkbox = $$('#sidebar-checkbox')[0];

        if (!checkbox.checked)
          checkbox.checked = true;
      });

$$('body').swipeLeft(function() {
        var checkbox = $$('#sidebar-checkbox')[0];

        if (checkbox.checked)
          checkbox.checked = false;
      });

$$('body').tap(function(e) {
        var target = e.target;
        var checkbox = $$('#sidebar-checkbox')[0];
        var sidebar = $$('#sidebar')[0];
        var toggle = $$('.sidebar-toggle')[0];

        if (checkbox.checked && target === toggle)
          return;

        if (checkbox.checked && !sidebar.contains(target))
          checkbox.checked = false;
      });