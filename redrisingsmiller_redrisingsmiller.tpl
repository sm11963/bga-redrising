{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- RedRisingSmiller implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    redrisingsmiller_redrisingsmiller.tpl
    
    This is the HTML template of your game.
    
    Everything you are writing in this file will be displayed in the HTML page of your game user interface,
    in the "main game zone" of the screen.
    
    You can use in this template:
    _ variables, with the format {MY_VARIABLE_ELEMENT}.
    _ HTML block, with the BEGIN/END format
    
    See your "view" PHP file to check how to set variables and control blocks
    
    Please REMOVE this comment before publishing your game on BGA
-->

<div id="myhand_wrap" class="whiteblock">
    <div id="myhand">
    </div>
</div>

<div id="gameboard">

    <div class="whiteblock boardlocation location_jupiter">
        <div class="locationname" style="color:#0000FF">
            Jupiter
        </div>
        <div class="locationcards" id="location_jupiter_cards">
        </div>
    </div>

    <div class="whiteblock boardlocation location_mars">
        <div class="locationname" style="color:#FF0000">
            Mars
        </div>
        <div class="locationcards" id="location_mars_cards">
        </div>
    </div>

    <div class="whiteblock boardlocation location_luna">
        <div class="locationname" style="color:#FFFF00">
            Luna
        </div>
        <div class="locationcards" id="location_luna_cards">
        </div>
    </div>

    <div class="whiteblock boardlocation location_institute">
        <div class="locationname" style="color:#00FF00">
            Minerva
        </div>
        <div class="locationcards" id="location_institute_cards">
        </div>
    </div>

</div>

<script type="text/javascript">

// Javascript HTML templates

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
