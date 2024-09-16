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
define("cookbook/common", ["require", "exports", "dojo"], function (require, exports, dojo) {
    "use strict";
    var CommonMixin = function (Base) { return (function (_super) {
        __extends(Common, _super);
        function Common() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Common.prototype.attachToNewParentNoDestroy = function (mobile_in, new_parent_in, relation, place_position) {
            var mobile = $(mobile_in);
            var new_parent = $(new_parent_in);
            if (!mobile || !new_parent) {
                console.error("attachToNewParentNoDestroy: mobile or new_parent was not found on dom.", mobile_in, new_parent_in);
                return { l: NaN, t: NaN, w: NaN, h: NaN };
            }
            var src = dojo.position(mobile);
            if (place_position)
                mobile.style.position = place_position;
            dojo.place(mobile, new_parent, relation);
            mobile.offsetTop;
            var tgt = dojo.position(mobile);
            var box = dojo.marginBox(mobile);
            var cbox = dojo.contentBox(mobile);
            if (!box.t || !box.l || !box.w || !box.h || !cbox.w || !cbox.h) {
                console.error("attachToNewParentNoDestroy: box or cbox has an undefined value (t-l-w-h). This should not happen.", box, cbox);
                return box;
            }
            var left = box.l + src.x - tgt.x;
            var top = box.t + src.y - tgt.y;
            mobile.style.position = "absolute";
            mobile.style.left = left + "px";
            mobile.style.top = top + "px";
            box.l += box.w - cbox.w;
            box.t += box.h - cbox.h;
            mobile.offsetTop;
            return box;
        };
        Common.prototype.ajaxAction = function (action, args, callback, ajax_method) {
            if (!this.checkAction(action))
                return false;
            if (!args)
                args = {};
            if (!args.lock)
                args.lock = true;
            this.ajaxcall("/".concat(this.game_name, "/").concat(this.game_name, "/").concat(action, ".html"), args, this, function () { }, callback, ajax_method);
            return true;
        };
        Common.prototype.subscribeNotif = function (event, callback) {
            return dojo.subscribe(event, this, callback);
        };
        Common.prototype.addImageActionButton = function (id, label, method, destination, blinking, color, tooltip) {
            if (!color)
                color = "gray";
            this.addActionButton(id, label, method, destination, blinking, color);
            var div = $(id);
            if (div === null) {
                console.error("addImageActionButton: id was not found on dom", id);
                return null;
            }
            if (!(div instanceof HTMLElement)) {
                console.error("addImageActionButton: id was not an HTMLElement", id, div);
                return null;
            }
            dojo.style(div, "border", "none");
            dojo.addClass(div, "shadow bgaimagebutton");
            if (tooltip) {
                dojo.attr(div, "title", tooltip);
            }
            return div;
        };
        Common.prototype.isReadOnly = function () {
            return this.isSpectator || typeof g_replayFrom !== 'undefined' || g_archive_mode;
        };
        Common.prototype.scrollIntoViewAfter = function (target, delay) {
            if (this.instantaneousMode)
                return;
            var target_div = $(target);
            if (target_div === null) {
                console.error("scrollIntoViewAfter: target was not found on dom", target);
                return;
            }
            if (typeof g_replayFrom != "undefined" || !delay || delay <= 0) {
                target_div.scrollIntoView();
                return;
            }
            setTimeout(function () {
                target_div.scrollIntoView({ behavior: "smooth", block: "center" });
            }, delay);
        };
        Common.prototype.divYou = function () {
            return this.divColoredPlayer(this.player_id, __("lang_mainsite", "You"));
        };
        Common.prototype.divColoredPlayer = function (player_id, text) {
            var player = this.gamedatas.players[player_id];
            if (player === undefined)
                return "--unknown player--";
            return "<span style=\"color:".concat(player.color, ";background-color:#").concat(player.color_back, ";\">").concat(text !== null && text !== void 0 ? text : player.name, "</span>");
        };
        Common.prototype.setMainTitle = function (html) {
            $('pagemaintitletext').innerHTML = html;
        };
        Common.prototype.setDescriptionOnMyTurn = function (description) {
            this.gamedatas.gamestate.descriptionmyturn = description;
            var tpl = dojo.clone(this.gamedatas.gamestate.args);
            if (tpl === null)
                tpl = {};
            if (this.isCurrentPlayerActive() && description !== null)
                tpl.you = this.divYou();
            var title = this.format_string_recursive(description, tpl);
            this.setMainTitle(title !== null && title !== void 0 ? title : '');
        };
        Common.prototype.addPreferenceListener = function (callback) {
            var _this = this;
            dojo.query('.preference_control').on('change', function (e) {
                var _a;
                var target = e.target;
                if (!(target instanceof HTMLSelectElement)) {
                    console.error("Preference control class is not a valid element to be listening to events from. The target of the event does not have an id.", e.target);
                    return;
                }
                var match = (_a = target.id.match(/^preference_[cf]ontrol_(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1];
                if (!match)
                    return;
                var matchId = parseInt(match);
                if (isNaN(matchId)) {
                    console.error("Preference control id was not a valid number.", match);
                    return;
                }
                var pref = _this.prefs[matchId];
                if (!pref) {
                    console.warn("Preference was changed but somehow the preference id was not found.", matchId, _this.prefs);
                    return;
                }
                var value = target.value;
                if (!pref.values[value]) {
                    console.warn("Preference value was changed but somehow the value is not a valid value.", value, pref.values);
                }
                pref.value = value;
                callback(matchId);
            });
        };
        Common.prototype.onScriptError = function (error, url, line) {
            if (this.page_is_unloading)
                return;
            console.error("Script error:", error);
            _super.prototype.onScriptError.call(this, error, url, line);
        };
        Common.prototype.showError = function (log, args) {
            if (args === void 0) { args = {}; }
            args['you'] = this.divYou();
            var message = this.format_string_recursive(log, args);
            this.showMessage(message, "error");
            console.error(message);
        };
        Common.prototype.getPlayerColor = function (player_id) {
            var _a, _b;
            return (_b = (_a = this.gamedatas.players[player_id]) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : null;
        };
        Common.prototype.getPlayerName = function (player_id) {
            var _a, _b;
            return (_b = (_a = this.gamedatas.players[player_id]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
        };
        Common.prototype.getPlayerFromColor = function (color) {
            for (var id in this.gamedatas.players) {
                var player = this.gamedatas.players[id];
                if ((player === null || player === void 0 ? void 0 : player.color) === color)
                    return player;
            }
            return null;
        };
        Common.prototype.getPlayerFromName = function (name) {
            for (var id in this.gamedatas.players) {
                var player = this.gamedatas.players[id];
                if ((player === null || player === void 0 ? void 0 : player.name) === name)
                    return player;
            }
            return null;
        };
        return Common;
    }(Base)); };
    return CommonMixin;
});
define("bgagame/redrisingsmiller", ["require", "exports", "ebg/core/gamegui", "ebg/stock", "cookbook/common", "ebg/counter"], function (require, exports, Gamegui, Stock, CommonMixer) {
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
                case 'playerLeadPick':
                    Object.entries(this.boardLocationStocks).forEach(function (_a) {
                        var k = _a[0], stock = _a[1];
                        stock.unselectAll();
                    });
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
            var _this = this;
            console.log('onUpdateActionButtons: ' + stateName, args);
            if (!this.isCurrentPlayerActive())
                return;
            switch (stateName) {
                case 'playerTurn':
                    this.addActionButton('player_act_deploy_jupiter_button', _('Deploy to Jupiter'), function () { return _this.onActLeadSelected(0); });
                    this.addActionButton('player_act_deploy_mars_button', _('Deploy to Mars'), function () { return _this.onActLeadSelected(1); });
                    this.addActionButton('player_act_deploy_luna_button', _('Deploy to Luna'), function () { return _this.onActLeadSelected(2); });
                    this.addActionButton('player_act_deploy_institute_button', _('Deploy to The Institute'), function () { return _this.onActLeadSelected(3); });
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
        RedRisingSmiller.prototype.onStockItemSelected = function (control_name, item_id) {
            var _a;
            console.log("Stock ".concat(control_name, " selected ").concat(item_id));
            var card_id = toint(item_id);
            if (this.gamedatas.gamestate.name == 'playerLeadPick') {
                if (this.playerHand.control_name == control_name && this.playerHand.isSelected(card_id)) {
                    this.showMessage(_("Please select a card from a board location to pick up."), 'info');
                    this.playerHand.unselectItem(card_id);
                    return;
                }
                var stock_1 = (_a = Object.entries(this.boardLocationStocks).find(function (_a) {
                    var k = _a[0], stock = _a[1];
                    return stock.control_name == control_name;
                })) === null || _a === void 0 ? void 0 : _a[1];
                if (stock_1 === undefined) {
                    console.warn("Something went wrong and card location \"".concat(control_name, "\" was not found."));
                    return;
                }
                if (!stock_1.isSelected(card_id)) {
                    return;
                }
                var locationTopItem = stock_1.getAllItems().pop();
                if (locationTopItem === undefined || locationTopItem.id != card_id) {
                    this.showMessage(_("You can only pickup the top card from a location! Please select a top card."), "error");
                    return;
                }
                this.ajaxAction("actLeadPick", {
                    card_id: card_id,
                }, function (is_error) {
                    if (is_error) {
                        stock_1.unselectItem(card_id);
                    }
                });
            }
        };
        RedRisingSmiller.prototype.createStock = function (container_div_id) {
            var stock = new Stock();
            stock.create(this, $(container_div_id), 134, 182);
            stock.resizeItems(134, 182, 134, 182);
            stock.setSelectionMode(1);
            dojo.connect(stock, 'onChangeSelection', this, 'onStockItemSelected');
            for (var i = 0; i < 112; i++) {
                stock.addItemType(i, i, g_gamethemeurl + 'img/mock_card.jpg', 0);
            }
            stock.onItemCreate = dojo.hitch(this, 'onStockItemCreate');
            return stock;
        };
        RedRisingSmiller.prototype.onActLeadSelected = function (board_location_id) {
            var selectedItems = this.playerHand.getSelectedItems();
            if (selectedItems.length == 1 && selectedItems[0] !== undefined) {
                this.ajaxAction('actLead', {
                    card_id: selectedItems[0].id,
                    board_location_id: board_location_id,
                });
            }
            else {
                this.showMessage(_("Lead action requires a single card selected in your hand to place on the board."), "error");
            }
        };
        RedRisingSmiller.prototype.onActScoutSelected = function () {
            console.log('scout selected');
        };
        RedRisingSmiller.prototype.setupNotifications = function () {
            console.log('notifications subscriptions setup');
            this.subscribeNotif('cardDeployed', this.notif_cardDeployed);
            this.subscribeNotif('cardPicked', this.notif_cardPicked);
        };
        RedRisingSmiller.prototype.notif_cardDeployed = function (notif) {
            var _a;
            var cardId = notif.args.card_id;
            var cardType = notif.args.card_type;
            var toStock = this.boardLocationStocks[notif.args.to_location];
            if (toStock === undefined) {
                console.warn("Could not find location ".concat(notif.args.to_location, " for deployed card!"));
                return;
            }
            toStock.changeItemsWeight((_a = {},
                _a[cardType] = toStock.count(),
                _a));
            if (notif.args.player_id == this.player_id) {
                toStock.addToStockWithId(cardType, cardId, this.playerHand.getItemDivId(cardId.toString()));
                this.playerHand.removeFromStockById(cardId);
            }
            else {
                toStock.addToStockWithId(cardType, cardId, "player_board_".concat(notif.args.player_id));
            }
        };
        RedRisingSmiller.prototype.notif_cardPicked = function (notif) {
            var _a;
            var fromStock = this.boardLocationStocks[notif.args.prev_location];
            if (fromStock === undefined) {
                console.warn("Could not find location ".concat(notif.args.prev_location, " for picked card!"));
                return;
            }
            var card = fromStock.getItemById(notif.args.card_id);
            if (notif.args.player_id == this.player_id) {
                this.playerHand.addToStockWithId(card.type, card.id, fromStock.getItemDivId(card.id.toString()));
                fromStock.removeFromStockById(card.id);
            }
            else {
                fromStock.removeFromStockById(card.id, "player_board_".concat(notif.args.player_id));
            }
            fromStock.changeItemsWeight((_a = {},
                _a[card.type] = -1,
                _a));
        };
        return RedRisingSmiller;
    }(CommonMixer(Gamegui)));
    dojo.setObject("bgagame.redrisingsmiller", RedRisingSmiller);
});
