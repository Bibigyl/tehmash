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
                width: '100%',
                height: 'auto',
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
                    if ( $(`.district[data-ident="${this.region.ident}"] .item`).length != 0 ) {
                        $(`.district[data-ident="${this.region.ident}"]`).show();
                    }
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
        if ( $(`.district[data-ident="${attrVal}"] .item`).length != 0 ) {
            $(`.district[data-ident="${attrVal}"]`).show();
        }
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

    // Certificates
    $('.docs').magnificPopup({
        delegate: 'a',
        type:'image',
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300
		}
    });

    // Burger
    $('.header__burger').on('click', () => {

        $('.header__nav').fadeToggle(200, () => {
            //$('.header__nav').toggleClass('visible')
        })
    })

    // Mobil Landing
    if (window.screen.availWidth <= 780) {
        $('.producers__items').slick({
            arrows: false,
            dots: true,
            //prevArrow: '<button type="button" class="slick-prev slick__arrow slick__arrow_prev">&lt;</button>',
            //nextArrow: '<button type="button" class="slick-next slick__arrow slick__arrow_next">&gt;</button>',
            dotsClass: 'slick__dots',
            infinite: true,
            autoplay: true,
            centerMode: true,
            centerPadding: '60px',
            //slidesToShow: 3,
            variableWidth: true
        });


        $('.clients__items').slick({
            arrows: false,
            dots: true,
            dotsClass: 'slick__dots',
            infinite: true,
            autoplay: true,
            centerMode: true,
            //centerPadding: '60px',
            //slidesToShow: 3,
        });

        $('.documents .docs').slick({
            arrows: false,
            dots: true,
            dotsClass: 'slick__dots',
            infinite: true,
            autoplay: true,
            centerMode: true,
            //centerPadding: '60px',
            //slidesToShow: 3,
            variableWidth: true,
        });
    }


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
