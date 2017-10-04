import '../css/usgs_footer.css';
import nav from '../html/navigation.html';
import footer from '../html/footer.html';

export function loadtheme() {

usgsFooter = document.getElementById("usgs-footer");
usgsFooter.innerHTML =footer;

navContainer = document.getElementById('navigation');
navContainer.innerHTML = nav;


}