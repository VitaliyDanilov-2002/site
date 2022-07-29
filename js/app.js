$(document).ready(function () {

    //preload_animation();

    init();

    $(document).on('click', '.js--toggle-request', function () {
        $('.header').toggleClass('open');
        if (!$('.header').hasClass('open') && $('.application__step:last-child').hasClass('show_content')) {
            $()
            $('.application__step:last-child').toggleClass('show_content hidden');
            $('.application__step:first-child').toggleClass('show_content hidden');
        }
        return false;
    });

    $(document).on('click', '.js--toggle-menu', function () {
        $('.header').toggleClass('menu');
        $(this).toggleClass('menu');

        return false;
    });

    $(document).on('focus', '.inp', function () {
        $(this).removeClass('error');
    });

    $(document).on('blur', '.inp.required', function () {
        let inp = $(this);
        let val = inp.prop('value');
        console.log(val);
        if (val == '') {
            inp.removeClass('filled not_empty');
        } else {
            if (inp.hasClass('inp-mail')) {
                if (validateEmail(val) == false) {
                    inp.removeClass('filled');
                    inp.addClass('error');
                    /*if(val.length > 0){*/
                        inp.addClass('not_empty');
                    /*}*/
                } else {
                    inp.addClass('filled');
                }
            } else {
                inp.addClass('filled');
            }

            if(inp.hasClass('inp-phone')){
                if(val.includes('-')){
                    inp.removeClass('filled');
                }
            }
        }
    });

    $(document).on('focus', 'textarea.inp', function () {
        $(this).closest('label').removeClass('error').addClass('focus');
    });

    $(document).on('blur', 'textarea.inp', function () {
        let inp = $(this);
        label.removeClass('focus');
        if (inp.prop('value') == '') {
            inp.removeClass('filled');
        } else {
            inp.addClass('filled');
        }
    });

    $(document).on('change', '.js--request-checkbox', function () {
        let step = $(this).closest('.application__step');
        let button = step.find('.application__next')
        let checked = false;

        step.find('.js--request-checkbox').each(function () {
            if ($(this).is(':checked')) {
                checked = true;
            }
        })

        checked ? button.removeClass('disabled') : button.addClass('disabled')
    });

    $(document).on('click', '.js--next-step', function () {
        let button = $(this);
        let step = button.closest('.application__step');
        let errors = false;
        if (step.find('.required').length) {
            step.find('.required').each(function () {
                var inp = $(this);
                var val = inp.prop('value');
                if (val == '') {
                    inp.addClass('error');
                    errors = true;
                } else {
                    if (inp.hasClass('inp-mail')) {
                        if (validateEmail(val) == false) {
                            inp.addClass('error');
                            errors = true;
                        }
                    }
                }
            })
        }

        if (!errors) {
            change_step(step.index(), step.index() + 1);
            //step.addClass('hidden').next().removeClass('hidden');
        }
        return false;
    });

    $(document).on('click', '.js--prev-step', function () {
        let step = $(this).closest('.application__step');
        change_step(step.index(), step.index() - 1);
        //$(this).closest('.application__step').addClass('hidden').prev().removeClass('hidden');
        return false;
    });

    $(document).on('click', '.js--submit-request', function () {
        let button = $(this);
        let step = button.closest('.application__step');
        let form = $(this).closest('form');
        let method = form.attr('method');
        let data = form.serialize();
        let action = form.attr('action');

        /*$.ajax({
            type: method,
            url: action,
            data: data,
            success: function (data) {
                form.find('.inp').val('');
                form.find('.js--request-checkbox').removeAttr('checked');
                form.find('.label_checkbox:first-child .js--request-checkbox').prop('checked', 'checked');
                change_step(step.index(), step.index() + 1);
            }
        });*/

        change_step(step.index(), step.index() + 1);

        return false;
    });

    $(document).on("scroll", function (){
        var scroll_top = $(document).scrollTop();
        if (scroll_top > 1) {
            $('.header').addClass('scrolling scroll')
        }
        else {
            $('.header').removeClass('scrolling scroll')
        }
    });

    $('.js--toggle-scroll').on('click', function (){
        $('.header').removeClass('scrolling scroll')
    })

    $(document).on('click', '.js--change-url', function () {
        let url = $(this).data('url')
        if (url) {
            setLocation($(this).data('url'))
            load_data($(this).data('url'))
        } else {
            setLocation("")
            load_data("index")
        }
        return false;
    })

    let location = window.location.pathname.split('/');
    for (el in location) {
        if (location[el] == "") {
            location.splice(el, 1)
        }
    }

    if (!$.cookie('show_preload')) {
        setTimeout(function () {
            preload_animation();
        }, 1000)
        setTimeout(function () {
            load_content();
        }, 6000)
    }
    else{
        load_content();
    }

    function load_content() {
        let action;
        if (location[location.length - 1] == "contacts") {
            action = "/pageLoad/contacts.html";
        } else {
            action = "/pageLoad/index.html";
        }

        $.ajax({
            type: "post",
            url: action,
            success: function (data) {
                $('main').html(data);
                $('.preloader ').fadeOut(300)
                $('main').fadeIn(300);
                init();
            }
        });
    }

})

function change_step(current_index, next_index) {
    $('.application__step').eq(current_index).removeClass('show_content');
    setTimeout(function () {
        $('.application__step').eq(current_index).addClass('hidden');
        $('.application__step').eq(next_index).removeClass('hidden');
    }, 500)
    setTimeout(function () {
        $('.application__step').eq(next_index).addClass('show_content');
    }, 550)
}

function print_numbers(from, to) {
    let current = from;

    let timerId = setInterval(function () {
        $('.preloader__percentage__val').text(current)
        if (current == to) {
            clearInterval(timerId);
        }
        current++;
    }, 39);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function preload_animation(){
    $('.preloader').removeClass('hidden');
    $('.preloader__progress').addClass('show');
    print_numbers(0, 100);
    $.cookie('show_preload', true);
}

function init() {
    $('.inp-phone').mask('+7(999) 999 99 99')
    $('.label_range').each(function () {
        let slider = this.getElementsByClassName('range')[0];
        let add = this.getElementsByClassName('js--add-step')[0];
        let remove = this.getElementsByClassName('js--remove-step')[0];
        let step = +slider.dataset['step'];
        let min = +slider.dataset['min'];
        let max = +slider.dataset['max'];
        let start = +slider.dataset['start'];
        let added_text;


        let set_added_text = slider => {
            if (slider.classList.contains('range__day')) {
                let value = slider.noUiSlider.get();
                if (value >= 11 && value <= 14) {
                    added_text = ' дней'
                } else {
                    value = value % 10;
                    if (value == 0 || (value >= 5 && value <= 9)) {
                        added_text = ' дней'
                    } else if (value == 1) {
                        added_text = ' день'
                    } else if (value >= 2 && value <= 4) {
                        added_text = ' дня'
                    }
                }
            } else if (slider.classList.contains('range__price')) {
                added_text = ' р.'
            }
        }

        noUiSlider.create(slider, {
            connect: true,
            step: step,
            behaviour: 'tap-drag',
            tooltips: true,
            start: start,
            format: wNumb({
                decimals: 0,
                thousand: '.'
            }),
            range: {
                'min': min,
                'max': max
            }
        });

        add.addEventListener('click', event => {
            if ((format_no_points(slider.noUiSlider.get()) + step) <= max) {
                slider.noUiSlider.set(format_no_points(slider.noUiSlider.get()) + step)
            }
            event.preventDefault();
        });

        remove.addEventListener('click', event => {
            if ((format_no_points(slider.noUiSlider.get()) + step) >= min) {
                slider.noUiSlider.set(format_no_points(slider.noUiSlider.get()) - step)
            }
            event.preventDefault();
        });

        slider.noUiSlider.on('update', function (values, handle) {
            //set_added_text(slider);
            slider.getElementsByClassName('noUi-tooltip')[0].innerHTML = values[handle]/* + added_text*/;
            slider.closest('.label_range').getElementsByTagName('input')[0].value = values[handle]
        });

        let format_no_points = (string) => {
            let string_new = string.split('.').join("");
            return +string_new
        };
    });
    new WOW().init();
    set_form_height();

    $(window).resize(function () {
        set_form_height();
    });

    function  set_form_height() {
        //$('.application__step .application__content_mobile').css('height', $('body').height());
        $('.application__step .application__content_mobile').css('top', window.innerHeight);
    }
}

function setLocation(curLoc) {
    try {
        if (curLoc != ""){
            history.pushState(null, null, curLoc);
        }
        else{
            window.history.pushState({}, document.title, "/" )
        }
        return;
    } catch (e) {

    }
}

function load_data(link) {
    $('main').fadeOut(200);
    $.ajax({
        type: "post",
        url: "../pageLoad/" + link + ".html",
        success: function (data) {
            $('main').fadeOut(300);
            setTimeout(function () {
                $('main').html(data);
                $('main').fadeIn(200);
            }, 300)
            setTimeout(function () {
                init();
            }, 400)
        }
    });
}
$(document).ready(function () {

    /*let location = window.location.pathname.split('/');
    for (el in location) {
        if (location[el] == "") {
            location.splice(el, 1)
        }
    }

    if (location[location.length - 1] == "contacts") {
        let action = window.location.host + "/pageLoad/contacts.html";
        $.ajax({
            type: "post",
            url: "/pageLoad/contacts.html",
            success: function (data) {
                $('main').html(data);
                $('main').fadeIn(300);
                init();
            }
        });
    }
    else {
        $.ajax({
            type: "post",
            url: "/pageLoad/index.html",
            success: function (data) {
                $('main').html(data);
                setTimeout(function () {
                    $('.preloader').removeClass('hidden');
                    $('.preloader__progress').addClass('show');
                    print_numbers(0, 100);
                }, 500);
                setTimeout(function () {
                    $('main').fadeIn(300);
                    $('.preloader').fadeOut(300);
                    init();
                }, 5000)
            }
        });
    }

    if($('.preloader_animation').length){
        setTimeout(function (){
            //preload_animation();
        }, 10000)
        setTimeout(function (){
            // url: "/pageLoad/index.html",
            // $.ajax({
            //     type: "post",
            //     url: action,
            //     success: function (data) {
            //         $('.preloader').fadeOut(300);
            //         $('main').html(data);
            //         $('main').fadeIn(300);
            //         init();
            //     }
            // });
        }, 10000)
    }*/
})