$('.btn.dropdown-toggle').click(function (e) {
    e.stopPropagation();
    $('.dropdown-menu, .popover').addClass('hidden');
    $('.active').removeClass('active');
    $(this).toggleClass('active').siblings().toggleClass('hidden');
    $('html').on('click', function () {
        $('.btn.dropdown-toggle').removeClass('active');
        $('.dropdown-menu, .popover').addClass('hidden');
        $('html').off('click');
    });
});
