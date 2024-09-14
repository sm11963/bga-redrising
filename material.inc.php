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
 * material.inc.php
 *
 * RedRisingSmiller game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


 if (!defined("MA_GAME")) {
    // guard since this included multiple times
    define("MA_GAME", 1);
  
    // Colors
    define("MA_CARD_COLOR_RED", 0);
    define("MA_CARD_COLOR_BROWN", 1);
    define("MA_CARD_COLOR_OBSIDIAN", 2);
    define("MA_CARD_COLOR_PINK", 3);
    define("MA_CARD_COLOR_GRAY", 4);
    define("MA_CARD_COLOR_BLUE", 5);
    define("MA_CARD_COLOR_YELLOW", 6);
    define("MA_CARD_COLOR_GREEN", 7);
    define("MA_CARD_COLOR_VIOLET", 8);
    define("MA_CARD_COLOR_ORANGE", 9);
    define("MA_CARD_COLOR_SILVER", 10);
    define("MA_CARD_COLOR_WHITE", 11);
    define("MA_CARD_COLOR_BRONZE", 12);
    define("MA_CARD_COLOR_GOLD", 13);

    // Houses
    define("MA_HOUSE_APOLLO", 0);
    define("MA_HOUSE_CERES", 1);
    define("MA_HOUSE_DIANA", 2);
    define("MA_HOUSE_JUPITER", 3);
    define("MA_HOUSE_MARS", 4);
    define("MA_HOUSE_MINERVA", 5);

    define("MA_BOARD_LOCATION_JUPITER", 0);
    define("MA_BOARD_LOCATION_MARS", 1);
    define("MA_BOARD_LOCATION_LUNA", 2);
    define("MA_BOARD_LOCATION_INSTITUTE", 3);
  }
  
   $this->colors = [
    MA_CARD_COLOR_RED => [
      'name' => clienttranslate('red'),
    ],
    MA_CARD_COLOR_BROWN => [
    'name' => clienttranslate('brown'),
    ],
    MA_CARD_COLOR_OBSIDIAN => [
      'name' => clienttranslate('obsidian'),
    ],
    MA_CARD_COLOR_PINK => [
    'name' => clienttranslate('pink'),
    ],
    MA_CARD_COLOR_GRAY => [
      'name' => clienttranslate('gray'),
    ],
    MA_CARD_COLOR_BLUE => [
      'name' => clienttranslate('blue'),
    ],
    MA_CARD_COLOR_YELLOW => [
      'name' => clienttranslate('yellow'),
    ],
    MA_CARD_COLOR_GREEN => [
      'name' => clienttranslate('green'),
    ],
    MA_CARD_COLOR_VIOLET => [
      'name' => clienttranslate('violet'),
    ],
    MA_CARD_COLOR_ORANGE => [
      'name' => clienttranslate('orange'),
    ],
    MA_CARD_COLOR_SILVER => [
      'name' => clienttranslate('silver'),
    ],
    MA_CARD_COLOR_WHITE => [
      'name' => clienttranslate('white'),
    ],
    MA_CARD_COLOR_BRONZE => [
      'name' => clienttranslate('bronze'),
    ],
    MA_CARD_COLOR_GOLD => [
      'name' => clienttranslate('gold'),
    ],
  ];

  // NOTE - if updating *colors*, make sure to update gameinfos.inc.php for player_colors as well!
  // TODO: Check if 'name_key' is used, was added but never used intially 
  $this->houses = [
    MA_HOUSE_APOLLO => [
      'name_key' => 'apollo',
      'name' => clienttranslate('apollo'),
      'color' => 'D7CA4F',
    ],
    MA_HOUSE_CERES => [
      'name_key' => 'ceres',
      'name' => clienttranslate('ceres'),
      'color' => '937A40',
    ],
    MA_HOUSE_DIANA => [
      'name_key' => 'diana',
      'name' => clienttranslate('diana'),
      'color' => '008D50',
    ],
    MA_HOUSE_JUPITER => [
      'name_key' => 'jupiter',
      'name' => clienttranslate('jupiter'),
      'color' => '007EAC',
    ],
    MA_HOUSE_MARS => [
      'name_key' => 'mars',
      'name' => clienttranslate('mars'),
      'color' => 'C13834',
    ],
    MA_HOUSE_MINERVA => [
      'name_key' => 'minerva',
      'name' => clienttranslate('minerva'),
      'color' => '692A64',
    ],
  ];

  $this->board_locations = [
    MA_BOARD_LOCATION_JUPITER => [
      'name_key' => 'jupiter',
      'name' => clienttranslate('JUPITER'),
      'color' => '0000FF',
    ],
    MA_BOARD_LOCATION_MARS => [
      'name_key' => 'mars',
      'name' => clienttranslate('MARS'),
      'color' => 'FF0000',
    ],
    MA_BOARD_LOCATION_LUNA => [
      'name_key' => 'luna',
      'name' => clienttranslate('LUNA'),
      'color' => '00FFFF',
    ],
    MA_BOARD_LOCATION_INSTITUTE => [
      'name_key' => 'institute',
      'name' => clienttranslate('THE INSTITUTE'),
      'color' => '00FF00',
    ],
  ];

  /**
   * Game tokens used (distinct from cards).
   * 
   * 'type'
   *    - tracker: Simple counter per player, starts at 0, may have a 'max' value.
   *    - token: Game piece to be assigned to a location (player or limbo)
   */
  $this->token_types = [
    'helium' => [
      'type' => 'tracker',
      'max' => null,
    ],
    'influence' => [
      'type' => 'tracker',
      'max' => 10,
    ],
    'fleet_progress' => [
      'type' => 'tracker',
      'max' => 10,
    ],
    'sovereign' => [
      'type' => 'token',
    ]
  ];





