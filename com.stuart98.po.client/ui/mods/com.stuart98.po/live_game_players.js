
var POLoaded;

if ( ! POLoaded )
{

    POLoaded = true;

    function PO()
    {

        var buildVersion = decode( sessionStorage.build_version );

        var patchName = 'PO live_game_players.js';

        console.log(patchName + ' on ' + buildVersion + ' last tested on 89755');
        
        
        //LOAD commander common list
        loadScript("coui://ui/mods/com.stuart98.po/common.js");

        //see global.js
        var legioncomms = legionglobal.commanders;
        
        model.checkCommanders = function(commanders){
            try{
                var legioncount = 0;
                var specslength = 0;
                if (commanders !== undefined){
                    _.forOwn(commanders, function(value, key){
                        if(_.includes(legioncomms, value)){
                        legioncount++;
                        }
                        specslength++; 
                    });
                    if(legioncount == specslength){
                        return "legion";
                    }
                    else{
                        if(legioncount > 0 && legioncount < specslength){
                        return "mixed";
                        }
                        else{
                        return "vanilla";
                        }
                    }
                }
                else{
                    return "vanilla";
                }
            }
            catch(e){
                return "";
            }            
        }
        
        model.isLegionOrMixedOrVanilla = ko.computed(function () {
            try{
                var selectedspecs = model.player().commanders;
                return model.checkCommanders(selectedspecs);
            }
            catch(e){
                return "";
            }
        });

        model.isLegion = ko.computed(function (){
        if(model.isLegionOrMixedOrVanilla() === "legion"){
            return true;
        }
        else{
            return false;
        }
        });

        model.isMixed = ko.computed(function (){
        if(model.isLegionOrMixedOrVanilla() === "mixed"){
            return true;
        }
        else{
            return false;
        }
        });

        model.legionstart = ko.observable(false);

        model.player.subscribe(function(newval){
            if(!model.legionstart()){
                
                
                if(themesetting === "ON"){
                    var ui = "PO";
                    api.Panel.message("selection","POui");
                    api.Panel.message("planets","POui");
                    api.Panel.message("control_group_bar","POui");
                    api.Panel.message("econ","POui");
                    api.Panel.message("options_bar","POui");
                    api.Panel.message("build_hover","POui");
                    api.Panel.message("time_bar","POui");
                    api.Panel.message("menu","POui");
                    
                    //green pins
                    if(ui === "PO") {
                        var toggleImage = function(open) {
                            return open ? 'coui://ui/mods/com.stuart98.po/img/controls/green/pin_open.png' : 'coui://ui/mods/com.stuart98.po/img/controls/green/pin_closed.png';
                        };
                            
                        model.playerPanelToggleImage = ko.computed(function() { return toggleImage(model.showPlayerListPanel()); });
                        model.spectatorPanelToggleImage = ko.computed(function() { return toggleImage(model.showSpectatorPanel()); });

                            
                        $('img[src="coui://ui/main/shared/img/controls/green/pin_open.png"]').attr("src","coui://ui/mods/com.stuart98.po/img/controls/green/pin_open.png");
                        $('img[src="coui://ui/main/shared/img/controls/green/pin_closed.png"]').attr("src","coui://ui/mods/com.stuart98.po/img/controls/green/pin_closed.png");
                    }
                    
                    /*only need green pins
                    
                    if(ui === "legion"){
                        
                        var toggleImage = function(open) {
                            return open ? 'coui://ui/mods/com.pa.legion-expansion/img/controls/red/pin_open.png' : 'coui://ui/mods/com.pa.legion-expansion/img/controls/red/pin_closed.png';
                        };
                        
                        model.playerPanelToggleImage = ko.computed(function() { return toggleImage(model.showPlayerListPanel()); });
                        model.spectatorPanelToggleImage = ko.computed(function() { return toggleImage(model.showSpectatorPanel()); });

                        
                        $('img[src="coui://ui/main/shared/img/controls/pin_open.png"]').attr("src","coui://ui/mods/com.pa.legion-expansion/img/controls/red/pin_open.png");
                        $('img[src="coui://ui/main/shared/img/controls/pin_closed.png"]').attr("src","coui://ui/mods/com.pa.legion-expansion/img/controls/red/pin_closed.png");    
                    }
                    if(ui === "mixed"){
                        var toggleImage = function(open) {
                            return open ? 'coui://ui/mods/com.pa.legion-expansion/img/controls/purple/pin_open.png' : 'coui://ui/mods/com.pa.legion-expansion/img/controls/purple/pin_closed.png';
                        };
                        
                        model.playerPanelToggleImage = ko.computed(function() { return toggleImage(model.showPlayerListPanel()); });
                        model.spectatorPanelToggleImage = ko.computed(function() { return toggleImage(model.showSpectatorPanel()); });

                        
                        $('img[src="coui://ui/main/shared/img/controls/red/pin_open.png"]').attr("src","coui://ui/mods/com.pa.legion-expansion/img/controls/purple/pin_open.png");
                        $('img[src="coui://ui/main/shared/img/controls/red/pin_closed.png"]').attr("src","coui://ui/mods/com.pa.legion-expansion/img/controls/purple/pin_closed.png");                        
                        
                    }
                    */          
                    
                }
                model.legionstart(true);
            }
        });
        
        //load PO theme
        var themesetting = api.settings.isSet('ui','POThemeFunction',true) || 'ON';
        if(themesetting === "ON"){
            loadCSS("coui://ui/mods/com.stuart98.po/PO_players.css");
            $('.body_panel').addClass("PO");
        }
        
        //COMMANDER IMAGE
        model.commanderImage = function (d){
            var result="";
            switch(model.checkCommanders(d.commanders))
            {
                case "vanilla":
                    result = "coui://ui/main/game/live_game/img/players_list_panel/icon_player_outline.png";
                break;
                case "legion":
                    result = "coui://ui/mods/com.stuart98.po/img/icon_player_outline_l.png";
                break;
                case "mixed":
                    result = "coui://ui/mods/com.stuart98.po/img/icon_player_outline_m.png";
                break;
                default:
                    result ="coui://ui/main/game/live_game/img/players_list_panel/icon_player_outline.png"
                break;
            }
             return result;
        }
        
        model.commanderImageMaskLeg = function (d){
             if(model.checkCommanders(d.commanders) === "legion"){
                 return true;
             }
             else{
                 return false;
             }
        }
        
        model.commanderImageMaskMix = function (d){
             if(model.checkCommanders(d.commanders) === "mixed"){
                 return true;
             }
             else{
                 return false;
             }
        }
        
        $('img[src="img/players_list_panel/icon_player_outline.png"]').replaceWith('<img data-bind="attr:{src: model.commanderImage($data)}" />');
        $('.player_masked').attr("data-bind","style: { backgroundColor: color }, css: { legcom: model.commanderImageMaskLeg($data), mixcom: model.commanderImageMaskMix($data)}");
        
    }

    try
    {
        PO();
    }
    catch (e)
    {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}