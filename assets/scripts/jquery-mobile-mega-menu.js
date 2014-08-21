/* 

Blake Cerecero
Blake@DigitalBlake.com
http://DigitalBlake.com
@blakecerecero

*/
'use strict';

(function($){
	jQuery.fn.extend({

		// Plugin Name
		mobileMegaMenu: function(options){

			// Defaults options are set here
			// Every default goes within the { } brackets as seen below
			// A comma separates the different values
			var defaults = {
				changeToggleText: false,
				enableWidgetRegion: false,
				prependCloseButton: false,
				stayOnActive: true,
				toogleTextOnClose: 'Close Menu'
			};

			var settings = $.extend(defaults, options);

			return this.each(function() {
				/* ------------------------- Plugin Starts Here ------------------------- */
				/* Variables */
				var animationSpeed 	= 250, // Change SCSS to match this speed
					nextButton 		= '<a class="next-button" href="#"><div class="arrow">Next</div></a>',
					backButton 		= '<li><a class="back-button" href="#">Back</a></li>',
					closeButton 	= '<li><a class="close-button toggle-menu" href="#">Close Menu</a></li>',
					maxHeight 		= -1;

				var $menuRoot 		= $('.mobile-mega-menu'), // Root of Mobile Mega Menu
					$currentText 	= $('a.toggle-menu').html(); // Existing text of menu toggle

				/* ------------------------- Add next button to main menu items with sub menus and add back button to top of every sub ul after the root */
				$menuRoot.find('ul ul').before(nextButton).siblings('a:first-of-type').addClass('has-next-button');
				$menuRoot.find('ul ul').prepend(backButton);

				/* ------------------------- Prepend Close Button  */
				if (settings.prependCloseButton){
					$menuRoot.find('ul').closest('ul').prepend(closeButton);
				}

				/* Variables */
				var $toggleMenu 	= $('a.toggle-menu'), // DOM Search for Menu Toggle
					$nextAction 	= $menuRoot.find('a.next-button'), // DOM Search for Next Button
					$backAction 	= $menuRoot.find('a.back-button'); // DOM Search for Back Button

				// Stop scroll to top Animation on touch/tap/click
				$('html, body').on('touchstart click', function(){
					$('html, body').stop();
				});

				/* ------------------------- Generate and move Widget Region */
				if(settings.enableWidgetRegion){	
					var widgets = $menuRoot.find('.widget-region').detach();
					$menuRoot.find('ul:first').append(widgets);
				}

				/* ------------------------- Set a variable to calculate height of the tallest ul in the menu, then set that height as the min-height of the menu container */
				$menuRoot.find('ul').each(function(){
					maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
				});

				$menuRoot.css('min-height', maxHeight + 50).addClass('remove');

				/* ------------------------- Set active menu item as is-in-view */
				if (settings.stayOnActive){
					var str = window.location.href,
						url = str.replace('#', '');
					
					// Will also work for relative and absolute hrefs
					$menuRoot.find('ul li a').filter(function() {
						return this.href === url;
					}).addClass('active');

					$menuRoot.find('a.active').closest('ul').addClass('is-in-view').parents('ul').addClass('has-been-viewed');
					$menuRoot.find('a.active').closest('ul').parents().siblings('li').find('ul').hide();
				}

/* ------------------------- Actions ------------------------- */

				/* ------------------------- Open Menu ------------------------- */
				$toggleMenu.click(function(event){
					event.preventDefault();

					/* When the menu is first opened give the first ul its is-in-view class */
					if ( !$menuRoot.find('ul:first-child').hasClass('has-been-viewed') ){
						$menuRoot.find('ul:first-child').toggleClass('is-in-view');
					}
					
					/* Change text when the menu is open to show the option to close the menu */
					if (settings.changeToggleText){
						if ( !$menuRoot.hasClass('open') ){
							$('a.toggle-menu').html(settings.toogleTextOnClose);
						} else if ( $menuRoot.hasClass('open') ) {
							$('a.toggle-menu').html($currentText);
						}
					}

					/* Open menu by adding open class and removing hidden, reverse on close */
					$menuRoot.toggleClass('open').delay(animationSpeed).toggleClass('remove');

				});/* End a.toggle-menu */



				/* ------------------------- Next Button ------------------------- */
				$nextAction.click(function(event){
					event.preventDefault();

					setTimeout(function() {
						$('html, body').animate({scrollTop:0}, animationSpeed);
					}, animationSpeed);

					/* Set is-in-view class for current ul and only that ul */
					$(this).siblings('ul:first-of-type').addClass('is-in-view');
					/* Once the sub ul is visible we hide other sibling uls so that they do not appear above the is-in-view ul */
					$(this).parents().siblings('li').find('ul').hide();
					/* If we use the back button and decide to go into another submenu we need to bring back the hidden sibling uls */
					$(this).siblings('ul').show();
					/* Once we go in a level we remove the is-in-view class and add the has-been-viewed class, this allows for the slide off animation and the slide in animations  */
					$(this).parents('ul:first-of-type').addClass('has-been-viewed').removeClass('is-in-view');
				});



				/* ------------------------- Back Button ------------------------- */
				$backAction.click(function(event){
					event.preventDefault();
					
					/* As we traverse back up the menu we reset the previous menu item from has-been-viewed to the is-in-view class. 
					Bringing back the slide in and slide off aniamtions. Once the animation is complete we go back down the DOM and remove the previous is-in-view ul class */
					$(this).parents('ul.is-in-view').closest('ul.has-been-viewed').toggleClass('has-been-viewed is-in-view').promise().done(function(){
						$menuRoot.find('ul.is-in-view ul.is-in-view').toggleClass('is-in-view');
					});
				});



				/* ------------------------- Modernizer: For when css animations are not supported ------------------------- */
				if ( $('html').hasClass('no-csstransforms') || $('html').hasClass('no-cssanimations') ) {

					/* Toggle Menu */
					$toggleMenu.click(function(event){
						event.preventDefault();

						if ( $menuRoot.hasClass('open') ) {
							$menuRoot.animate({
								left: 0
							});
						} else {
							$menuRoot.animate({
								left: '-100%'
							});
						}

					});

					/* Next */
					$nextAction.click(function(event){
						event.preventDefault();

						$menuRoot.find('ul').animate({
							right: '+=100%'
						}, animationSpeed);
					});

					/* Back */
					$backAction.click(function(event){
						event.preventDefault();

						$menuRoot.find('ul').animate({
							right: '-=100%'
						}, animationSpeed);
					});

				} /* End Modernizer */



			}); // End this.each / End Plugin

		} // End mobileMegaMenu
	}); // End jQuery.fn.extend
}( jQuery )); // End function