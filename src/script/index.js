$(document).ready(function () {
    $('.cart').css("display", "none");

    const frm = document.querySelector('#form');

    $(document).keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    $('input, textarea').on('keyup', function (e) {

        let state = [...frm.querySelectorAll('input[name], textarea[name]')].reduce((r, { name, value }) => Object.assign(r, { [name]: value }), {});

        localStorage.setItem('regForm', JSON.stringify(state));

        if (e.currentTarget.value === "") {
            this.classList.add('no-valid')
        } else {
            this.classList.remove('no-valid')
        }
    });

    $('#start').click(e => {
        e.preventDefault();

        $('.welcome').css("display", "none");
        $('.stage1').css("display", "block");
        $('.form__inner').css("display", "block");
        $(window).scrollTop(0);

        let cash_data = JSON.parse(localStorage.getItem('regForm'));

        let isEmpty = true;

        for (key in cash_data) {
            if (cash_data[key].length > 0) {
                isEmpty = false
            }
        }

        if (!isEmpty) {
            $('#continue_alert').css('display', 'flex');
        } else {
            localStorage.removeItem('regForm');
        }
    });

    $("#again").click(e => {
        localStorage.removeItem('regForm');
        $('#continue_alert').css('display', 'none');
    });

    $("#continue").click(e => {
        let state = JSON.parse(localStorage.getItem('regForm') || '{}');

        Object.keys(state).forEach(name => {
            const inp = frm.querySelector(`[name="${name}"]`);
            if (inp) inp.value = state[name];
        });

        frm.value = state;

        $('#continue_alert').css('display', 'none');
    });



    $('.back').click(e => {
        e.preventDefault();

        let theClass = e.currentTarget.parentElement.parentElement.className.split(" ")[0];
        let theClass2 = e.currentTarget.parentElement.parentElement.className.split(" ")[1].replace(/[^0-9]/g, "");

        if (theClass2 !== 1) {
            $("." + theClass).css("display", "none");
            $("." + theClass).prev().css("display", "block");
            $(window).scrollTop(0);
        }
    })

    $('.next').on("click", e => {
        e.preventDefault();
        let theClass = e.currentTarget.parentElement.parentElement.className.split(" ")[0];

        let inputs = $('.' + theClass + ' input,' + '.' + theClass + ' textarea');

        let isEmpty = false;

        inputs.each((i, inp) => {
            if (inp.value === "" || inp.value === null) {
                isEmpty = true;
                inp.classList.add('no-valid')
            } else if (inp.name === "number" && inp.value.length < 13) {
                isEmpty = true;
                inp.classList.add('no-valid')
            } else {
                inp.classList.remove('no-valid')
            }
        })

        if (!isEmpty) {
            $("." + theClass).css("display", "none");
            $("." + theClass).next().css("display", "block");
            $(window).scrollTop(0);
        }

    });

    function getFormData(form) {
        var unindexed_array = form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    $('.finish').on("click", e => {
        e.preventDefault();
        let theClass = e.currentTarget.parentElement.parentElement.className.split(" ")[0];

        let inputs = $('.' + theClass + ' input');

        let isEmpty = false;

        inputs.each((i, inp) => {
            if (inp.value === "" || inp.value === false) {
                isEmpty = true;
                inp.classList.add('no-valid')
            } else {
                inp.classList.remove('no-valid')
            }
        })

        if (!isEmpty) {
            let form = $('#form');
            let data = getFormData(form);

            console.log(data);
            $('#succsess').css('display', 'flex');

            $.ajax({
                type: 'POST',
                url: 'https://www.corezoid.com/api/1/json/public/1101935/6a44d899706a421de7262f6e334e58f04284e73c',
                data: data,
                crossDomain: true,
                // contentType: "application/json;",
                // dataType: "json",
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "http://127.0.0.1:5501/",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
                },
                success: function (data) {
                    $(".form__inner").css("display", "none");
                    $('.form').trigger('reset');
                    $('#succsess').css('display', 'flex');
                    localStorage.removeItem('regForm');
                },
                error: function (data) {
                    console.log(data);
                }
            });

        }
    });

});

