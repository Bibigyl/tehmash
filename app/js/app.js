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
    const $mapTooltip = $('#map__tooltip');
    let handleDistrictMove;

    fetch('../libs/with-districts.json').then(function (response) {
        response.json().then(function (data) {
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
                        /*                     $(`.district[data-ident="${this.region.ident}"] .items`).show();
                    $(`.district[data-ident!="${this.region.ident}"] .items`).hide(); */
                        $(`.district[data-ident="${this.region.ident}"]`).show();
                        $(`.district[data-ident!="${this.region.ident}"]`).hide();
                    },
                },
                data.regions
            );
        });
    });

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
        console.log(attrVal);

        $(`.district[data-ident="${attrVal}"]`).show();
        $(`.district[data-ident!="${attrVal}"]`).hide();
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

// Search
$('.search__icon').on('click', search);
$(".search__input").on("search", function(evt){
    if ( $(this).val().length > 0 ) {
        search();
    } else {
        resetDistrictHiddens();
    }
});

function search() {
    let value = $('.search__input').val();
    let $districts = $('.district');
    let $items = $('.district .item');

    let $titles = $('.district__title');
    let $itemsInner = $('.district .item *');
    let $districtsToOpen = [];
    let $itemsToOpen = [];


    $districts.hide();
    $items.hide();

    $titles.each( (i, $item) => {
        if ($item.innerText.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            $districtsToOpen.push($item);
        }
    });

    $itemsInner.each( (i, $item) => {
        if ($item.innerText.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            $itemsToOpen.push($item);
        }
    });

    $itemsToOpen.forEach( (item, i) => {
        $(item).closest('.district').show();
        $(item).closest('.item').show();
    });

    $districtsToOpen.forEach( (item) => {
        $(item).closest('.district').show();
        $(item).closest('.district').find('.item').show();
    });
}

