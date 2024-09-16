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
import Stock = require('ebg/stock');
import CommonMixer = require("cookbook/common");
import Counter = require("ebg/counter");

/** The root for all of your game code. */
class RedRisingSmiller extends CommonMixer(Gamegui)
{
	// myGlobalValue: number = 0;
	// myGlobalArray: string[] = [];
	playerHand: Stock;
	boardLocationStocks: { [key: string]: Stock } = {};
	playerBoardCounters: { [key: string]: { [key in 'card_hand_nbr' | 'helium' | 'influence' | 'fleet_progress']: Counter } } = {};

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
		for( const player_id in gamedatas.players )
		{
			const player = gamedatas.players[player_id];
			const hand_count = gamedatas.player_hand_nbrs[player_id];
						
			const player_board_div = $('player_board_'+player_id);
			const div = `<div class="rr_player_board">
				<img src="https://x.boardgamearena.net/data/themereleases/220106-1001/img/common/hand.png" class="imgtext cardhandcount">
				<span id="card_hand_nbr_${player_id}" class="cardhandcount"></span>
				<div class="imgtext pbtrackericon heliumicon"></div>
				<span id="helium_tracker_${player_id}"></span>
				<div class="imgtext pbtrackericon influenceicon"></div>
				<span id="influence_tracker_${player_id}"></span>
				<div class="imgtext pbtrackericon fleeticon"></div>
				<span id="fleet_tracker_${player_id}"></span>
			</div>`
			if (player_board_div !== null) {
				dojo.place(div, player_board_div);
			}

			this.playerBoardCounters[player_id] = {
				card_hand_nbr: this.createCounter(`card_hand_nbr_${player_id}`, hand_count),
				helium: this.createCounter(`helium_tracker_${player_id}`, this.getTrackerCount(gamedatas.tokens, 'helium', player_id)),
				influence: this.createCounter(`influence_tracker_${player_id}`, this.getTrackerCount(gamedatas.tokens, 'influence', player_id)),
				fleet_progress: this.createCounter(`fleet_tracker_${player_id}`, this.getTrackerCount(gamedatas.tokens, 'fleet_progress', player_id)),
			};

			this.playerBoardCounters[player_id]
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

		dojo.setStyle("thedeckcard", {
			'backgroundImage': `url("${g_gamethemeurl}/img/mock_card.jpg")`,
			'backgroundSize': '134px 182px',
			'width': '134px',
			'height': '182px',
		});
		
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
		case 'playerTurn':
			break;
		case 'playerLeadPick':
			Object.entries(this.boardLocationStocks).forEach(
				([k, stock]) => {
					stock.unselectAll();
				}
			);
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	override onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch( stateName )
		{
		case 'playerTurn':
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
		case 'playerTurn':
			// TODO: Use constants for board location ids
			this.addActionButton('player_act_deploy_jupiter_button', _('Deploy to Jupiter'), () => this.onActLeadSelected(0));
			this.addActionButton('player_act_deploy_mars_button', _('Deploy to Mars'), () => this.onActLeadSelected(1));
			this.addActionButton('player_act_deploy_luna_button', _('Deploy to Luna'), () => this.onActLeadSelected(2));
			this.addActionButton('player_act_deploy_institute_button', _('Deploy to The Institute'), () => this.onActLeadSelected(3));
			this.addActionButton('player_act_scout_button', _('Scout'), 'onActScoutSelected');
			break;
		}
	}

	///////////////////////////////////////////////////
	//// Utility methods
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

	private getTrackerCount(tokens: { [key: string]: { [key: string]: number } }, tracker_type: string, player_id: string ): number | undefined
	{
		const token_info = tokens[`${tracker_type}_${player_id}`]!;
		return token_info['state'];
	}

	// TODO: This would be nice to add as a mixin to Counter (or maybe just Common)
	private createCounter(target: string | HTMLElement, value: number = 0) {
		const counter = new Counter();
		counter.create(target);
		counter.setValue(value);
		return counter;
	}

	onStockItemCreate( card_div: any, card_type_id: string, card_id: string ): void
	{
		dojo.place(`<span class="card_title_type">${card_id} [${card_type_id}]</span>`, card_div.id);
	}

	onStockItemSelected( control_name: string, item_id: string ): void 
	{
		console.log(`Stock ${control_name} selected ${item_id}`);
		const card_id = toint(item_id)!;

		if (this.gamedatas.gamestate.name == 'playerLeadPick') {
			if (this.playerHand.control_name == control_name && this.playerHand.isSelected(card_id)) {
				this.showMessage(_("Please select a card from a board location to pick up."), 'info');
				this.playerHand.unselectItem(card_id);
				return;
			}

			const stock = Object.entries(this.boardLocationStocks).find(
				([k, stock]) => stock.control_name == control_name
			)?.[1];
			if (stock === undefined) {
				console.warn(`Something went wrong and card location "${control_name}" was not found.`);
				return ;
			}

			if (!stock.isSelected(card_id)) {
				// This shouldn't happen, but only trigger when we are actually selecting the card.
				return;
			}

			const locationTopItem = stock.getAllItems().pop();
			if (locationTopItem === undefined || locationTopItem.id != card_id) {
				this.showMessage(_("You can only pickup the top card from a location! Please select a top card."),"error");
				return;
			}

			this.ajaxAction("actLeadPick", {
				card_id: card_id,
			}, (is_error) => {
				if (is_error) {
					stock.unselectItem(card_id);
				}
			});
		}
	}

	createStock( container_div_id: string ): Stock
	{
		var stock = new Stock();
		stock.create( this, $(container_div_id), 134, 182);
		//stock.backgroundSize = '134px 182px';
		stock.resizeItems(134, 182, 134, 182);
		stock.setSelectionMode(1);
		dojo.connect ( stock, 'onChangeSelection', this, 'onStockItemSelected' );

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

	// TODO: board_location_id can be it's own type for type safety
	onActLeadSelected( board_location_id: number ): void {
		const selectedItems = this.playerHand.getSelectedItems();
		if (selectedItems.length == 1 && selectedItems[0] !== undefined) {
			this.ajaxAction('actLead', {
				card_id: selectedItems[0].id,
				board_location_id: board_location_id, 
			});
		} else {
			this.showMessage(_("Lead action requires a single card selected in your hand to place on the board."),"error");
		}
	}

	onActScoutSelected(): void {
		console.log('scout selected');
	}
	
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
		this.subscribeNotif('cardDeployed', this.notif_cardDeployed);
		this.subscribeNotif('cardPicked', this.notif_cardPicked);
	}

	notif_cardDeployed( notif: NotifAs<'cardDeployed'> ) {
		const cardId = notif.args.card_id;
		const cardType = notif.args.card_type;
		const toStock = this.boardLocationStocks[notif.args.to_location];
		if (toStock === undefined) {
			console.warn(`Could not find location ${notif.args.to_location} for deployed card!`);
			return;
		}

		// MAYBE: Make this a function, when adding a new card on top, the weight should just equal the number of cards
		toStock.changeItemsWeight({
			[cardType]: toStock.count(),
		});

		if (notif.args.player_id == this.player_id) {
			toStock.addToStockWithId(cardType, cardId, this.playerHand.getItemDivId(cardId.toString()));
			this.playerHand.removeFromStockById(cardId);
		} else {
			toStock.addToStockWithId(cardType, cardId, `player_board_${notif.args.player_id}`);
		}

		this.playerBoardCounters[notif.args.player_id]?.card_hand_nbr.incValue(-1);
	}

	notif_cardPicked( notif: NotifAs<'cardPicked'>) {
		const fromStock = this.boardLocationStocks[notif.args.prev_location];
		if (fromStock === undefined) {
			console.warn(`Could not find location ${notif.args.prev_location} for picked card!`);
			return;
		}
		const card = fromStock.getItemById(notif.args.card_id);

		if (notif.args.player_id == this.player_id) {
			this.playerHand.addToStockWithId(card.type, card.id, fromStock.getItemDivId(card.id.toString()));
			fromStock.removeFromStockById(card.id);
		} else {
			fromStock.removeFromStockById(card.id, `player_board_${notif.args.player_id}`);
		}

		this.playerBoardCounters[notif.args.player_id]?.card_hand_nbr.incValue(1);

		// MAYBE: Make this a function, when removing a card from a weighted location, reset to default weight (-1)
		fromStock.changeItemsWeight({
			[card.type]: -1,
		});
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