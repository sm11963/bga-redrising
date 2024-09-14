/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * RedRisingSmiller implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * redrisingsmiller.js
 *
 * RedRisingSmiller user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
],
function (dojo, declare) {
    return declare("bgagame.redrisingsmiller", ebg.core.gamegui, {
        constructor: function(){
            console.log('redrisingsmiller constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                var hand_count = gamedatas.player_hand_nbrs[player_id];
                         
                var player_board_div = $('player_board_'+player_id);
                var div = `<div class="rr_player_board">
                    <img src="https://x.boardgamearena.net/data/themereleases/220106-1001/img/common/hand.png" class="imgtext cardhandcount">
                    <span id="card_hand_nbr_${player_id}" class="cardhandcount">${hand_count}</span>
                    <div class="imgtext pbtrackericon heliumicon"></div>
                    <span id="helium_tracker_${player_id}">${this.getTrackerCount(gamedatas.tokens, 'helium', player_id)}</span>
                    <div class="imgtext pbtrackericon influenceicon"></div>
                    <span id="influence_tracker_${player_id}">${this.getTrackerCount(gamedatas.tokens, 'influence', player_id)}</span>
                    <div class="imgtext pbtrackericon fleeticon"></div>
                    <span id="fleet_tracker_${player_id}">${this.getTrackerCount(gamedatas.tokens, 'fleet_progress', player_id)}</span>
                </div>`
                dojo.place(div, player_board_div);
            }

            this.playerHand = this.createStock('myhand');
            this.boardLocationStocks = {};

            for (var location_id in gamedatas.ma_board_locations) {
                var location_info =  gamedatas.ma_board_locations[location_id];
                var stock = this.createStock( `location_${location_info.name_key}_cards` );
                stock.autowidth = false; // this is required so it obeys the width set above
                stock.use_vertical_overlap_as_offset = false; // this is to use normal vertical_overlap
                stock.vertical_overlap = 75; // overlap
                stock.horizontal_overlap  = -1; // current bug in stock - this is needed to enable z-index on overlapping items
                stock.item_margin = 0; // has to be 0 if using overlap

                this.boardLocationStocks[location_id] = stock;

                var location_cards = gamedatas.board_locations[location_id].cards;
                                
                var weights = {};
                for (var i in location_cards) {
                    var card = location_cards[i];
                    weights[toint(card.type)] = toint(card.location_arg);
                    stock.addToStockWithId(card.type, card.id);
                }

                // Set weights to order cards correctly (based on game state) in the stock
                for (var i in stock.item_type) {
                    weights[i] = weights[i] ?? -1;
                }
                stock.changeItemsWeight(weights);
           }

            for (var i in gamedatas.hand) {
                var card = gamedatas.hand[i];
                this.playerHand.addToStockWithId(card.type, card.id);
            }

            
            // TODO: Set up your game interface here, according to "gamedatas"
            
 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName, args );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName, args );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                 case 'playerTurn':    
                    const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

                    // Add test action buttons in the action status bar, simulating a card click:
                    playableCardsIds.forEach(
                        cardId => this.addActionButton(`actPlayCard${cardId}-btn`, _('Play card with id ${card_id}').replace('${card_id}', cardId), () => this.onCardClick(cardId))
                    ); 

                    this.addActionButton('actPass-btn', _('Pass'), () => this.bgaPerformAction("actPass"), null, null, 'gray'); 
                    break;
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        getTrackerCount: function( tokens, tracker_type, player_id )
        {
            return tokens[`${tracker_type}_${player_id}`]['state'];
        },

        onStockItemCreate: function ( card_div, card_type_id, card_id )
        {
            dojo.place(`<span class="card_title_type">${card_id} [${card_type_id}]</span>`, card_div.id)
        },

        createStock: function ( container_div_id )
        {
            var stock = new ebg.stock();
            stock.create( this, $(container_div_id), 134, 182);
            stock.backgroundSize = '134px 182px';

            for (var i=0; i<112; i++) {
                stock.addItemType( i, i, g_gamethemeurl+'img/mock_card.jpg', 0);
            }

            stock.onItemCreate = dojo.hitch( this, 'onStockItemCreate' );

            return stock;
        },

        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */


        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        // Example:
        
        onCardClick: function( card_id )
        {
            console.log( 'onCardClick', card_id );

            this.bgaPerformAction("actPlayCard", { 
                card_id,
            }).then(() =>  {                
                // What to do after the server call if it succeeded
                // (most of the time, nothing, as the game will react to notifs / change of state instead)
            });        
        },    

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your redrisingsmiller.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
