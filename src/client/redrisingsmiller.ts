/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * RedRisingSmiller implementation : © Sam Miller sm11963@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/// <amd-module name="bgagame/redrisingsmiller"/>

import Gamegui = require('ebg/core/gamegui');
import "ebg/counter";
import Stock = require('ebg/stock');

/** The root for all of your game code. */
class RedRisingSmiller extends Gamegui
{
	// myGlobalValue: number = 0;
	// myGlobalArray: string[] = [];
	playerHand: Stock;
	boardLocationStocks: { [key: string]: Stock } = {};

	/** @gameSpecific See {@link Gamegui} for more information. */
	constructor(){
		super();
		console.log('redrisingsmiller constructor');
		this.playerHand = this.createStock('myhand');
	}

	/** @gameSpecific See {@link Gamegui.setup} for more information. */
	override setup(gamedatas: Gamedatas): void
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
			if (player_board_div !== null) {
				dojo.place(div, player_board_div);
			}
		}

		for (var location_id in gamedatas.ma_board_locations) {
			const location_info =  gamedatas.ma_board_locations[location_id]!;
			const stock = this.createStock( `location_${location_info['name_key']}_cards` );
			stock.autowidth = false; // this is required so it obeys the width set above
			stock.use_vertical_overlap_as_offset = false; // this is to use normal vertical_overlap
			stock.vertical_overlap = 75; // overlap
			stock.horizontal_overlap  = -1; // current bug in stock - this is needed to enable z-index on overlapping items
			stock.item_margin = 0; // has to be 0 if using overlap

			this.boardLocationStocks[location_id] = stock;

			const location_cards = gamedatas.board_locations[location_id]!.cards;
							
			var weights: { [key: string]: number } = {};
			for (var i in location_cards) {
				var card = location_cards[i]!;
				weights[toint(card.type)!] = toint(card.location_arg)!;
				stock.addToStockWithId(toint(card.type)!, toint(card.id)!);
			}

			// Set weights to order cards correctly (based on game state) in the stock
			for (var i in stock.item_type) {
				weights[i] = weights[i] ?? -1;
			}
			stock.changeItemsWeight(weights);
		}

		for (var i in gamedatas.hand) {
			var card = gamedatas.hand[i]!;
			this.playerHand.addToStockWithId(toint(card.type)!, toint(card.id)!);
		}

		
		// TODO: Set up your game interface here, according to "gamedatas"
		

		// Setup game notifications to handle (see "setupNotifications" method below)
		this.setupNotifications();

		console.log( "Ending game setup" );
	}

	///////////////////////////////////////////////////
	//// Game & client states
	
	/** @gameSpecific See {@link Gamegui.onEnteringState} for more information. */
	override onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	{
		console.log( 'Entering state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	override onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
	override onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	{
		console.log( 'onUpdateActionButtons: ' + stateName, args );

		if(!this.isCurrentPlayerActive())
			return;

		switch( stateName )
		{
		case 'dummmy':
			// Add buttons if needed
			break;
		}
	}

	///////////////////////////////////////////////////
	//// Utility methods
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

	getTrackerCount(tokens: { [key: string]: { [key: string]: number } }, tracker_type: string, player_id: string ): number | undefined
	{
		const token_info = tokens[`${tracker_type}_${player_id}`]!;
		return token_info['state'];
	}

	onStockItemCreate( card_div: any, card_type_id: string, card_id: string ): void
	{
		dojo.place(`<span class="card_title_type">${card_id} [${card_type_id}]</span>`, card_div.id);
	}

	createStock( container_div_id: string ): Stock
	{
		var stock = new Stock();
		stock.create( this, $(container_div_id), 134, 182);
		//stock.backgroundSize = '134px 182px';
		stock.resizeItems(134, 182, 134, 182);

		for (var i=0; i<112; i++) {
			stock.addItemType( i, i, g_gamethemeurl+'img/mock_card.jpg', 0);
		}

		stock.onItemCreate = dojo.hitch( this, 'onStockItemCreate' );

		return stock;
	}

	///////////////////////////////////////////////////
	//// Player's action
	
	/*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).
		
		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/
	
	/*
	Example:
	onMyMethodToCall1( evt: Event )
	{
		console.log( 'onMyMethodToCall1' );

		// Preventing default browser reaction
		evt.preventDefault();

		//	With base Gamegui class...

		// Check that this action is possible (see "possibleactions" in states.inc.php)
		if(!this.checkAction( 'myAction' ))
			return;

		this.ajaxcall( "/yourgamename/yourgamename/myAction.html", { 
			lock: true, 
			myArgument1: arg1,
			myArgument2: arg2,
		}, this, function( result ) {
			// What to do after the server call if it succeeded
			// (most of the time: nothing)
		}, function( is_error) {

			// What to do after the server call in anyway (success or failure)
			// (most of the time: nothing)
		} );


		//	With GameguiCookbook::Common...
		this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	}
	*/

	///////////////////////////////////////////////////
	//// Reaction to cometD notifications

	/** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
	override setupNotifications()
	{
		console.log( 'notifications subscriptions setup' );
		
		// TODO: here, associate your game notifications with local methods
		
		// With base Gamegui class...
		// dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

		// With GameguiCookbook::Common class...
		// this.subscribeNotif( 'cardPlayed', this.notif_cardPlayed ); // Adds type safety to the subscription
	}

	/*
	Example:
	
	// The argument here should be one of there things:
	// - `Notif`: A notification with all possible arguments defined by the NotifTypes interface. See {@link Notif}.
	// - `NotifFrom<'cardPlayed'>`: A notification matching any other notification with the same arguments as 'cardPlayed' (A type can be used here instead). See {@link NotifFrom}.
	// - `NotifAs<'cardPlayed'>`: A notification that is explicitly a 'cardPlayed' Notif. See {@link NotifAs}.
	notif_cardPlayed( notif: NotifFrom<'cardPlayed'> )
	{
		console.log( 'notif_cardPlayed', notif );
		// Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
	}
	*/
}


// The global 'bgagame.redrisingsmiller' class is instantiated when the page is loaded. The following code sets this variable to your game class.
dojo.setObject( "bgagame.redrisingsmiller", RedRisingSmiller );
// Same as: (window.bgagame ??= {}).redrisingsmiller = RedRisingSmiller;