$(document).ready(function() {
  $hidden = $('.hidden');
  $tos = $('.termsofservice');
  $hidden.hide();
  $tos.click(function(){
    $tos.fadeOut(450);
$('.metoothanks').fadeOut(450);
    $('.mainbody').show();
    $first.fadeIn(650);
    $('metooblue').fadeOut(200);
    }); // end of tos click
$first = $('.first');
$second = $('.second');
$third = $('.third');
$fourth = $('.fourth');
$fifth = $('.fifth');
$sixth = $('.sixth');
$final = $('.final');
$first.hide()
$second.hide();
$third.hide();
$fourth.hide();
$fifth.hide();
$sixth.hide();
$final.hide();
$('.mainbody').hide();
$first.mouseenter(function(){
  $first.fadeOut(8750, function() {
    $second.fadeIn(250);
}); // end of first fadeout
}) // end of first mouse enter
  $second.mouseenter(function(){
  $second.fadeOut(8500, function() {
    $third.fadeIn(250);
  }); // end of fadeout
  }); // end of mouseenter
    $third.mouseenter(function(){
  $third.fadeOut(8500, function() {
    $fourth.fadeIn(250);
  }); // end of fadeout
  }); // end of mouseenter
    $fourth.mouseenter(function(){
  $fourth.fadeOut(12500, function() {
    $fifth.fadeIn(250);
  }); // end of fadeout
  }); // end of mouseenter
      $fifth.mouseenter(function(){
  $fifth.fadeOut(8500, function() {
    $sixth.fadeIn(250);
  }); // end of fadeout
      }); //end of mouse enter
          $sixth.mouseenter(function(){
  $sixth.fadeOut(8500, function() {
    $('.mainbody').hide();
    $hidden.fadeIn(250);
    
  }); // end of fade
          }); // end of mouseenter
}); // end of ready