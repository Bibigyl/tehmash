document.addEventListener('DOMContentLoaded', function () {
    // copyright
    document.getElementById('yearNow').innerHTML = new Date().getFullYear();


    // Landing front
    $('.front').slick({
        arrows: false,
        dots: true,
        dotsClass: 'slider__dots',
        infinite: true,
        autoplay: true,
        fade: true,
    });


    // Russian map
    let buildMap = function (data) {
        const $mapTooltip = $('#map__tooltip');
        let handleDistrictMove;

        new RussianMap(
            {
                viewPort: data.viewPort,
                mapId: 'russian-map',
                width: 862,
                height: 497,
                // дефолтовые атрибуты для контуров регионов
                defaultAttr: {
                    fill: '#0053a1', // цвет которым закрашивать
                    stroke: '#ffffff', // цвет границы
                    'stroke-width': 1, // ширина границы
                    'stroke-linejoin': 'round', // скруглять углы
                },
                mouseMoveAttr: {
                    fill: '#4e94d6',
                },
                onMouseMove: function (event) {
                    $mapTooltip.show();
                    $mapTooltip.text(this.region.name);

                    handleDistrictMove = $('#russian-map').mousemove((event) => {
                        $mapTooltip
                            .css('left', event.pageX + 10 + 'px')
                            .css('top', event.pageY + 10 + 'px');
                    });
                },
                onMouseOut: function (event) {
                    handleDistrictMove = null;
                    $mapTooltip.hide();
                },
                onMouseClick: function (event) {
                    /* $(`.district[data-ident="${this.region.ident}"] .items`).show();
                $(`.district[data-ident!="${this.region.ident}"] .items`).hide(); */
                    resetDistrictHiddens();
                    $(`.district[data-ident="${this.region.ident}"]`).show();
                    $(`.district[data-ident!="${this.region.ident}"]`).hide();
                },
            },
            data.regions
        );
    };

    if ($('.map-search').length !== 0) {
        buildMap(mapWithDistricts);
    }


    // Setting colors in list of addresses
    //colorAddresses();

    // open district items
    /*     $('.district__title').on('click', function() {
        $ul = $(this).closest('.district').find('.items');
        $ul.slideToggle();
    }) */


    // click on Belarus
    $('[data-for-ident]').on('click', function () {
        const attrVal = $(this).attr('data-for-ident');

        resetDistrictHiddens();
        $(`.district[data-ident="${attrVal}"]`).show();
        $(`.district[data-ident!="${attrVal}"]`).hide();
    });


    // Search
    $('.search__icon').on('click', searchInDealers);
    $('.search__input').on('search', function (evt) {
        if ($(this).val().length > 0) {
            searchInDealers();
        } else {
            resetDistrictHiddens();
        }
    });


    // Pagination
    $('.news__pagination').pagination({
        prevText: 'Назад',
        nextText: 'Вперед',
        itemsOnPage: 9,
        pages:5

    });



});




/* function colorAddresses() {
    $('.district .item').filter(':odd').css("background-color", "#EAEDEC");
} */

// Reset hiddens in districts
function resetDistrictHiddens() {
    $('.district').hide();
    $('.district').find('*').show();
}

function searchInDealers() {
    let value = $('.search__input').val();
    let $districts = $('.district');
    let $items = $('.district .item');

    let $titles = $('.district__title');
    let $itemsInner = $('.district .item *');
    let districtsToOpen = [];
    let itemsToOpen = [];

    $districts.hide();
    $items.hide();

    $titles.each((i, $item) => {
        if ($item.innerText.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            districtsToOpen.push($item);
        }
    });

    $itemsInner.each((i, $item) => {
        if ($item.innerText.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            itemsToOpen.push($item);
        }
    });

    itemsToOpen.forEach((item, i) => {
        $(item).closest('.district').show();
        $(item).closest('.item').show();
    });

    districtsToOpen.forEach((item) => {
        $(item).closest('.district').show();
        $(item).closest('.district').find('.item').show();
    });
}
