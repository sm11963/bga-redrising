var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("bgagame/redrisingsmiller", ["require", "exports", "ebg/core/gamegui", "ebg/stock", "ebg/counter"], function (require, exports, Gamegui, Stock) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RedRisingSmiller = (function (_super) {
        __extends(RedRisingSmiller, _super);
        function RedRisingSmiller() {
            var _this = _super.call(this) || this;
            _this.boardLocationStocks = {};
            console.log('redrisingsmiller constructor');
            _this.playerHand = _this.createStock('myhand');
            return _this;
        }
        RedRisingSmiller.prototype.setup = function (gamedatas) {
            var _a;
            console.log("Starting game setup");
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
                var hand_count = gamedatas.player_hand_nbrs[player_id];
                var player_board_div = $('player_board_' + player_id);
                var div = "<div class=\"rr_player_board\">\n\t\t\t\t<img src=\"https://x.boardgamearena.net/data/themereleases/220106-1001/img/common/hand.png\" class=\"imgtext cardhandcount\">\n\t\t\t\t<span id=\"card_hand_nbr_".concat(player_id, "\" class=\"cardhandcount\">").concat(hand_count, "</span>\n\t\t\t\t<div class=\"imgtext pbtrackericon heliumicon\"></div>\n\t\t\t\t<span id=\"helium_tracker_").concat(player_id, "\">").concat(this.getTrackerCount(gamedatas.tokens, 'helium', player_id), "</span>\n\t\t\t\t<div class=\"imgtext pbtrackericon influenceicon\"></div>\n\t\t\t\t<span id=\"influence_tracker_").concat(player_id, "\">").concat(this.getTrackerCount(gamedatas.tokens, 'influence', player_id), "</span>\n\t\t\t\t<div class=\"imgtext pbtrackericon fleeticon\"></div>\n\t\t\t\t<span id=\"fleet_tracker_").concat(player_id, "\">").concat(this.getTrackerCount(gamedatas.tokens, 'fleet_progress', player_id), "</span>\n\t\t\t</div>");
                if (player_board_div !== null) {
                    dojo.place(div, player_board_div);
                }
            }
            for (var location_id in gamedatas.ma_board_locations) {
                var location_info = gamedatas.ma_board_locations[location_id];
                var stock = this.createStock("location_".concat(location_info['name_key'], "_cards"));
                stock.autowidth = false;
                stock.use_vertical_overlap_as_offset = false;
                stock.vertical_overlap = 75;
                stock.horizontal_overlap = -1;
                stock.item_margin = 0;
                this.boardLocationStocks[location_id] = stock;
                var location_cards = gamedatas.board_locations[location_id].cards;
                var weights = {};
                for (var i in location_cards) {
                    var card = location_cards[i];
                    weights[toint(card.type)] = toint(card.location_arg);
                    stock.addToStockWithId(toint(card.type), toint(card.id));
                }
                for (var i in stock.item_type) {
                    weights[i] = (_a = weights[i]) !== null && _a !== void 0 ? _a : -1;
                }
                stock.changeItemsWeight(weights);
            }
            for (var i in gamedatas.hand) {
                var card = gamedatas.hand[i];
                this.playerHand.addToStockWithId(toint(card.type), toint(card.id));
            }
            this.setupNotifications();
            console.log("Ending game setup");
        };
        RedRisingSmiller.prototype.onEnteringState = function (stateName, args) {
            console.log('Entering state: ' + stateName);
            switch (stateName) {
                case 'playerTurn':
                    break;
            }
        };
        RedRisingSmiller.prototype.onLeavingState = function (stateName) {
            console.log('Leaving state: ' + stateName);
            switch (stateName) {
                case 'playerTurn':
                    break;
            }
        };
        RedRisingSmiller.prototype.onUpdateActionButtons = function (stateName, args) {
            console.log('onUpdateActionButtons: ' + stateName, args);
            if (!this.isCurrentPlayerActive())
                return;
            switch (stateName) {
                case 'playerTurn':
                    this.addActionButton('player_act_lead_button', _('Lead'), 'onActLeadSelected');
                    this.addActionButton('player_act_scout_button', _('Scout'), 'onActScoutSelected');
                    break;
            }
        };
        RedRisingSmiller.prototype.getTrackerCount = function (tokens, tracker_type, player_id) {
            var token_info = tokens["".concat(tracker_type, "_").concat(player_id)];
            return token_info['state'];
        };
        RedRisingSmiller.prototype.onStockItemCreate = function (card_div, card_type_id, card_id) {
            dojo.place("<span class=\"card_title_type\">".concat(card_id, " [").concat(card_type_id, "]</span>"), card_div.id);
        };
        RedRisingSmiller.prototype.createStock = function (container_div_id) {
            var stock = new Stock();
            stock.create(this, $(container_div_id), 134, 182);
            stock.resizeItems(134, 182, 134, 182);
            for (var i = 0; i < 112; i++) {
                stock.addItemType(i, i, g_gamethemeurl + 'img/mock_card.jpg', 0);
            }
            stock.onItemCreate = dojo.hitch(this, 'onStockItemCreate');
            return stock;
        };
        RedRisingSmiller.prototype.onActLeadSelected = function () {
            console.log('lead selected');
            var selectedItems = this.playerHand.getSelectedItems();
            if (selectedItems.length != 1) {
                this.showMessage(_("Lead action requires a single card selected in your hand to place on the board."), 'error');
                return;
            }
            this.bgaPerformAction('actLead', {
                card_id: selectedItems[0].id,
                board_location_id: 0
            });
        };
        RedRisingSmiller.prototype.onActScoutSelected = function () {
            console.log('scout selected');
        };
        RedRisingSmiller.prototype.setupNotifications = function () {
            console.log('notifications subscriptions setup');
        };
        return RedRisingSmiller;
    }(Gamegui));
    dojo.setObject("bgagame.redrisingsmiller", RedRisingSmiller);
});
