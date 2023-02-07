/*
Leveling Monster Stats Simulator by TG22 (c) 2018-2019
Characters and items database file
*/


var CHARACTERS = 
[
	new GameCharacter("Ralph",[517,0,16,16,16,16,32,32],[7917,0,138,138,138,138,277,277]), //Name,[lv1 stats],[lv99 stats]
	new GameCharacter("Donna",[384,111,12,12,18,19,28,28],[5541,1539,137,138,196,182,341,339]),
	new GameCharacter("Samantha",[483,0,17,16,19,14,37,37],[6515,0,163,173,189,126,436,418]),
	new GameCharacter("Sarah",[588,0,21,18,10,12,32,27],[7956,0,218,190,114,106,277,337]),
	new GameCharacter("Terra",[315,138,11,14,21,13,21,32],[5086,1691,100,130,205,137,283,399]),
	new GameCharacter("Angelica",[450,0,15,15,17,15,22,32],[6833,0,174,156,168,161,289,385]),
	new GameCharacter("Rhea",[407,0,18,19,12,20,17,17],[6156,0,180,196,107,206,235,239]),
	new GameCharacter("Alena",[301,0,22,13,11,13,36,25],[5534,0,202,139,105,127,415,302]),
	new GameCharacter("Noemi",[489,0,18,14,10,11,35,36],[6638,0,180,136,117,108,421,416]),
	new GameCharacter("Naitay",[682,0,22,14,11,12,35,15],[8788,0,208,132,104,123,412,230]),
	new GameCharacter("Kathleen",[558,98,21,19,20,19,20,15],[7839,1349,216,186,214,178,292,221]),
	new GameCharacter("Jessica",[378,0,19,13,10,11,39,27],[5249,0,175,126,111,107,446,319]),
	new GameCharacter("Vanessa",[667,0,17,21,11,15,21,29],[8819,0,160,221,122,151,256,309]),
	new GameCharacter("Chinua",[315,95,19,11,22,11,25,20],[5086,1328,189,112,223,111,336,259]),
	new GameCharacter("Adeline",[450,90,14,14,14,16,34,29],[5350,1070,135,143,137,155,388,304])
];

var THIEFNAME = "Noemi";
var SCOUTNAME = "Jessica";

var twohanded = new GameEffect("nooh",0,false);

var ITEMS = 
[
	//ID, Slot, Name, [effects(Stat,increase value,is_percent)]
	new GameEquipment("w1","mh","Hand Axe",[new GameEffect("atk",15,false), new GameEffect("aspd",-5,false)]),
	new GameEquipment("w2","mh","Battle Axe",[new GameEffect("atk",30,false), new GameEffect("aspd",-5,false)]),
	new GameEquipment("w3","mh","Bardiche",[new GameEffect("atk",50,false), new GameEffect("aspd",-5,false)]),
	new GameEquipment("w4","mh","Mythril Axe",[new GameEffect("atk",70,false)]),
	new GameEquipment("w5","mh","Orichalcum Axe",[new GameEffect("atk",90,false), new GameEffect("aspd",-5,false)]),

	new GameEquipment("w66","mh","Orcish Axe",[new GameEffect("atk",50,false), new GameEffect("agi",-10,true),twohanded, new GameEffect("aspd",-20,false) ]),

	new GameEquipment("w7","mh","Cestus",[new GameEffect("atk",4,false), twohanded]),
	new GameEquipment("w8","mh","Bagna",[new GameEffect("atk",8,false), twohanded]),
	new GameEquipment("w9","mh","Iron Claw",[new GameEffect("atk",16,false), twohanded]),
	new GameEquipment("w10","mh","Mithril Claw",[new GameEffect("atk",28,false), twohanded]),
	new GameEquipment("w11","mh","Orichalcum Fang",[new GameEffect("atk",43,false), twohanded]),

	new GameEquipment("w13","mh","Spear",[new GameEffect("atk",16,false), twohanded]),
	new GameEquipment("w14","mh","Partisan",[new GameEffect("atk",32,false), twohanded, new GameEffect("aspd",-3,false)]),
	new GameEquipment("w15","mh","Halberd",[new GameEffect("atk",50,false), twohanded, new GameEffect("aspd",-3,false)]),
	new GameEquipment("w16","mh","Mythril Spear",[new GameEffect("atk",64,false), twohanded]),
	new GameEquipment("w17","mh","Orichalcum Lance",[new GameEffect("atk",100,false), new GameEffect("mdf",5,false), twohanded, new GameEffect("aspd",-3,false)]),
	new GameEquipment("w85","mh","Poisoned Orichalcum Lance",[new GameEffect("atk",90,false)]),

	new GameEquipment("w19","mh","Short Sword",[new GameEffect("atk",10,false)]),
	new GameEquipment("w20","mh","Long Sword",[new GameEffect("atk",22,false)]),
	new GameEquipment("w21","mh","Falcion",[new GameEffect("atk",35,false)]),
	new GameEquipment("w22","mh","Mythril Sword",[new GameEffect("atk",50,false)]),
	new GameEquipment("w78","mh","Poisoned Mythril Sword",[new GameEffect("atk",50,false)]),
	new GameEquipment("w82","mh","Wind Blade",[new GameEffect("atk",55,false)]),
	new GameEquipment("w23","mh","Orichalcum Blade",[new GameEffect("atk",70,false),new GameEffect("mat",10,false)]),
	new GameEquipment("w76","mh","Tenta Blade",[new GameEffect("atk",65,false),new GameEffect("def",-15,false),new GameEffect("mdf",20,false),new GameEffect("agi",15,false)]),
	new GameEquipment("w74","mh","Memory of a King",[new GameEffect("atk",65,false), new GameEffect("mhp",15,true)]), 

	new GameEquipment("w67","mh","Claymore",[new GameEffect("atk",42,false), twohanded]),
	new GameEquipment("w64","mh","Flame Runed Blade",[new GameEffect("atk",47,false), twohanded]),
	new GameEquipment("w73","mh","Raging Blade",[new GameEffect("atk",55,false), twohanded]),
	new GameEquipment("w75","mh","Blade of Submission",[new GameEffect("atk",80,false), twohanded]),

	new GameEquipment("w31","mh","Shortbow",[new GameEffect("atk",13,false), twohanded, new GameEffect("aspd",5,false)]),
	new GameEquipment("w32","mh","Longbow",[new GameEffect("atk",26,false), twohanded, new GameEffect("aspd",5,false)]),
	new GameEquipment("w33","mh","Crossbow",[new GameEffect("atk",40,false), twohanded, new GameEffect("aspd",5,false)]),
	new GameEquipment("w34","mh","Mythril Bow",[new GameEffect("atk",56,false), new GameEffect("agi",5,false), twohanded, new GameEffect("aspd",5,false)]),
	new GameEquipment("w35","mh","Orichalcum Bow",[new GameEffect("atk",75,false),new GameEffect("agi",10,false), twohanded, new GameEffect("aspd",5,false)]),
	new GameEquipment("w68","mh","Windfury Bow",[new GameEffect("atk",32,false), twohanded]), 

	new GameEquipment("w37","mh","Knife",[new GameEffect("atk",3,false)]),
	new GameEquipment("w38","mh","Dagger",[new GameEffect("atk",7,false)]),
	new GameEquipment("w39","mh","Main Gauche",[new GameEffect("atk",12,false)]),
	new GameEquipment("w40","mh","Mythril Knife",[new GameEffect("atk",22,false)]),
	new GameEquipment("w41","mh","Orichalcum Dagger",[new GameEffect("atk",33,false),new GameEffect("agi",5,false)]),

	new GameEquipment("w43","mh","Mace",[new GameEffect("atk",8,false)]),
	new GameEquipment("w44","mh","Flail",[new GameEffect("atk",18,false)]),
	new GameEquipment("w45","mh","War Hammer",[new GameEffect("atk",26,false)]),
	new GameEquipment("w46","mh","Mythril Mace",[new GameEffect("atk",36,false)]),
	new GameEquipment("w47","mh","Orichalcum Hammer",[new GameEffect("atk",45,false)]),
	new GameEquipment("w72","mh","Thunder Hammer",[new GameEffect("atk",30,false), new GameEffect("mat",15,false)]),
	new GameEquipment("w81","mh","Improved Thunder Hammer",[new GameEffect("atk",40,false), new GameEffect("mat",25,false)]),
	
	new GameEquipment("w61","mh","Plain Staff",[new GameEffect("atk",2,false),new GameEffect("mat",1,false)]),
	new GameEquipment("w62","mh","Iron-Tipped Staff",[new GameEffect("atk",4,false)]),
	new GameEquipment("w63","mh","Blessed Staff",[new GameEffect("atk",1,false), new GameEffect("mat",10,false)]),
	new GameEquipment("w65","mh","Rolling Pin",[new GameEffect("atk",16,false)]),

	new GameEquipment("w49","mh","Terra's Staff",[new GameEffect("atk",1,false), new GameEffect("mat",10,false), twohanded]),
	new GameEquipment("w50","mh","Elmer's Staff",[new GameEffect("atk",2,false), new GameEffect("mat",20,false), twohanded]),
	new GameEquipment("w52","mh","Mythril Rod",[new GameEffect("atk",22,false), new GameEffect("mat",30,false), new GameEffect("mdf",5,false), twohanded]),
	new GameEquipment("w70","mh","(broken) Earth Staff",[new GameEffect("atk",7,false), new GameEffect("def",5,false), new GameEffect("mat",30,false), twohanded]),
	new GameEquipment("w53","mh","Orichalcum Staff",[new GameEffect("atk",30,false), new GameEffect("mat",45,false), twohanded]),
	new GameEquipment("w80","mh","Improved Earth Staff",[new GameEffect("atk",12,false), new GameEffect("def",10,false), new GameEffect("mat",45,false), twohanded]),
	new GameEquipment("w84","mh","Empowered Orichalcum Staff",[new GameEffect("atk",30,false), new GameEffect("mat",50,false), new GameEffect("mdf",8,false), twohanded]),
	
	/*______________*/

	new GameEquipment("a41" ,"oh","Buckler",[new GameEffect("def",1,false)]),
	new GameEquipment("a42" ,"oh","Round Shield",[new GameEffect("def",3,false)]),
	new GameEquipment("a43" ,"oh","Spike Shield",[new GameEffect("def",6,false),new GameEffect("atk",3,false)]),
	new GameEquipment("a44" ,"oh","Mythril Buckler",[new GameEffect("def",10,false)]),
	new GameEquipment("a45" ,"oh","Orichalcum Buckler",[new GameEffect("def",15,false)]),
	new GameEquipment("a101","oh","Dinged Obsidian Shield",[new GameEffect("def",14,false)]),

	new GameEquipment("a46","oh","Wood Shield",[new GameEffect("def",2,false), new GameEffect("aspd",-1,false)]),
	new GameEquipment("a67","oh","Elemental Guard",[new GameEffect("def",5,false)], new GameEffect("aspd",-2,false)),
	new GameEquipment("a47","oh","Iron Shield",[new GameEffect("def",6,false), new GameEffect("aspd",-2,false)]),
	new GameEquipment("a48","oh","Knight Shield",[new GameEffect("def",12,false), new GameEffect("aspd",-3,false)]),
	new GameEquipment("a49","oh","Mythril Shield",[new GameEffect("def",18,false)]),
	new GameEquipment("a50","oh","Orichalcum Shield",[new GameEffect("def",24,false), new GameEffect("aspd",-2,false)]),

	new GameEquipment("a65" ,"oh","Armband of the Devrish",[]),
	new GameEquipment("a103","oh","Improved Armband of the Devrish",[]),
	new GameEquipment("a70" ,"oh","Spring Holster",[new GameEffect("agi",3,false)]),
	new GameEquipment("a71" ,"oh","Spiked Bracer",[new GameEffect("def",3,false)]),
	new GameEquipment("a93" ,"oh","Steading Bracer",[new GameEffect("def",3,false)]),

	new GameEquipment("a72","oh","Herb Bag",[]),
	new GameEquipment("a79","oh","Empowered Herb Bag",[new GameEffect("atk",30,false), new GameEffect("mat",10,false), new GameEffect("mdf",15,false) ,new GameEffect("luk",10,false)]),

	/*______________*/

	new GameEquipment("a6","hl","Bandana",[new GameEffect("def",1,false)]),
	new GameEquipment("a7","hl","Leather Bandana",[new GameEffect("def",3,false)]),
	new GameEquipment("a8","hl","Fur Hat",[new GameEffect("def",6,false)]),
	new GameEquipment("a9","hl","Turban",[new GameEffect("def",10,false)]),
	new GameEquipment("a10","hl","Orichalcum Cap",[new GameEffect("def",14,false)]),

	new GameEquipment("a16","hl","Copper Brace",[new GameEffect("def",2,false), new GameEffect("mat",2,false), new GameEffect("mdf",1,false)]),
	new GameEquipment("a82","hl","Improved Copper Brace",[new GameEffect("def",4,false), new GameEffect("mat",4,false), new GameEffect("mdf",2,false)]),
	new GameEquipment("a17","hl","Circlet",[new GameEffect("def",6,false), new GameEffect("mat",4,false), new GameEffect("mdf",3,false)]),
	new GameEquipment("a18","hl","Silver Hairpin",[new GameEffect("def",10,false), new GameEffect("mat",5,false), new GameEffect("mdf",4,false)]),
	new GameEquipment("a19","hl","Mythril Circlet",[new GameEffect("def",15,false), new GameEffect("mat",7,false), new GameEffect("mdf",6,false)]),
	new GameEquipment("a83","hl","Improved Circlet",[new GameEffect("def",12,false), new GameEffect("mat",8,false), new GameEffect("mdf",6,false)]),
	new GameEquipment("a78","hl","Tiara of focus",[new GameEffect("mat",30,false)]),
	new GameEquipment("a20","hl","Orichalcum Crown",[new GameEffect("def",18,false), new GameEffect("mat",12,false), new GameEffect("mdf",11,false)]),

	new GameEquipment("a26","hl","Leather Hat",[new GameEffect("def",4,false)]),
	new GameEquipment("a27","hl","Bronze Cap",[new GameEffect("def",7,false)]),
	new GameEquipment("a28","hl","Sarett",[new GameEffect("def",12,false)]),
	new GameEquipment("a29","hl","Mythril Cap",[new GameEffect("def",16,false)]),
	new GameEquipment("a30","hl","Orichalcum Cap",[new GameEffect("def",22,false)]),

	new GameEquipment("a36","hl","Chain Helm",[new GameEffect("def",6,false), new GameEffect("aspd",-1,false)]),
	new GameEquipment("a37","hl","Iron Helm",[new GameEffect("def",12,false), new GameEffect("aspd",-2,false)]),
	new GameEquipment("a38","hl","Knight Helm",[new GameEffect("def",18,false), new GameEffect("aspd",-3,false)]),
	new GameEquipment("a39","hl","Mythril Helm",[new GameEffect("def",24,false)]),
	new GameEquipment("a40","hl","Orichalcum Helm",[new GameEffect("def",30,false), new GameEffect("aspd",-2,false)]),
	new GameEquipment("a96","hl","Enchanted Orichalcum Helm",[new GameEffect("def",30,false)]),

	new GameEquipment("a66","hl","Circlet of Speed",[new GameEffect("agi",10,false)]),
	new GameEquipment("a74","hl","Frozen Collar",
		[new GameEffect("atk",40,false),new GameEffect("def",18,false),new GameEffect("mat",40,false),new GameEffect("mdf",5,false), new GameEffect("aspd",-5,false)]),

	/*______________*/

	new GameEquipment("a1"  ,"ba","Casual Clothes",[new GameEffect("def",1,false)]),
	new GameEquipment("a2"  ,"ba","Leather Top",[new GameEffect("def",5,false)]),
	new GameEquipment("a3"  ,"ba","Adventurer's Garb",[new GameEffect("def",10,false)]),
	new GameEquipment("a4"  ,"ba","Hard Leather",[new GameEffect("def",15,false)]),
	new GameEquipment("a5"  ,"ba","Orichalcum Brigandine",[new GameEffect("def",20,false)]),
	new GameEquipment("a95" ,"ba","Miner's Tunic",[new GameEffect("def",20,false)]),
	new GameEquipment("a98" ,"ba","Light Mythril Shirt",[new GameEffect("def",18,false),new GameEffect("agi",10,false), new GameEffect("aspd",5,false)]),
	new GameEquipment("a102","ba","Improved Light Mythril Shirt",[new GameEffect("def",19,false),new GameEffect("agi",11,false), new GameEffect("aspd",5,false)]),
	new GameEquipment("a99" ,"ba","Flexi-Plate Armor",[new GameEffect("def",18,false),new GameEffect("agi",5,true)]),

	new GameEquipment("a11","ba","Cotton Robe",[new GameEffect("def",4,false),new GameEffect("mat",2,false),new GameEffect("mdf",2,false)]),
	new GameEquipment("a12","ba","Silk Cloak",[new GameEffect("def",9,false),new GameEffect("mat",3,false),new GameEffect("mdf",4,false)]),
	new GameEquipment("a62","ba","Neothan's Robe",[new GameEffect("def",5,false),new GameEffect("mat",6,false),new GameEffect("mdf",7,false)]),
	new GameEquipment("a13","ba","Runed Robe",[new GameEffect("def",13,false),new GameEffect("mat",6,false),new GameEffect("mdf",7,false)]),
	new GameEquipment("a80","ba","Improved Silk Cloak",[new GameEffect("def",18,false),new GameEffect("mat",6,false),new GameEffect("mdf",8,false)]),
	new GameEquipment("a14","ba","Hermit Robe",[new GameEffect("def",18,false),new GameEffect("mat",11,false),new GameEffect("mdf",12,false)]),
	new GameEquipment("a81","ba","Improved Runed Robe",[new GameEffect("def",26,false),new GameEffect("mat",12,false),new GameEffect("mdf",14,false)]),
	new GameEquipment("a15","ba","Orichalcum Cloak",[new GameEffect("def",25,false),new GameEffect("mat",17,false),new GameEffect("mdf",18,false)]),

	new GameEquipment("a21","ba","Leather Mail",[new GameEffect("def",5,false)]),
	new GameEquipment("a22","ba","Bronze Plate",[new GameEffect("def",12,false)]),
	new GameEquipment("a23","ba","Iron Plate",[new GameEffect("def",18,false),new GameEffect("agi",-2,false)]),
	new GameEquipment("a24","ba","Mythril Plate",[new GameEffect("def",24,false)]),
	new GameEquipment("a25","ba","Orichalcum Plate",[new GameEffect("def",30,false)]),

	new GameEquipment("a31","ba","Chain Mail",[new GameEffect("def",8,false),new GameEffect("agi",-3,false), new GameEffect("aspd",-1,false)]),
	new GameEquipment("a63","ba","Snake Chain",[new GameEffect("def",14,false), new GameEffect("aspd",-1,false)]),
	new GameEquipment("a32","ba","Iron Armor",[new GameEffect("def",16,false), new GameEffect("aspd",-2,false)]),
	new GameEquipment("a33","ba","Plate Mail",[new GameEffect("def",24,false), new GameEffect("aspd",-3,false)]),
	new GameEquipment("a34","ba","Mythril Armor",[new GameEffect("def",32,false)]),
	new GameEquipment("a35","ba","Orichalcum Armour",[new GameEffect("def",40,false), new GameEffect("aspd",-2,false)]),

	/*______________*/

	
	new GameEquipment("a52","ac","Defense Piece",[new GameEffect("def",10,false),new GameEffect("mdf",10,false)]),
	new GameEquipment("a84","ac","Improved Defense Piece",[new GameEffect("def",10,false),new GameEffect("mdf",10,false),new GameEffect("luk",10,false)]),
	new GameEquipment("a55","ac","Lucky Charm",[new GameEffect("luk",30,false)]),
	new GameEquipment("a68","ac","Stoneskin Amulet",[new GameEffect("agi",-5,false)]),
	new GameEquipment("a69","ac","Poison-Proof Ring",[]),
	new GameEquipment("a85","ac","Improved Poison-Proof Ring",[]),
	new GameEquipment("a73","ac","Frozen Band",[new GameEffect("mat",10,false)]),
	new GameEquipment("a77","ac","Betan Codex",[new GameEffect("def",10,false),new GameEffect("mat",20,false),new GameEffect("luk",10,false)]),
	new GameEquipment("a75","ac","Bloodwood Amulet",[new GameEffect("atk",25,false),new GameEffect("mat",25,false),new GameEffect("mhp",500,false)]),
	new GameEquipment("a86","ac","Improved Bloodwood Amulet",[new GameEffect("mhp",500,false),new GameEffect("def",10,false),new GameEffect("atk",40,false)]),
	new GameEquipment("a87","ac","Fire Pendant",[]),
	new GameEquipment("a88","ac","Thunder Pendant",[]),
	new GameEquipment("a89","ac","Water Pendant",[]),
	new GameEquipment("a90","ac","Earth Pendant",[]),
	new GameEquipment("a91","ac","Wind Pendant",[]),
	new GameEquipment("a92","ac","Ice Pendant",[]),
	new GameEquipment("a97","ac","Obsidian Ring",[new GameEffect("mat",10,false)]),

	/*______________*/

	new GameEquipment("p1","pup","Angelica's Tu'than Elixir",[new GameEffect("atk",6,false)]),
	new GameEquipment("p2","pup","Transformation (c7m4)",[new GameEffect("mat",15,false)]),
	new GameEquipment("p3","pup","Kathleen's Memories",[new GameEffect("atk",40,false),new GameEffect("def",18,false),new GameEffect("mat",40,false),new GameEffect("mdf",5,false)]),

	
];


//Default equipment (only the last item of a character is "changed" to improve performance)


function setDefaultEquipments()
{

	//Ralph
	var ralph = CHARACTERS[0];
	ralph.assignEq(findItemByUID("w74")); //mok
	ralph.assignEq(findItemByUID("a50")); //Orich. shield
	ralph.assignEq(findItemByUID("a96")); //Ench. Orich. helm
	ralph.assignEq(findItemByUID("a35")); //Orich. armor
	ralph.assignEq(findItemByUID("a86")); //Imp. bw amulet
	ralph.applyPowerUp(findItemByUID("p1")); //Angelica's Tu'than Elixir
	//Donna
	var donna = CHARACTERS[1];
	donna.assignEq(findItemByUID("w80")); //imp e. staff
	donna.assignEq(findItemByUID("a20")); //Orich. crown
	donna.assignEq(findItemByUID("a15")); //Orich. cloak
	donna.changeEq(findItemByUID("a77")); //Betan codex
	//Samantha
	var samantha = CHARACTERS[2];
	samantha.assignEq(findItemByUID("w41")); //Orich. dag
	samantha.assignEq(findItemByUID("a71")); //spiked bracer
	samantha.assignEq(findItemByUID("a10")); //Orichalcum cap
	samantha.assignEq(findItemByUID("a5" )); //Orich. brigand.
	samantha.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Sarah
	var sarah = CHARACTERS[3];
	sarah.assignEq(findItemByUID("w5" )); //Orich. Axe
	sarah.assignEq(findItemByUID("a93")); //Steading bracers
	sarah.assignEq(findItemByUID("a40")); //Orich. helm
	sarah.assignEq(findItemByUID("a35")); //Orich. armor
	sarah.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Terra
	var terra = CHARACTERS[4];
	terra.assignEq(findItemByUID("w84")); //Emp. Orich. Staff
	terra.assignEq(findItemByUID("a78")); //Tiara of focus
	terra.assignEq(findItemByUID("a15")); //Orich. cloak
	terra.assignEq(findItemByUID("a75")); //Bloodwood Amulet (regular)
	terra.applyPowerUp(findItemByUID("p2"));//7m4 Transformation
	//Angelica
	var angelica = CHARACTERS[5];
	angelica.assignEq(findItemByUID("w81")); //imp. th. hammer.
	angelica.assignEq(findItemByUID("a79")); //emp. herb bag
	angelica.assignEq(findItemByUID("a30")); //Orich. cap
	angelica.assignEq(findItemByUID("a25")); //Orich. plate
	angelica.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Rhea
	var rhea = CHARACTERS[6];
	rhea.isDualWield = true;  //lucky girl
	rhea.assignEq(findItemByUID("w76")); //Tenta blade
	rhea.assignEq(findItemByUID("w76"),true); //Tenta blade as offhand
	rhea.assignEq(findItemByUID("a30")); //Orich. cap
	rhea.assignEq(findItemByUID("a25")); //Orich. plate
	rhea.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Alena
	var alena = CHARACTERS[7];
	alena.assignEq(findItemByUID("w35")); //Orich. bow
	alena.assignEq(findItemByUID("a30")); //Orich. cap
	alena.assignEq(findItemByUID("a25")); //Orich. plate
	alena.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Noemi
	var noemi = CHARACTERS[8];
	noemi.assignEq(findItemByUID("w41")); //Orich. dag
	noemi.assignEq(findItemByUID("a103")); //Improved armband of the devrish
	noemi.assignEq(findItemByUID("a66")); //circlet of sp.
	noemi.assignEq(findItemByUID("a99")); //Sexi-Plate
	noemi.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Naitay
	var naitay = CHARACTERS[9];
	naitay.assignEq(findItemByUID("w85")); //Orich. Poison. Lance
	naitay.assignEq(findItemByUID("a45")); //Orich. buckler
	naitay.assignEq(findItemByUID("a30")); //Orich. cap
	naitay.assignEq(findItemByUID("a25")); //Orich. plate
	naitay.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Kathleen
	var kathleen = CHARACTERS[10];
	kathleen.assignEq(findItemByUID("w23")); //Orich. blade
	kathleen.assignEq(findItemByUID("a101")); //D. Obs. Shield
	kathleen.assignEq(findItemByUID("a40")); //Orich. helm
	kathleen.assignEq(findItemByUID("a35")); //Orich. armor
	kathleen.assignEq(findItemByUID("a86")); //Imp. bw amulet
	kathleen.applyPowerUp(findItemByUID("p3"));//Kath's memories
	//Jessica
	var jessica = CHARACTERS[11];
	jessica.assignEq(findItemByUID("w35")); //Orich. bow
	jessica.assignEq(findItemByUID("a30")); //Orich. cap
	jessica.assignEq(findItemByUID("a102")); //Imp. L. Myth.
	jessica.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Vanessa
	var vanessa = CHARACTERS[12];
	vanessa.assignEq(findItemByUID("w47")); //Orich. hammer
	vanessa.assignEq(findItemByUID("a50")); //Orich. shield
	vanessa.assignEq(findItemByUID("a40")); //Orich. helm
	vanessa.assignEq(findItemByUID("a102")); //Orich. armor
	vanessa.changeEq(findItemByUID("a86")); //Imp. bw amulet
	//Chinua
	var chinua = CHARACTERS[13];
	chinua.assignEq(findItemByUID("w23")); //Orich. blade
	chinua.assignEq(findItemByUID("a70")); //Spring holster
	chinua.assignEq(findItemByUID("a20")); //Orich. crown
	chinua.assignEq(findItemByUID("a15")); //Orich. cloak
	chinua.changeEq(findItemByUID("a75")); //Bloodwood Amulet (regular)
	//Adeline
	var adeline = CHARACTERS[14];
	adeline.assignEq(findItemByUID("w41")); //Orich. dag
	adeline.assignEq(findItemByUID("a103")); //Improved armband of the devrish
	adeline.assignEq(findItemByUID("a30")); //Orich. cap
	adeline.assignEq(findItemByUID("a102")); //Imp. L. Myth.
	adeline.changeEq(findItemByUID("a68")); //Stoneskin amulet

	//Assign colors for charts
	ralph.color = "#ff0000";
	donna.color = "#00a0ff";
	samantha.color = "#ff77ff";
	sarah.color = "#720000";
	terra.color = "#ff9900";
	angelica.color = "#aaff77";
	rhea.color = "#a055ff";
	alena.color = "#ee0066";
	noemi.color = "#000000";
	naitay.color = "#007200";
	kathleen.color = "#0000ff";
	jessica.color = "#aaaaaa";
	vanessa.color = "#00ff00";
	chinua.color = "#6669ef";
	adeline.color = "#339933";
}


setDefaultEquipments();

