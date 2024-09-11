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
  $this->houses = [
    MA_HOUSE_APOLLO => [
        'name' => clienttranslate('apollo'),
        'color' => 'D7CA4F',
    ],
    MA_HOUSE_CERES => [
        'name' => clienttranslate('ceres'),
        'color' => '937A40',
    ],
    MA_HOUSE_DIANA => [
        'name' => clienttranslate('diana'),
        'color' => '008D50',
      ],
    MA_HOUSE_JUPITER => [
        'name' => clienttranslate('jupiter'),
        'color' => '007EAC',
      ],
    MA_HOUSE_MARS => [
        'name' => clienttranslate('mars'),
        'color' => 'C13834',
    ],
    MA_HOUSE_MINERVA => [
        'name' => clienttranslate('minerva'),
        'color' => '692A64',
      ],
  ];





