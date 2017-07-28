

import nav from '../html/navigation-lucas.html';

export function loadtheme() {


navContainer = document.getElementById('navigation');
navContainer.innerHTML = nav;

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
   

    // Highlight the top nav as scrolling occurs
   // $('body').scrollspy({
     //   target: '.navbar-fixed-top',
       // offset: 100
   // });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    /*$('#mainNav').affix({
        offset: {
            top: 50
        }
    })*/
    

})(jQuery); // End of use strict

}