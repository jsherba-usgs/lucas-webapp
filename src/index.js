
// Import Styles
//import './theme/vendor/bootstrap/css/bootstrap.css';
import './theme/css/bootstrap.css';
import './theme/css/new-age.css';

import nav from './theme/html/navigation.html';
	

import footer from './theme/html/footer.html';
console.log(footer)
usgsFooter = document.getElementById("usgs-footer");
usgsFooter.innerHTML =footer;
navContainer = document.getElementById('mainNav');
navContainer.innerHTML = nav;

document.addEventListener('DOMContentLoaded', () => {


})