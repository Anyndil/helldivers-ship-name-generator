window.hdsng = (function () {
    // Variables
    var savedNameList = [];

    var namePrefix = ["Adjudicator", "Advocate", "Aegis", "Agent", "Arbiter", "Banner", "Beacon", "Blade", "Bringer", "Champion",
        "Citizen", "Claw", "Colossus", "Comptroller", "Courier", "Custodian", "Dawn", "Defender", "Diamond", "Distributor", "Dream",
        "Elected Representative", "Emperor", "Executor", "Eye", "Father", "Fist", "Flame", "Force", "Forerunner", "Founding Father",
        "Gauntlet", "Giant", "Guardian", "Halo", "Hammer", "Harbinger", "Herald", "Judge", "Keeper", "King", "Knight", "Lady",
        "Legislator", "Leviathan", "Light", "Lord", "Magistrate", "Marshal", "Martyr", "Mirror", "Mother", "Octagon", "Ombudsman",
        "Panther", "Paragon", "Patriot", "Pledge", "Power", "Precursor", "Pride", "Prince", "Princess", "Progenitor", "Prophet",
        "Protector", "Purveyor", "Queen", "Ranger", "Reign", "Representative", "Senator", "Sentinel", "Shield", "Soldier", "Song",
        "Soul", "Sovereign", "Spear", "Stallion", "Star", "Steward", "Superintendent", "Sword", "Titan", "Triumph", "Warrior",
        "Whisper", "Will", "Wings"];

    var nameSuffix = ["of Allegiance", "of Audacity", "of Authority", "of Battle", "of Benevolence", "of Conquest", "of Conviction",
        "of Conviviality", "of Courage", "of Dawn", "of Democracy", "of Destiny", "of Destruction", "of Determination", "of Equality",
        "of Eternity", "of Family Values", "of Fortitude", "of Freedom", "of Glory", "of Gold", "of Honor", "of Humankind",
        "of Independence", "of Individual Merit", "of Integrity", "of Iron", "of Judgement", "of Justice", "of Law", "of Liberty",
        "of Mercy", "of Midnight", "of Morality", "of Morning", "of Opportunity", "of Patriotism", "of Peace", "of Perseverance",
        "of Pride", "of Redemption", "of Science", "of Self-Determination", "of Selfless Service", "of Serenity", "of Starlight",
        "of Steel", "of Super Earth", "of Supremacy", "of the Constitution", "of the People", "of the Regime", "of the Stars",
        "of the State", "of Truth", "of Twilight", "of Victory", "of Vigilance", "of War", "of Wrath"];

    //Initialization Method
    function _init() {
        console.log(" --> hdsng.init(...)");

        // Pull History
        var nameHistory = Cookies.get('savedNames');

        if(nameHistory !== undefined) {
            if(nameHistory.includes(',')) { savedNameList = nameHistory.split(","); }
            else { savedNameList[0] = nameHistory; }

            jQuery.each(savedNameList, _addNameToSavedList);
        }

        // Internal Function Calls Here
        _bindElements();
    
        // List Functions
        console.log(" --> Custom Script(s) Loaded...");
        console.log("    --> hdsng.generateName()");
    }

    // Bind Page Elements to JavaScript Functions
    function _bindElements() {
        // Buttons
        jQuery("#generate-button").click(_generateNames);

        // Inputs
        jQuery("#names").keypress(_enforceDigitOnlyInput);
    }

    function _enforceDigitOnlyInput(e) {
        var charCode = (e.which) ? e.which : e.keyCode;
    
        if (String.fromCharCode(charCode).match(/[^0-9]/g)) return false;  
    }

    function _generateNames() {
        var names = [];
        var iterations = parseInt(jQuery("#names").val());

        if(isNaN(iterations)) { iterations = 10; }

        for (var i=0; i<iterations; i++) {
            var prefix = _getRandomPrefix();
            var suffix = _getRandomSuffix();

            names[i] = prefix + " " + suffix;
        }

        names.sort();

        jQuery("div.name-list").removeClass("hidden");
        jQuery("#random-names").empty();
        jQuery.each(names, _addNameToRandomList);
    }

    function _getRandomPrefix() { return namePrefix[chance.natural({ min: 0, max: (namePrefix.length - 1) })]; }
    function _getRandomSuffix() { return nameSuffix[chance.natural({ min: 0, max: (nameSuffix.length - 1) })]; }

    function _addNameToRandomList(i, text) {
        _addNameToList(text, "#random-names");
    }

    function _addNameToSavedList(i, text) {
        _addNameToList(text, "#saved-names");
    }

    function _addNameToList(text, target) {
        var textWrapper = jQuery("<div class=\"col s9 text\"></div>").append(text);

        var saveButton = jQuery("<a class=\"btn-floating btn-small waves-effect waves-light grey save-button\"><i class=\"material-icons\">chevron_right</i></a>");
        var deleteButton = jQuery("<a class=\"btn-floating btn-small waves-effect waves-light grey delete-button\"><i class=\"material-icons\">delete_forever</i></a>");
        var buttonWrapper = jQuery("<div class=\"col s3\"></div>").append(deleteButton).append(saveButton);
        
        var row = jQuery("<div class=\"row\"></div>").append(textWrapper).append(buttonWrapper);

        // Bind Actions
        saveButton.click(_saveName);
        deleteButton.click(_deleteName);

        jQuery(target).append(row);
    }

    function _saveName() {
        var row = jQuery(this).closest("div.row");
        var text = row.find("div.text").text();

        if(jQuery("#saved-names div.text:contains(" + text + ")").length > 0) {
            row.remove();
            return;
        }
        
        savedNameList[savedNameList.length] = text;
        savedNameList.sort();
        _saveCookie();

        row.find("a.save-button").remove();

        jQuery("#saved-names").append(row);

        _sortNameList();
    }

    function _deleteName() {
        var text = jQuery(this).closest("div.row").find("div.text").text();

        // Remove from array
        savedNameList = savedNameList.filter(item => item !== text);
        _saveCookie();

        jQuery(this).closest("div.row").remove();
    }

    function _sortNameList() {
        var container = jQuery("#saved-names");

        // Get all rows within the container
        var divs = container.children("div.row");

        // Sort the DIVs using the compareText function
        divs.sort(_compareText);

        // Re-append the DIVs in the sorted order
        container.append(divs);
    }

    // Function to compare DIVs based on text content
    function _compareText(a, b) {
        // Ignore case for alphabetic sorting
        var textA = $(a).text().toUpperCase();
        var textB = $(b).text().toUpperCase();

        // Add optional sorting criteria after uppercasing
        // For example, to sort numbers numerically:
        if (!isNaN(textA) && !isNaN(textB)) {
            return textA - textB;
        }

        // Default alphabetical sorting
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }

    function _saveCookie() {
        if(savedNameList.length > 0) {
            Cookies.set("savedNames", savedNameList.join(","), { expires: 365 });
        }
        else {
            Cookies.remove("savedNames");
        }
    }

    // Return Methods and Values
    return {
        init: _init,
        generateNames: _generateNames
    };
})();

jQuery(document).ready(hdsng.init);

