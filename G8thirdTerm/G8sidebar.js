$(document).ready(function(){
    //jquery for toggle sub menus
    $('.sub-btn').click(function(){
      $(this).next('.sub-menu').slideToggle();
      $(this).find('.dropdown').toggleClass('rotate');
    });
  
    //jquery for expand and collapse the sidebar
    $('.menu-btn').click(function(){
      $('.side-bar').toggleClass('active');
      $('.menu-btn i').toggleClass('fa-bars fa-times'); // toggle menu icon
    });
  
    $('.close-btn').click(function(){
      $('.side-bar').removeClass('active');
      $('.menu-btn i').removeClass('fa-times').addClass('fa-bars'); // reset menu icon
    });
  });
  