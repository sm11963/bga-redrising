<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * RedRisingSmiller implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * redrisingsmiller.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */
declare(strict_types=1);

require_once(APP_GAMEMODULE_PATH . "module/table/table.game.php");

require_once ('modules/php/tokens.php');   

class RedRisingSmiller extends Table
{
    // Provided in material.inc.php
    protected $ma_houses, $ma_board_locations, $ma_token_types, $ma_colors;

    // Provided in .game.php
    private $tokens;   
    private $cards;

    /**
     * Your global variables labels:
     *
     * Here, you can assign labels to global variables you are using for this game. You can use any number of global
     * variables with IDs between 10 and 99. If your game has options (variants), you also have to associate here a
     * label to the corresponding ID in `gameoptions.inc.php`.
     *
     * NOTE: afterward, you can get/set the global variables with `getGameStateValue`, `setGameStateInitialValue` or
     * `setGameStateValue` functions.
     */
    public function __construct()
    {
        parent::__construct();

        $this->initGameStateLabels([]);

        $this->tokens = new Tokens();
        $this->cards = $this->getNew( "module.common.deck" );
        $this->cards->init( "card" );
    }

    /**
     * A Player has chosen to start a Lead action by deploying $card_id to $board_location_id
     */
    public function actLead(int $card_id, int $board_location_id): void
    {
        $this->checkAction('actLead');

        if ( !$this->checkBoardLocationId($board_location_id) ) {
            throw new BgaVisibleSystemException("Unexpected board location select for lead action");
        }

        $player_id = (int)$this->getActivePlayerId();
        $card = $this->cards->getCard( $card_id );

        if (is_null($card) || $card['location'] != 'hand' || $card['location_arg'] != $player_id) {
            throw new BgaUserException(_("The selected card must be in your hand!"));
        }

        $this->cards->insertCardOnExtremePosition( $card_id, "board_location_{$board_location_id}", true);
        $this->globals->set(G_LEAD_DEPLOYED_LOCATION, $board_location_id);

        // TODO: Message should say the location name instead of the location id
        // TODO: Message should say the card name instead of the card_id
        $this->notifyAllPlayers("cardDeployed", clienttranslate('${player_name} deploys ${card_type} to ${to_location}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_id" => $card_id,
            "card_type" => $card['type'],
            "to_location" => $board_location_id,
        ]);

        $this->gamestate->nextState("tLead");
    }

    /**
     * A Player has chosen to start a Scout action. 
     */
    public function actScout(): void
    {
        $this->checkAction('actScout');

        $player_id = (int)$this->getActivePlayerId();

        $card = $this->cards->getCardOnTop( 'deck' );

        // TODO: Message should say the card name instead of the card type
        $this->notifyAllPlayers("scoutReveal", clienttranslate('${player_name} chooses to Scout and reveals top card ${card_type}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_type" => $card['type'],
            "card_id" => $card['id'],
        ]);

        // at the end of the action, move to the next state
        $this->gamestate->nextState('tScout');
    }

    /**
     * As part of a lead turn, the a player has chosen to pick up $card_id from the board.
     */
    public function actLeadPick(int $card_id): void {
        $this->checkAction('actLeadPick');

        $player_id = (int)$this->getActivePlayerId();
        $board_location_prefix = 'board_location_';
        $card = $this->cards->getCard( $card_id );

        if (is_null($card) || !str_starts_with($card['location'], $board_location_prefix)) {
            throw new BgaUserException(_("The selected card must be currently on top of a location on the board!"));
        }

        $board_location_id = (int) substr($card['location'], strlen($board_location_prefix));
        
        $deployed_location = $this->globals->get(G_LEAD_DEPLOYED_LOCATION);
        if (!is_null($deployed_location) && $deployed_location == $board_location_id) {
            throw new BgaUserException(_("You cannot pickup from the location you deployed to this turn!"));
        }

        $locationTopCard = $this->cards->getCardOnTop( $card['location'] );

        if ($card_id != $locationTopCard['id']) {
            throw new BgaUserException(_("The selected card must be currently on top of a location on the board!"));
        }

        $this->cards->moveCard( $card_id, 'hand', $player_id );

        // TODO: Message should say the location name instead of the location id
        // TODO: Message should say the card name instead of the card type
        $this->notifyAllPlayers("cardPicked", clienttranslate('${player_name} picks up ${card_type} from location ${prev_location}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_id" => $card_id,
            "card_type" => $card['type'],
            "prev_location" => $board_location_id,
        ]);

        $this->gamestate->nextState("tLeadPick");
    }

    public function actScoutPlace(int $board_location_id): void {
        $this->checkAction('actScoutPlace');

        if ( !$this->checkBoardLocationId($board_location_id) ) {
            throw new BgaVisibleSystemException("Unexpected board location select for scout place action");
        }

        $player_id = (int)$this->getActivePlayerId();
        $card = $this->cards->getCardOnTop( 'deck' );

        $this->cards->insertCardOnExtremePosition( $card['id'], "board_location_{$board_location_id}", true);

        // TODO: Message should say the location name instead of the location id
        // TODO: Message should say the card name instead of the card_type
        $this->notifyAllPlayers("scoutPlace", clienttranslate('${player_name} places ${card_type} at location ${board_location_id}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_id" => $card['id'],
            "card_type" => $card['type'],
            "board_location_id" => $board_location_id,
        ]);

        $this->gamestate->nextState("tScoutPlace");
    }

    /**
     * Game state arguments, example content.
     *
     * This method returns some additional information that is very specific to the `playerTurn` game state.
     *
     * @return string[]
     * @see ./states.inc.php
     */
    public function argPlayerTurn(): array
    {
        // Get some values from the current game situation from the database.

        return [
            "playableCardsIds" => [1, 2],
        ];
    }

    /**
     * Compute and return the current game progression.
     *
     * The number returned must be an integer between 0 and 100.
     *
     * This method is called each time we are in a game state with the "updateGameProgression" property set to true.
     *
     * @return int
     * @see ./states.inc.php
     */
    public function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }

    /**
     * Game state action, example content.
     *
     * The action method of state `nextPlayer` is called everytime the current game state is set to `nextPlayer`.
     */
    public function stNextPlayer(): void {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // Clear turn specific state
        $this->globals->delete(G_LEAD_DEPLOYED_LOCATION);

        // Give some extra time to the active player when he completed an action
        $this->giveExtraTime($player_id);
        
        $this->activeNextPlayer();

        // Go to another gamestate
        // Here, we would detect if the game is over, and in this case use "endGame" transition instead 
        $this->gamestate->nextState("tNextPlayer");
    }

    /**
     * Migrate database.
     *
     * You don't have to care about this until your game has been published on BGA. Once your game is on BGA, this
     * method is called everytime the system detects a game running with your old database scheme. In this case, if you
     * change your database scheme, you just have to apply the needed changes in order to update the game database and
     * allow the game to continue to run with your new version.
     *
     * @param int $from_version
     * @return void
     */
    public function upgradeTableDb($from_version)
    {
//       if ($from_version <= 1404301345)
//       {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
//
//       if ($from_version <= 1405061421)
//       {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
    }

    /*
     * Gather all information about current game situation (visible by the current player).
     *
     * The method is called each time the game interface is displayed to a player, i.e.:
     *
     * - when the game starts
     * - when a player refreshes the game page (F5)
     */
    protected function getAllDatas()
    {
        $result = [];

        // WARNING: We must only return information visible by the current player.
        $current_player_id = (int) $this->getCurrentPlayerId();

        $result['players'] = $this->loadPlayers();
        $result['player_hand_nbrs'] = $this->cards->countCardsByLocationArgs( 'hand' );
        $result['ma_houses'] = $this->ma_houses;
        $result['ma_board_locations'] = $this->ma_board_locations;
        $result['tokens'] = $this->tokens->getAllTokensInfo();
        $result['hand'] = $this->cards->getCardsInLocation( 'hand', $current_player_id );
        $result['board_locations'] = [];
        foreach ($this->ma_board_locations as $location_id => $location_info) {
            $result['board_locations'][$location_id] = [
                'cards' => $this->cards->getCardsInLocation( "board_location_$location_id", null, 'location_arg' )
            ];
        }

        return $result;
    }

    /**
     * Returns the game name.
     *
     * IMPORTANT: Please do not modify.
     */
    protected function getGameName()
    {
        return "redrisingsmiller";
    }

    /**
     * This method is called only once, when a new game is launched. In this method, you must setup the game
     *  according to the game rules, so that the game is ready to be played.
     */
    protected function setupNewGame($players, $options = [])
    {
        $players = $this->initPlayers($players);

        $this->initTokens();

        $this->initCards();

        // Init game statistics.
        //
        // NOTE: statistics used in this file must be defined in your `stats.inc.php` file.

        // Dummy content.
        // $this->initStat("table", "table_teststat1", 0);
        // $this->initStat("player", "player_teststat1", 0);

        // TODO: Setup the initial game situation here.

        // Activate first player once everything has been initialized and ready.
        $this->activateFirstPlayer($players);
    }

    /**
     * Create all game tokens/trackers and initialize with starting state.
     */
    private function initTokens() {
        // MAYBE: Small optimization to just pass in players as a parameter instead of another DB query here.
        $players = $this->loadPlayersBasicInfos();

        $tokens = array ();
        foreach ( $this->ma_token_types as $token_type => $token_info ) {
            if ($token_info['type'] == 'tracker') {
                foreach ( array_keys($players) as $player_id ) {
                    $tokens [] = [
                        'key' => "{$token_type}_{$player_id}",
                        'state' => 0,
                    ];
                }
            } elseif ($token_info['type'] == 'token') {
                $tokens [] = [
                    'key' => "{$token_type}",
                    'location' => 'limbo',
                    'state' => 0,
                ];
            }
        }

        $this->tokens->createTokens($tokens, 'board');
    }

    public function debug_inc_tracker($type, $player_id) {
        $token_key = "{$type}_{$player_id}";
        $value = $this->tokens->getTokenState($token_key);
        $max_value = $this->ma_token_types[$type]['max'];
        if (is_null($max_value) || $value < $max_value) {
            $this->tokens->setTokenState($token_key, $value+1);
        }
    }

    public function debug_delete_cards() {
        $this->DbQuery("DELETE FROM card;");
    }

    /**
     * Create all cards and perform game setup (deal cards to players and locations on board)
     */
    private function initCards() {
        // MAYBE: Small optimization to just pass in players as a parameter instead of another DB query here.
        $players = $this->loadPlayers();

        $cards = array();
        for ($i = 0; $i < 112; $i++) {
            $cards [] = [
                'type' => $i,
                'type_arg' => $i,
                'nbr' => 1,
            ];
        }

        $this->cards->createCards( $cards, 'deck' );
        $this->cards->shuffle( 'deck' );

        foreach( $players as $player_id => $player ) {
            $num_cards = null;

            if ($player['house'] == MA_HOUSE_CERES) {
                $num_cards = 6;
            } else {
                $num_cards = 5;
            }

            $cards = $this->cards->pickCards( $num_cards, 'deck', $player_id );

            // Notify player about his cards
            $this->notifyPlayer( $player_id, 'newHand', '', ['cards' => $cards] );
        }

        foreach ( array_keys($this->ma_board_locations) as $location_id) {
            $cards = [];
            for ($i = 0; $i < 2; $i++) {
                $cards [] = $this->cards->pickCardForLocation( 'deck', "board_location_$location_id", $i);
            }
        }
    }
    
    /**
     * Intitialize the players.
     * 
     * Assign House, Color, and basic initial player info.
     */
    private function initPlayers($players): array {
        // Randomly order Houses, then pick a house for each player, this determines color and potentially the first player (Apollo).
        $available_houses = array_keys($this->ma_houses);
        shuffle($available_houses);

        foreach ($players as $player_id => $player) {
            $house = array_shift($available_houses);
            $players[$player_id]["player_house"] = $house;
            // Now you can access both $player_id and $player array
            $query_values[] = vsprintf("('%s', '%s', '%s', '%s', '%s', '%s')", [
                $player_id,
                $this->ma_houses[$house]['color'],
                $player["player_canal"],
                addslashes($player["player_name"]),
                addslashes($player["player_avatar"]),
                $house,
            ]);
        }

       static::DbQuery(
            sprintf(
                "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar, player_house) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reloadPlayersBasicInfos();
       
        return $players;
    }

    /**
     * Activate the first player.
     * 
     * Either the default implementation first player or, if exists, the player assigned House Apollo.
     */
    private function activateFirstPlayer($players) {
        // If we have a player with House Apollo, they go first; retain the same natural order with Apollo starting
        $apollo_player_id = array_key_first(array_filter($players, function($p) { 
            return $p["player_house"] == MA_HOUSE_APOLLO; 
        }));
        if (is_null($apollo_player_id)) {
            $this->activeNextPlayer();
        } else {
            $this->gamestate->changeActivePlayer($apollo_player_id);
        }
    }

    /**
     * This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
     * You can do whatever you want in order to make sure the turn of this player ends appropriately
     * (ex: pass).
     *
     * Important: your zombie code will be called when the player leaves the game. This action is triggered
     * from the main site and propagated to the gameserver from a server, not from a browser.
     * As a consequence, there is no current player associated to this action. In your zombieTurn function,
     * you must _never_ use `getCurrentPlayerId()` or `getCurrentPlayerName()`, otherwise it will fail with a
     * "Not logged" error message.
     *
     * @param array{ type: string, name: string } $state
     * @param int $active_player
     * @return void
     * @throws feException if the zombie mode is not supported at this game state.
     */
    protected function zombieTurn(array $state, int $active_player): void
    {
        $state_name = $state["name"];

        if ($state["type"] === "activeplayer") {
            switch ($state_name) {
                default:
                {
                    $this->gamestate->nextState("zombiePass");
                    break;
                }
            }

            return;
        }

        // Make sure player is in a non-blocking status for role turn.
        if ($state["type"] === "multipleactiveplayer") {
            $this->gamestate->setPlayerNonMultiactive($active_player, '');
            return;
        }

        throw new feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }

    /************************************************************************
     * General Utilities                                                    *
     ************************************************************************/
    
    /** 
     * Loads players from the DB with additional custom fields
     */
    private function loadPlayers(): array {
        return $this->getCollectionFromDb("SELECT player_id id, player_score score, player_no no, player_color color, player_house house FROM player");
    }
    
    /**
     * Checks that the given board_location_id is valid
     */
    private function checkBoardLocationId( $board_location_id ): bool {
        $values = [MA_BOARD_LOCATION_JUPITER, MA_BOARD_LOCATION_MARS, MA_BOARD_LOCATION_LUNA, MA_BOARD_LOCATION_INSTITUTE];
        return in_array( $board_location_id, $values );
    }

}
