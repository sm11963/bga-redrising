/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * RedRisingSmiller implementation : © Sam Miller sm11963@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

// If you have any imports/exports in this file, 'declare global' is access/merge your game specific types with framework types. 'export {};' is used to avoid possible confusion with imports/exports.
declare global {

	interface Card {
		id: string;
		type: string;
		location: string;
		location_arg: string;
	}

	/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
	interface NotifTypes {
		// [name: string]: any; // Uncomment to remove type safety on notification names and arguments
		'cardPicked': { player_id: string | number, player_name: string, card_id: number, prev_location: number };
		'cardDeployed': { player_id: string | number, player_name: string, card_type: number, card_id: number, to_location: number };
	}

	/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
	interface Gamedatas {
		// [key: string | number]: Record<keyof any, any>; // Uncomment to remove type safety on game state arguments
		player_hand_nbrs:  { [key: string]: number };
		ma_board_locations: { [key: string]: { [key: string]: any }};
		tokens: { [key: string]: { [key: string]: number } };
		board_locations: { [key: string]: 
			{
				cards: Card[]
			}
		};
		hand: Card[];
	}
}

export {}; // Force this file to be a module.