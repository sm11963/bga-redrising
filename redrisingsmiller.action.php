<?php
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

class action_redrisingsmiller extends APP_GameAction
{
	/** @var redrisingsmiller $game */
	protected $game; // Enforces functions exist on Table class

	// Constructor: please do not modify
	public function __default()
	{
		if (self::isArg('notifwindow')) {
			$this->view = "common_notifwindow";
			$this->viewArgs['table'] = self::getArg("table", AT_posint, true);
		} else {
			$this->view = "redrisingsmiller_redrisingsmiller";
			self::trace("Complete reinitialization of board game");
		}
	}

	public function actLead()
	{
		self::setAjaxMode();

		/** @var int $card_id */
		$card_id = self::getArg('card_id', AT_int, true);
		/** @var int $board_location_id */
		$board_location_id = self::getArg('board_location_id', AT_int, true);

		$this->game->actLead( $card_id, $board_location_id );
		self::ajaxResponse();
	}

	public function actScout()
	{
		self::setAjaxMode();

		$this->game->actScout(  );
		self::ajaxResponse();
	}

	public function actLeadPick()
	{
		self::setAjaxMode();

		/** @var int $card_id */
		$card_id = self::getArg('card_id', AT_int, true);

		$this->game->actLeadPick( $card_id );
		self::ajaxResponse();
	}

	public function actScoutPlace()
	{
		self::setAjaxMode();

		/** @var int $board_location_id */
		$board_location_id = self::getArg('board_location_id', AT_int, true);

		$this->game->actScoutPlace( $board_location_id );
		self::ajaxResponse();
	}
}