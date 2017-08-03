
import head from 'theme/html/head.html';
import nav from 'theme/html/navigation.html';
headerContainer = document.getElementById('header');
headerContainer.innerHTML = head;

navContainer = document.getElementById('navigation');
navContainer.innerHTML = nav;



document.addEventListener('DOMContentLoaded', () => {
	
	$('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
})
}, false);
/*import { loadtheme } from './theme/js/theme';



document.addEventListener('DOMContentLoaded', () => {
loadtheme()
})*/