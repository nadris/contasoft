(function( $ ) {

    $.fn.passStrength = function( options ) {

        var settings = $.extend({
            submitButton: false,
            toggleButton: false,
            disable_copy: true,
            strength: false,
            strengthBar: false,
            secondaryInput: false,
            passwordMinLength: 8
        }, options);

        var mainInput = $(this);
        var secondaryInput = false;
        var strengthBar = false;
        var button = $(settings.submitButton);
        var toggleText = $(settings.toggleButton);

        //Disable submitButton at start if user has form submitButton
        if(button != false){
            button.attr('disabled', 'disabled');
        }

        //if user has enabled strength bar prepare it
        if(settings.strengthBar != false){
            strengthBar = $(settings.strengthBar + ' #innerBar');
        }
        //if user has enabled second input prepare it
        if(settings.secondaryInput != false){
            secondaryInput = $(settings.secondaryInput);
        }

        //toggleButton viewing password submitButton if user has toggleButton available
        if(toggleText != false){
            toggleText.mousedown(function(){
                mainInput.attr('type', 'text');
            });
            toggleText.mouseup(function(){
                mainInput.attr('type', 'password');
            });
            toggleText.mouseout(function(){
                mainInput.attr('type', 'password');
            });
        }
        //if user has disabled copy function then prevetn copy
        if(settings.disable_copy = true){
            mainInput.bind('copy', function (e) {
                e.preventDefault();
            });
        }

        function animate(width){
            strengthBar.animate({width:width+'%'},150);
        }



        mainInput.keyup(function qwerty(){

            var current_val = mainInput.val();
            var strength = 0;

            if(current_val.match(/[a-z]/)){strength += 1;}
            if(current_val.match(/[A-Z]/)){strength += 1;}
            if(current_val.match(/[0-9]/)){strength += 1;}
            if(current_val.length >= settings.passwordMinLength){strength += 1;}

            var match = false;

            if(secondaryInput != false){
                if(secondaryInput.val() == current_val){
                    match = true;
                    strength += 1;
                    if(current_val.length < 1 && secondaryInput.val().length < 1){
                        strength = 0;
                    }
                } else {
                    match = false;
                }

                switch(strength){
                    case 0:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(0);
                        break;
                    case 1:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(20);
                        break;
                    case 2:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(40);
                        break;
                    case 3:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(60);
                        break;
                    case 4:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(80);
                        break;
                    case 5:
                        button.removeAttr('disabled','disabled');
                        if(strengthBar != false)
                            animate(100);
                        break;
                    }

            } else {

                switch(strength){
                    case 0:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(0);
                        break;
                    case 1:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(40);
                        break;
                    case 2:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(60);
                        break;
                    case 3:
                        button.attr('disabled','disabled');
                        if(strengthBar != false)
                            animate(80);
                        break;
                    case 4:
                        button.removeAttr('disabled','disabled');
                        if(strengthBar != false)
                            animate(100);
                        break;
                }

            }

        });

    };

}( jQuery ));