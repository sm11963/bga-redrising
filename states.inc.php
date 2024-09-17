<?php
declare(strict_types=1);
/*
 * THIS FILE HAS BEEN AUTOMATICALLY GENERATED. ANY CHANGES MADE DIRECTLY MAY BE OVERWRITTEN.
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * RedRisingSmiller implementation : © Sam Miller sm11963@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

/**
 * TYPE CHECKING ONLY, this function is never called.
 * If there are any undefined function errors here, you MUST rename the action within the game states file, or create the function in the game class.
 * If the function does not match the parameters correctly, you are either calling an invalid function, or you have incorrectly added parameters to a state function.
 */
if (false) {
	/** @var redrisingsmiller $game */
	$game->stNextPlayer();
}

$machinestates = array(
	1 => array(
		'name' => 'gameSetup',
		'description' => '',
		'type' => 'manager',
		'action' => 'stGameSetup',
		'transitions' => array(
			'' => 2,
		),
	),
	2 => array(
		'name' => 'playerTurn',
		'description' => clienttranslate('${actplayer} must lead or scout'),
		'descriptionmyturn' => clienttranslate('${you} must choose to lead (deploy) or scout'),
		'type' => 'activeplayer',
		'possibleactions' => ['actLead', 'actScout'],
		'transitions' => array(
			'tLead' => 3,
			'tScout' => 4,
		),
	),
	3 => array(
		'name' => 'playerLeadPick',
		'description' => clienttranslate('${actplayer} must pick up a card'),
		'descriptionmyturn' => clienttranslate('${you} must select a card to pickup'),
		'type' => 'activeplayer',
		'possibleactions' => ['actLeadPick'],
		'transitions' => array(
			'tLeadPick' => 5,
		),
	),
	4 => array(
		'name' => 'playerScoutPlace',
		'description' => clienttranslate('${actplayer} must place the scouted card'),
		'descriptionmyturn' => clienttranslate('${you} must choose where to place the card'),
		'type' => 'activeplayer',
		'possibleactions' => ['actScoutPlace'],
		'transitions' => array(
			'tScoutPlace' => 5,
		),
	),
	5 => array(
		'name' => 'nextPlayer',
		'description' => '',
		'type' => 'game',
		'action' => 'stNextPlayer',
		'updateGameProgression' => true,
		'transitions' => array(
			'tEndGame' => 99,
			'tNextPlayer' => 2,
		),
	),
	99 => array(
		'name' => 'gameEnd',
		'description' => clienttranslate('End of game'),
		'type' => 'manager',
		'action' => 'stGameEnd',
		'args' => 'argGameEnd',
	),
);