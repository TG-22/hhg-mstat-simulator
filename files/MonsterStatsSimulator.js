/*
Leveling Monster Stats Simulator by TG22 (c) 2018-2019
Main script file

Using two external libraries : Jquery and Chart.js

*/


var monsterStats = ["mhp","mmp","atk","def","mat","mdf","agi","luk","exp","gold"];
var characterStats = ["mhp","mmp","atk","def","mat","mdf","agi","luk"];
var monsterDefault = {"mhp":[15,50],"mmp":[10,10],"atk":[5,5],"def":[5,5],"mat":[5,5],"mdf":[5,5],"agi":[5,5],"luk":[5,5],"exp":[5,5],"gold":[5,10]};
var SHOWBEFORELEVELTEN = false;
var COLORS = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#000000","#ff900","#5012ff","#80ff00"];
var CHARTS = [];
var DISPLAYED = null;

function masterMonsterFormula(stats,monster_level,usecap)
{
	var raw_value = stats[0] + stats[0]*stats[1]/100*(monster_level-1) + (monster_level-1)*stats[2];
	var val = Math.floor(raw_value);  //Leveling monsters script use ruby "to_i" i.e. rounding down.
	if (usecap && (val > usecap)) {val = usecap;}
	return val;
}

function monsterGoldFormula(goldstat,monster_level,plevel)
{
	var base = goldstat[0]
	var raw_value = base + base*goldstat[1]/100*(monster_level-1) + (monster_level-1)*goldstat[2];
	var val = Math.floor(raw_value);
	return val;
}

function masterCharacterFormula(stats,character_level,usecap) /* stats is an array [value_level1,value_level99,bis_value,item_percentage_increase] */
{
	var raw_value = stats[0] + (character_level-1) * (stats[1]-stats[0]) / 98 + stats[2]; //Linear regression of base + gear
	raw_value = raw_value * (1 + stats[3]/100); //Gear bonus %
	var val = Math.round(raw_value); //RPGMaker uses usual rounding for characters stats
	if (usecap && (val > usecap)) {val = usecap;}
	return val;
}

function Attack(aname,aspd,adamage)
{
	this.name = aname;
	this.speed = aspd;
	this.damage = adamage;
}

function Monster()
{

	this.mhp  = [0,0,0]; //base, growth%, increase
	this.mmp  = [0,0,0];
	this.atk  = [0,0,0];
	this.def  = [0,0,0];
	this.mat  = [0,0,0];
	this.mdf  = [0,0,0];
	this.agi  = [0,0,0];
	this.luk  = [0,0,0];
	this.exp  = [0,0,0];
	this.gold = [0,0,0];

	this.max_level = 1;
	this.name = "";


	if (arguments.length > 2)//we need 3 arguments or we ignore them [name,maxlev,{stats}]
	{
		this.name = arguments[0];
		this.max_level = arguments[1];
		this.mhp  = arguments[2].mhp;
		this.mmp  = arguments[2].mmp;
		this.atk  = arguments[2].atk;
		this.def  = arguments[2].def;
		this.mat  = arguments[2].mat;
		this.mdf  = arguments[2].mdf;
		this.agi  = arguments[2].agi;
		this.luk  = arguments[2].luk;
		this.exp  = arguments[2].exp;
		this.gold = arguments[2].gold;
	}


	this.updateTable = M_updateTable; //update table with stats
	this.readMonster = M_readMonster; //update stats with table
	this.check = M_check;
	this.getStat = M_getStat;
	this.getNotetags = M_getNotetags;
	this.simulateDamageOn = M_simulateDamageOn;
	this.simulateDamageFrom = M_simulateDamageFrom;
}

function M_simulateDamageFrom(party_level, dsource, attack, states)
{
	var blev = ((this.max_level > party_level)?(party_level):(this.max_level));
	if (blev < 1) {blev = 1;} //No level 0 monsters - tested in RPGMaker
	var alev = party_level;

	var aatk = masterCharacterFormula(dsource["atk"],party_level,999);
	var adef = masterCharacterFormula(dsource["def"],party_level,999);
	var amat = masterCharacterFormula(dsource["mat"],party_level,999);
	var aagi = masterCharacterFormula(dsource["agi"],party_level,999);
	var bdef = this.getStat("def",party_level);
	var bmdf = this.getStat("mdf",party_level);
	var bmhp = this.getStat("mhp",party_level);

	//Acid state
	if (states)
	{
		$(states).each(function(id,it) 
		{
			if (it == "b.acid")
			{
				bdef = Math.round(bdef*0.75);
			}
		});
	}

	var dmg = 0;
	
	var stats = 
	{
		"a":{"lv":alev, "atk":aatk, "def":adef, "mat":amat, "agi":aagi},
		"b":{"lv":blev, "def":bdef, "mdf":bmdf, "mhp":bmhp}
	}

	dmg = attack.damage(stats);

	if (dmg < 0) {dmg = 0;}
	return dmg;
}


function M_simulateDamageOn(party_level, target, attack, states, addedstats)
{
	var alev = ((this.max_level > party_level)?(party_level):(this.max_level));
	if (alev < 1) {alev = 1;} //No level 0 monsters
	var blev = party_level;
	var aatk = this.getStat("atk",party_level);
	var amat = this.getStat("mat",party_level);
	var aagi = this.getStat("agi",party_level);
	var adef = this.getStat("def",party_level);
	var bdef = masterCharacterFormula(target["def"],party_level,999);
	var bmdf = masterCharacterFormula(target["mdf"],party_level,999);
	var bmhp = masterCharacterFormula(target["mhp"],party_level,9999);

	//Added stats
	if (addedstats)
	{
		$(addedstats).each(function(id,it)
		{
			if (it.stat == "bdef")
			{
				bdef += it.val;
			}
			if (it.stat == "bmdf")
			{
				bmdf += it.val;
			}
		});
	}

	//Acid state
	if (states)
	{
		$(states).each(function(id,it) 
		{
			if (it == "b.acid")
			{
				bdef = Math.round(bdef*0.75);
			}
		});
	}

	var dmg = 0;

	var stats = 
	{
		"a":{"lv":alev, "atk":aatk, "def":adef, "mat":amat, "agi":aagi},
		"b":{"lv":blev, "def":bdef, "mdf":bmdf, "mhp":bmhp}
	}
	
	dmg = attack.damage(stats);

	if (dmg < 0) {dmg = 0;}
	return dmg;	
}

function M_getStat(statname,party_level)
{
	var lv = party_level;
	if (party_level > this.max_level)
	{
		lv = this.max_level;
	}
	if (lv < 1) {lv = 1;} //No level 0 monster

	var cap = null;
	//No cap on HP/MP/XP/Gold, 999 on the rest
	if ((statname != "mhp")&&(statname != "mmp")&&(statname != "exp")) {cap = 999;} 

	if (statname != "gold")
	{
		return masterMonsterFormula(this[statname],lv,cap);
	}
	else
	{
		return monsterGoldFormula(this.gold,lv,party_level);
	}
}

function colorInputRed(id)
{
	$("#" + id).css("background-color","ff6644");
}

function colorInputGreen(id)
{
	$("#" + id).css("background-color","#55ff55");
}

function setValue(fieldid,newvalue)
{
	$("#" + fieldid).val(newvalue);
}

function readAndCheckValue(fieldid,vmin,vint)
{
	var tmp = $("#" + fieldid).val();
	if ( (tmp=="") || ((tmp!=0)&&(!tmp)) || (isNaN(tmp)) ) //if empty, non-zero nullable, or not a number
	{
		colorInputRed(fieldid);
		return NaN;
	}
	else
	{
		if (tmp < vmin)
		{
			colorInputRed(fieldid);
			return NaN;
		}
		if (vint && (Math.floor(tmp) != tmp))
		{
			colorInputRed(fieldid);
			return NaN;
		}
		colorInputGreen(fieldid);
		return tmp*1;
	}
}

function displaySimplifiedFormulas()
{
	$(monsterStats).each(function(id,it)
	{
		var formu = "";
		var base = MONSTER[it][0];
		var perc = MONSTER[it][1];
		var adds = MONSTER[it][2];

		if (it == "gold")
		{
			formu = "" + ((base>0)?(base):(""));
			if (perc>0)
			{
				formu = "(" + formu + ") * ( 1 + (lv<sub>m</sub> - 1) * " + (perc/100) + " )";
			}
			if (adds>0)
			{
				formu += ((formu.length>0)?(" + "):("")) + "(lv<sub>m</sub> - 1) * " + adds;
			}   
		}
		else
		{
			if (base == 0)
			{
				if (adds == 0)
				{
					formu = "0";
				}
				else
				{
					formu = "(level-1) * " + adds;
				}
			}
			else
			{
				var base_adds = adds*1 + base*perc/100;
				base_adds = Math.floor(100*base_adds)/100;
				if (base_adds == 0)
				{
					formu = "" + base;
				}
				else
				{
					formu = "" + base + " + (level-1) * " + base_adds;
				}
			}
		}

		$("#" + it + "_h").html(formu);
		$(".hidden_s").show();
		
		
	});
}

function outputCharacterStatSimulation(outputid,stat,who)
{
	var out = $("#" + outputid);
	CHARTS = [];

	var bywho = "the chosen characters";
	var chosenChars  = [];
	$(who).each(function(id,it) { chosenChars[id] = CHARACTERS[it]; });
	if (who.length == 1)
	{
		bywho = CHARACTERS[who[0]].name
	}
	
	out.append("This chart displays the values of the <strong>" + stat + "</strong> stat. of " + bywho + "<br/>"
	+ "Statistics include equiped items!<br/>"
	+ "<span style='text-style:italic;'>hint : charts can be resized</span><br/><br/>");

	var chartValues = [];

	$(chosenChars).each(function(charid,charit)
	{
		chartValues[charid] = {"level":[],"stat":[]};
		for(var k=0;k<99;k++)
		{
			var level = k+1;
			chartValues[charid].level[k] = level;

			var cap = 999;
			if (stat == "mhp" || stat == "mmp")
			{
				cap = 9999;
			}

			chartValues[charid].stat[k] = masterCharacterFormula(charit.stats[stat],level,cap);
		}
	});

	out.append("<div id='div_ch_1' class='chartcontainer'><canvas id='chart_cmp_s_0'></canvas></div>");
	var ctx = document.getElementById("chart_cmp_s_0").getContext('2d');
	CHARTS[0] = new Chart(ctx, { type:'line', 
	data: 
	{
		labels : chartValues[0].level,
		datasets: [],
	},
	options: {
		maintainAspectRatio: false,
		scales : {
				xAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
				yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Value'}}]
			}
		}
	});

	$(chosenChars).each(function(charid,charit)
	{
		var stat_dataset = 
		{
			label : stat + " of " + charit.name,
			backgroundColor: charit.color,
			borderColor: charit.color,
			fill:false,
			data:chartValues[charid].stat
		};
		
		//assign values
		CHARTS[0].data.datasets[CHARTS[0].data.datasets.length] = stat_dataset;
	});

	CHARTS[0].update();
}

function outputCharacterTableAttacks(outputid,attackid,who)
{
	var out = $("#" + outputid);
	var attack = ATTACKS[attackid];
	CHARTS = [];

	var bywho = "the chosen characters";
	var chosenChars  = [];
	$(who).each(function(id,it) { chosenChars[id] = CHARACTERS[it]; });

	if (who.length == 1)
	{
		CHARACTERS[who[0]].displayStats("righttable");
		bywho = CHARACTERS[who[0]].name
	}
	
	out.append("<br/>This is a simulation of the attack <span class='attackname'>" + attack.name + "</span> by " + bywho + "<br/>For multiple hit skills, this is the damage of only one hit." 
		+ ((SHOWBEFORELEVELTEN)?(""):("<br/>Not displaying simulation before level 10")) 
		+ "<br/><span style='text-style:italic;'>hint : charts can be resized</span><br/><br/>");

	var chartValues = [];
	var chiterator = 0;
	var states = [];

	$(chosenChars).each(function(charid,charit)
	{
		chartValues[charid] = {"level":[],"damage":[],"percent":[]};
		for(var k=((SHOWBEFORELEVELTEN)?(0):(9));k<99;k++)
		{
			var level = k+1;
			var mhp = MONSTER.getStat("mhp",level);
			var dmg = MONSTER.simulateDamageFrom(level, charit.stats, attack,states);
			var dmgperc = Math.floor(dmg / mhp * 10000)/100;
			chartValues[charid].level[k] = level;
			chartValues[charid].damage[k] = dmg;
			chartValues[charid].percent[k] = dmgperc;
		}
	});

	//Raw Damage Chart
	out.append("<div id='div_ch_1' class='chartcontainer'><canvas id='chart_atk_a_0'></canvas></div>");
	var ctx = document.getElementById("chart_atk_a_0").getContext('2d');
	CHARTS[0] = new Chart(ctx, { type:'line', 
	data: 
	{
		labels : chartValues[0].level,
		datasets: [],
	},
	options: {
		scaleBeginAtZero: false,
		maintainAspectRatio: false,
		scales : {
				xAxes : [{ ticks:{min:((SHOWBEFORELEVELTEN)?(1):(10))},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
				yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage'}}]
			}
		}
	});
	

	//Relative Damage Chart
	out.append("<div id='div_ch_2' class='chartcontainer'><canvas id='chart_ratk_a_0'></canvas></div>");
	var ctx2 = document.getElementById("chart_ratk_a_0").getContext('2d');
	CHARTS[1] = new Chart(ctx2, { type:'line', 
	data: 
	{
		labels : chartValues[0].level,
		datasets: [],
	},
	options: {
		scaleBeginAtZero: false,
		maintainAspectRatio: false,
		scales : {
				xAxes : [{ ticks:{min:((SHOWBEFORELEVELTEN)?(1):(10))},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
				yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage%'}}]
			}
		}
	});

	$(chosenChars).each(function(charid,charit)
	{
		var dmg_dataset = 
		{
			label : "Damage of " + attack.name + " by " + charit.name,
			backgroundColor: charit.color,
			borderColor: charit.color,
			fill:false,
			data:chartValues[charid].damage
		};

		var per_dataset = 
		{
			label : "Relative Damage (%) of " + attack.name + " by " + charit.name,
			backgroundColor: charit.color,
			borderColor: charit.color,
			fill:false,
			data:chartValues[charid].percent
		};
		
		//assign values
		CHARTS[0].data.datasets[CHARTS[0].data.datasets.length] = dmg_dataset;
		CHARTS[1].data.datasets[CHARTS[1].data.datasets.length] = per_dataset;
	});

	CHARTS[0].update();
	CHARTS[1].update();
}



function outputMonsterChartStats(outputid)
{

	DISPLAYED = "chart_stats";

	var chartValues = {"level":[],"mhp":[],"mmp":[],"atk":[],"def":[],"mat":[],"mdf":[],"agi":[],"luk":[],"exp":[],"gold":[]};

	$("#" + outputid).append("<br/>These are the stats of the monster at different party levels.<br/><br/><div id='mstat_div'></div>");
	var out = $("#mstat_div");

	var stats = ["mhp","mmp","atk","def","mat","mdf","agi","luk","exp","gold"];
	for(var k=0;k<99;k++)
	{
		chartValues.level[k] = k+1;
		$(stats).each(function(id,it)
		{
			chartValues[it][k] = MONSTER.getStat(it,k+1);
		});
	}


	var ctxs = [];
	$(stats).each(function(id,statit)
	{
		out.append("<div class='chartcontainer' style='height:285px;'><canvas id='chart_mst_" + statit + "'></canvas></div>");
		ctxs[id] = document.getElementById("chart_mst_" + statit).getContext('2d');

		var myChart = new Chart(ctxs[id], { type:'line', 
		data: 
		{
			labels : chartValues.level,
			datasets: [{
					label : statit,
					backgroundColor: "#ff0000",
					borderColor: "#ff000",
					fill:false,
					data:chartValues[statit]
				}],
		},
		options: {
			maintainAspectRatio: false,
			scales : {
					xAxes : [{display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: statit}}]
				}
			}
		});


	});
}

function outputMonsterTableStats(outputid) //deprecated
{
	$("#" + outputid).append("<br/>These are the stats of the monster at different party levels.<br/><br/><table class='tgtable'><tbody id='mstat_tbdy'></tbody></table>");
	var out = $("#mstat_tbdy");
	
	var tmp = "<tr><th>Player party Level</th>";
	for (var i=0;i<monsterLevelShow.length;i++)
	{
		tmp += "<th>" + monsterLevelShow[i] + "</th>";	
	}
	tmp += "</tr>";
	out.append(tmp);


	$(monsterStats).each(function(id,it)
	{
		var tmp = "<tr><th>" + it + "</th>"
		for (var i=0;i<monsterLevelShow.length;i++)
		{
			var cl = ((i%2==0)?("odd"):("even"));
			tmp += "<td class='" + cl + "'>" + MONSTER.getStat(it,monsterLevelShow[i]) + "</td>";
		}
		tmp += "</tr>";	
		out.append(tmp);
	});
}

function initSimulation()
{
	MONSTER.readMonster();
	if (!MONSTER.check())
	{
		$("#simulation_output").html("Error(s) found, check your input");
		return false;
	}
	displaySimplifiedFormulas();	
	$("#righttable").html(""); //Empty character table
	return true;
}

function outputSimulation()
{
	removeAllDisplay();
	if (initSimulation())
	{
		//outputMonsterTableStats("simulation_output");
		outputMonsterChartStats("simulation_output");
	}
}

function outputAttackSimulation()
{
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");
	out.html("<br/><div style='float:left;' class='userinputdiv'>Please choose an attack to simulate : <br/><select class='ms_sim_atk_inp' id='ch_attack'></select></div>");
	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose a character to receive the attack : <br/><select id='ch_attack_who' class='ms_sim_atk_inp'></select></div>");
	out.append("<div style='clear:both;'></div><br/><br/><i>Other options</i> : ");
	out.append("<br/>Character under 'acid' state? (-25% def) <input class='ms_sim_atk_inp' type='checkbox' unchecked id='acidchar' />");
	out.append("<br/><table><tr><td>Add extra defense to the characters?</td><td><input class='ms_sim_atk_inp' type='text' value='0' "
		+ "id='exdefchar' title=\"This value is added to your character's DEF - use this to test new armors.\" /></td></tr>"
		+ "<tr><td>Add extra magical defense to the characters?</td><td><input class='ms_sim_atk_inp' type='text' id='exmdfchar' value='0' "
		+ "title=\"This value is added to your character's MDF - use this to test new armors.\" /></td></tr></table>");
	out.append("<div id='out_att_simulation'></div>");


	var sel_out = $("#ch_attack");
	$(ATTACKS).each(function(id,it)
	{
		sel_out.append("<option value='" + id + "'>" + it.name + "</option>");	
	});
	var sel_outwho = $("#ch_attack_who");
	$(CHARACTERS).each(function(id,it)
	{
		sel_outwho.append("<option value='" + id + "'>" + it.name + "</option>");	
	});
	
	refreshMonsterTableAttacks();

	$(".ms_sim_atk_inp").change(function()
	{
		if (DISPLAYED == "chart_msnt_attack")
		{
			refreshMonsterTableAttacks();
		}
	});
}

function refreshMonsterTableAttacks()
{
		$("#out_att_simulation").html("");

		var extra_def = readAndCheckValue("exdefchar",0,true);
		var extra_mdf = readAndCheckValue("exmdfchar",0,true);

		if (isNaN(extra_def) || isNaN(extra_mdf))
		{
			return;
		}


		if (!initSimulation()) //Re-read monster values
		{
			return;
		}

		DISPLAYED = "chart_msnt_attack";

		var who = [];
		who[0] = $("#ch_attack_who").val();
		outputMonsterTableAttacks("out_att_simulation",$("#ch_attack").val(),who,[extra_def,extra_mdf]); 	
}

function outputMonsterTableAttacks(outputid,attackid,who)
{
	var out = $("#" + outputid);

	var attack = ATTACKS[attackid];

	var acidified = $("#acidchar").is(':checked');
	var extra_def = readAndCheckValue("exdefchar",0,true);
	var extra_mdf = readAndCheckValue("exmdfchar",0,true);

	if (isNaN(extra_def)) {extra_def=0;}
	if (isNaN(extra_mdf)) {extra_mdf=0;}

	var onwho = "the chosen characters";
	var chosenChars  = []
	$(who).each(function(id,it) { chosenChars[id] = CHARACTERS[it]; });

	if (who.length == 1)
	{
		CHARACTERS[who[0]].displayStats("righttable");
		onwho = CHARACTERS[who[0]].name;
	}


	out.append("<br/>This is a simulation of the attack <span class='attackname'>" + attack.name + "</span> on " + onwho + "<br/>For multiple hit skills, this is the damage of only one hit." 
	+ ((acidified)?("<br/><i>Your character(s) are under acid state</i>"):("")) 
	+ (((extra_def>0)||(extra_mdf))?("<br/>Additional defensive stats to characters : " + extra_def + "/" + extra_mdf):(""))
	+ "<br/><span style='text-style:italic;'>hint : charts can be resized</span><br/><br/>");

	var chartValues = [];
	var chiterator = 0;

	var states = [];
	if (acidified) {states[states.length] = "b.acid";}

	var addedstats = [];
	if (extra_def > 0) 
	{
		addedstats[addedstats.length] = {"stat":"bdef", "val":extra_def};
	}
	if (extra_mdf > 0) 
	{
		addedstats[addedstats.length] = {"stat":"bmdf", "val":extra_mdf};
	}
	
	$(chosenChars).each(function(charid,charit)
	{
		
		chartValues[chiterator] = {"level":[],"damage":[],"percent":[],"damagewithout":[],"percentwithout":[]};
		for(var k=0;k<99;k++)
		{
			var level = k+1;
			var mhp = masterCharacterFormula(charit.stats["mhp"],level,9999);
			var dmg = MONSTER.simulateDamageOn(level, charit.stats, attack,states,addedstats);
			var dmgwo = MONSTER.simulateDamageOn(level, charit.stats, attack,states,[]); //Damage without bonus stats
			var dmgperc = Math.floor(dmg / mhp * 10000)/100;
			var dmgpercwo = Math.floor(dmgwo / mhp * 10000)/100;
			chartValues[chiterator].level[k] = level;
			chartValues[chiterator].damage[k] = dmg;
			chartValues[chiterator].percent[k] = dmgperc;
			chartValues[chiterator].damagewithout[k] = dmgwo;
			chartValues[chiterator].percentwithout[k] = dmgpercwo;

		}

		//Chart code

		//Raw Damage Chart
		out.append("<div class='chartcontainer'><canvas id='chart_atk_a_" + charit.name + "'></canvas></div>");
		var ctx = document.getElementById("chart_atk_a_" + charit.name).getContext('2d');

		var dmg_datasets = [{
					label : "Damage of " + attack.name + " on " + charit.name,
					backgroundColor: "#ff0000",
					borderColor: "#ff0000",
					fill:false,
					data:chartValues[chiterator].damage
				}];
		if (addedstats.length > 0) //add a second dataset
		{
			dmg_datasets[1] = {
					label : "Damage of " + attack.name + " on " + charit.name + " without bonus stats",
					backgroundColor: "#000000",
					borderColor: "#000000",
					fill:false,
					data:chartValues[chiterator].damagewithout
				};
		}

		var myChart = new Chart(ctx, { type:'line', 
		data: 
		{
			labels : chartValues[chiterator].level,
			datasets: dmg_datasets,
		},
		options: {		
			maintainAspectRatio: false,
			scales : {
					xAxes : [{ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage'}}]
				}
			}
		});

		//Relative Damage Chart
		out.append("<div class='chartcontainer'><canvas id='chart_ratk_a_" + charit.name + "'></canvas></div>");
		var ctx2 = document.getElementById("chart_ratk_a_" + charit.name).getContext('2d');

		var rdmg_datasets = [{
					label : "Relative Damage (%) of " + attack.name + " on " + charit.name,
					backgroundColor: "#ff0000",
					borderColor: "#ff0000",
					fill:false,
					data:chartValues[chiterator].percent
				}];
		if (addedstats.length > 0)
		{
			rdmg_datasets[1] = 
			{
				label : "Relative Damage (%) of " + attack.name + " on " + charit.name + " without bonus stats",
				backgroundColor: "#000000",
				borderColor: "#000000",
				fill:false,
				data:chartValues[chiterator].percentwithout
			};
		}


		var myChart = new Chart(ctx2, { type:'line', 
		data: 
		{
			labels : chartValues[chiterator].level,
			datasets: rdmg_datasets,
		},
		options: {
			maintainAspectRatio: false,
			scales : {
					xAxes : [{ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage%'}}]
				}
			}
		});

		chiterator++;
	});
}



function outputCharacterCompare()
{
	var out = $("#simulation_output");
	out.html(""); //Empty output
	$("#righttable").html(""); //Empty character table


	out.html("<br/><div style='float:left;' class='userinputdiv'>Please choose a stat. to simulate : <br/><select id='ch_stat'></select></div>");
	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose the character(s) to compare : <br/><table style='width:100%;'><tbody id='sta_cmp_select_chars'></tbody></table></div>");
	out.append("<div style='clear:both;'></div><br/><br/><div id='out_cmp_simulation'></div>");

	var sel_out = $("#ch_stat");
	$(characterStats).each(function(id,it)
	{
		sel_out.append("<option value='" + it + "'>" + it + "</option>");	
	});

	var sel_outwho = $("#sta_cmp_select_chars");
	var tmp = "";
	$(CHARACTERS).each(function(id,it)
	{
		if ((!tmp)||(id%3==0))
		{
			tmp += "<tr>";
		}
		tmp += "<td>"
		tmp += "<input type='checkbox' id='cmp_sta_ch_" + id + "' />";
		tmp += it.name;
		tmp += "</td>"
		if ((id%3==2))
		{
			tmp += "</tr>";
		}

	});
	if (!tmp.endsWith("</tr>")) {tmp += "</tr>";}
	sel_outwho.html(tmp);


	$(CHARACTERS).each(function(id,it)
	{
		$("#cmp_sta_ch_"+id).change(function(){refreshStatCompareCharts();});
	});
	sel_out.change(function(){refreshStatCompareCharts();})
	
	
}

function refreshStatCompareCharts()
{
	$("#out_cmp_simulation").html("");
	var who = [];
	$(CHARACTERS).each(function(id,it)
	{
		if ( $("#cmp_sta_ch_" + id).is( ":checked" ) )
		{
			who[who.length] = id;
		}
	});
	if (who.length > 0)
	{
		$("#out_att_simulation").html("");
		outputCharacterStatSimulation("out_cmp_simulation",$("#ch_stat").val(),who);
	}
	else
	{
		$("#out_att_simulation").html("");
	}
}

function outputCharacterEquipChange()
{
	var out = $("#simulation_output");
	out.html(""); //Empty output
	$("#righttable").html(""); //Empty character table
	//No need to check msnt data integrity here
	out.html("<br/><div style='float:left;' class='userinputdiv'>Please choose the character you want to change equipments :<br/><select id='ch_equip_ch'></select></div>");
	out.append("<div style='clear:both;'></div><br/><input type='button' id='equip_ch' value='GO' /></div><br/><br/><div id='out_equip_ch'></div>");

	var sel_out = $("#ch_equip_ch");
	$(CHARACTERS).each(function(id,it)
	{
		sel_out.append("<option value='" + id + "'>" + it.name + "</option>");
	});

	$("#equip_ch").click(function()
	{
		$("#out_equip_ch").html("");
		var id = $("#ch_equip_ch").val();
		CHARACTERS[id].displayItemChangeMenu("out_equip_ch");
	});

}

function outputDefenseSimulation()
{
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");
	out.html("<br/><div style='float:left;' class='userinputdiv'>Please choose an attack to simulate : <br/><select id='ch_attack'></select></div>");
	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose the character(s) to perform the attack : <br/><table style='width:100%;'><tbody id='def_sim_select_chars'></tbody></table></div>");

	out.append("<div style='clear:both;'></div><br/><br/><div id='out_att_simulation'></div>");

	var sel_out = $("#ch_attack");
	$(ATTACKS).each(function(id,it)
	{
		sel_out.append("<option value='" + id + "'>" + it.name + "</option>");	
	});
	var sel_outwho = $("#def_sim_select_chars");
	var tmp = "";
	$(CHARACTERS).each(function(id,it)
	{
		if ((!tmp)||(id%3==0))
		{
			tmp += "<tr>";
		}
		tmp += "<td>"
		tmp += "<input type='checkbox' id='def_sim_ch_" + id + "' />";
		tmp += it.name;
		tmp += "</td>"
		if ((id%3==2))
		{
			tmp += "</tr>";
		}

	});
	if (!tmp.endsWith("</tr>")) {tmp += "</tr>";}
	sel_outwho.html(tmp);

	$(CHARACTERS).each(function(id,it)
	{
		$("#def_sim_ch_"+id).change(function(){refreshDefenseSimulationCompareCharts()});
	});
	sel_out.change(function(){refreshDefenseSimulationCompareCharts()});
	
}

function refreshDefenseSimulationCompareCharts()
{
	$("#out_att_simulation").html("");
	if (!initSimulation()) //Re-read monster values
	{
		return;
	}

	var who = [];
	$(CHARACTERS).each(function(id,it)
	{
		if ( $("#def_sim_ch_" + id).is( ":checked" ) )
		{
			who[who.length] = id;
		}
	});
	if (who.length > 0)
	{
		$("#out_att_simulation").html("");
		DISPLAYED = "chart_msnt_def";
		outputCharacterTableAttacks("out_att_simulation",$("#ch_attack").val(),who);
	}
	else
	{
		$("#out_att_simulation").html("");
	}
}

function M_check()
{
	var return_val = true;
	$(monsterStats).each(function(id,it)
	{
		
		if ( isNaN(MONSTER[it][0]) || isNaN(MONSTER[it][1]) || isNaN(MONSTER[it][2]) )
		{
			return_val = false;
			return;
		}		
	});
	return return_val;
}

function M_readMonster()
{
	this.mhp[0] = readAndCheckValue("mhp_b",0,true);
	this.mhp[1] = readAndCheckValue("mhp_pi",0,true);
	this.mhp[2] = readAndCheckValue("mhp_ri",0,true);
	this.mmp[0] = readAndCheckValue("mmp_b",0,true);
	this.mmp[1] = readAndCheckValue("mmp_pi",0,true);
	this.mmp[2] = readAndCheckValue("mmp_ri",0,true);
	this.atk[0] = readAndCheckValue("atk_b",0,true);
	this.atk[1] = readAndCheckValue("atk_pi",0,true);
	this.atk[2] = readAndCheckValue("atk_ri",0,true);
	this.def[0] = readAndCheckValue("def_b",0,true);
	this.def[1] = readAndCheckValue("def_pi",0,true);
	this.def[2] = readAndCheckValue("def_ri",0,true);
	this.mat[0] = readAndCheckValue("mat_b",0,true);
	this.mat[1] = readAndCheckValue("mat_pi",0,true);
	this.mat[2] = readAndCheckValue("mat_ri",0,true);
	this.mdf[0] = readAndCheckValue("mdf_b",0,true);
	this.mdf[1] = readAndCheckValue("mdf_pi",0,true);
	this.mdf[2] = readAndCheckValue("mdf_ri",0,true);
	this.agi[0] = readAndCheckValue("agi_b",0,true);
	this.agi[1] = readAndCheckValue("agi_pi",0,true);
	this.agi[2] = readAndCheckValue("agi_ri",0,true);
	this.luk[0] = readAndCheckValue("luk_b",0,true);
	this.luk[1] = readAndCheckValue("luk_pi",0,true);
	this.luk[2] = readAndCheckValue("luk_ri",0,true);
	this.exp[0] = readAndCheckValue("exp_b",0,true);
	this.exp[1] = readAndCheckValue("exp_pi",0,true);
	this.exp[2] = readAndCheckValue("exp_ri",0,true);
	this.gold[0] = readAndCheckValue("gold_b",0,true);
	this.gold[1] = readAndCheckValue("gold_pi",0,true);
	this.gold[2] = readAndCheckValue("gold_ri",0,true);

	this.max_level = readAndCheckValue("mon_max_lv",0,true);
}

function M_updateTable()
{  

	if ( (this.name) && (this.name != "Custom Monster"))
	{
		$("#mnst_name").show();
		$("#mnst_name").html("Current Monster : " + this.name + " <br/><br/>");
	}

	setValue("mon_max_lv",this.max_level);	
	setValue("mhp_b",this.mhp[0]);
	setValue("mhp_pi",this.mhp[1]);
	setValue("mhp_ri",this.mhp[2]);
	setValue("mmp_b",this.mmp[0]);
	setValue("mmp_pi",this.mmp[1]);
	setValue("mmp_ri",this.mmp[2]);
	setValue("atk_b",this.atk[0]);
	setValue("atk_pi",this.atk[1]);
	setValue("atk_ri",this.atk[2]);
	setValue("def_b",this.def[0]);
	setValue("def_pi",this.def[1]);
	setValue("def_ri",this.def[2]);
	setValue("mat_b",this.mat[0]);
	setValue("mat_pi",this.mat[1]);
	setValue("mat_ri",this.mat[2]);
	setValue("mdf_b",this.mdf[0]);
	setValue("mdf_pi",this.mdf[1]);
	setValue("mdf_ri",this.mdf[2]);
	setValue("agi_b",this.agi[0]);
	setValue("agi_pi",this.agi[1]);
	setValue("agi_ri",this.agi[2]);
	setValue("luk_b",this.luk[0]);
	setValue("luk_pi",this.luk[1]);
	setValue("luk_ri",this.luk[2]);
	setValue("exp_b",this.exp[0]);
	setValue("exp_pi",this.exp[1]);
	setValue("exp_ri",this.exp[2]);
	setValue("gold_b",this.gold[0]);
	setValue("gold_pi",this.gold[1]);
	setValue("gold_ri",this.gold[2]);
}

function resetTableDefault()
{
	$("#mhp_pi").val(monsterDefault.mhp[0]);
	$("#mhp_ri").val(monsterDefault.mhp[1]);
	$("#mmp_pi").val(monsterDefault.mmp[0]);
	$("#mmp_ri").val(monsterDefault.mmp[1]);
	$("#atk_pi").val(monsterDefault.atk[0]);
	$("#atk_ri").val(monsterDefault.atk[1]);
	$("#def_pi").val(monsterDefault.def[0]);
	$("#def_ri").val(monsterDefault.def[1]);
	$("#mat_pi").val(monsterDefault.mat[0]);
	$("#mat_ri").val(monsterDefault.mat[1]);
	$("#mdf_pi").val(monsterDefault.mdf[0]);
	$("#mdf_ri").val(monsterDefault.mdf[1]);
	$("#agi_pi").val(monsterDefault.agi[0]);
	$("#agi_ri").val(monsterDefault.agi[1]);
	$("#luk_pi").val(monsterDefault.luk[0]);
	$("#luk_ri").val(monsterDefault.luk[1]);
	$("#exp_pi").val(monsterDefault.exp[0]);
	$("#exp_ri").val(monsterDefault.exp[1]);
	$("#gold_pi").val(monsterDefault.gold[0]);
	$("#gold_ri").val(monsterDefault.gold[1]);
}

function setupImportFunctions()
{
	var out = $("#import_mnst");

	if (MNSTDB && MNSTDB.length > 0)
	{
		out.html("Import an existing monster?<br/>");
		out.append("<select id='mimp_sel'></select>");
		var sel = $("#mimp_sel");
		$(MNSTDB).each(function(id,it) 
		{
			sel.append("<option value='" + id + "'>" + it.name + "</option>");
		});
		out.append("<input type='button' id='importme' value='import' /><br/><br/>");

		$("#importme").click(function()
		{
			var chosen_m = $("#mimp_sel").val();
			MNSTDB[chosen_m].updateTable();
			refreshAllCharts();
		});
	}
}

function M_getNotetags(hidedefault)
{
	var ret="";
	if (this.max_level < 99)
	{
		ret += "&lt;max level: " + this.max_level + "&gt;<br/>"
	}
	
	var tmp_mnst = this;

	$(monsterStats).each(function(id,it)
	{

		//Taking into account the exp/gold bug in YEA enemy levels script		
		var that = it;
		if (it == "gold")
		{
			that = "exp";
		}
		if (it == "exp")
		{
			that = "gold";
		}
		//end of bug workaround

		if ((tmp_mnst[it][1] != monsterDefault[it][0] )||(!hidedefault))
		{
			ret += "&lt;" + that + ": +" + tmp_mnst[it][1] + "% per level&gt;<br/>"
		}

		if ((tmp_mnst[it][2] != monsterDefault[it][1] )||(!hidedefault))
		{
			ret += "&lt;" + that + ": +" + tmp_mnst[it][2] + " per level&gt;<br/>"
		}
	});

	return ret;

}


var FILTER_NOTETAGS = false;
function outputNotetags()
{
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");
	
	out.html("<br/><br/><input type='button' value='' id='filter_note' /><br/>");
	out.append("In &quot;YEA enemy level&quot; script the exp and gold tags are mixed up. This will also be the case here.");
	out.append("<pre id='notetags'></pre>");

	$("#filter_note").click(function()
	{
		FILTER_NOTETAGS = !FILTER_NOTETAGS;
		refreshNotetags();
	});

	refreshNotetags();
}



function refreshNotetags()
{
	DISPLAYED = "notetags";

	if (!initSimulation())
	{
		return;
	}
	if (FILTER_NOTETAGS)
	{
		$("#filter_note").val("Display all notetags (even default values)")
	}
	else
	{
		$("#filter_note").val("filter useless notetags")
	}
	$("#notetags").html(MONSTER.getNotetags(FILTER_NOTETAGS));
}


function updateRadarCharacterCharts()
{
	var levelinput = $("#rad_level_in");
	var showmana = $("#showma_in");
	

	var level = readAndCheckValue("rad_level_in",1,true);
	if (level > 99)
	{
		level = 99;
		levelinput.val(99);		
	}
	var maxes = [0,0,0,0,0,0,0,0];
	var values = {};
	$(CHARACTERS).each(function(charid,charit)
	{
		$(characterStats).each(function(id,it)
		{
			var cap = 9999;
			if (id > 1) {cap = 999;}			
			var val = masterCharacterFormula(charit.stats[it],level,cap);
			if (val > maxes[id])
			{
				maxes[id] = val;
			}
		});
	});
	$(CHARACTERS).each(function(charid,charit)
	{
		values[charid] = [];
		$(characterStats).each(function(id,it)
		{
			var cap = 9999;
			if (id > 1) {cap = 999;}
			values[charid][id] = Math.round(10000*masterCharacterFormula(charit.stats[it],level,cap) / maxes[id]) /100;
		});
		
	});

	//update chart!

	var showma = showmana.is(':checked');
	var labels = ((showma)?(["mhp","mmp","atk","def","mat","mdf","agi","luk"]):(["mhp","atk","def","mat","mdf","agi","luk"]));
	var datasets = [];

	$(CHARACTERS).each(function(id,it)
	{
		if ( $("#cmp_rad_ch_" + id).is(':checked') )
		{
			var t = values[id];
			datasets[datasets.length] = 
			{
				label: it.name, 
				data: ((showma)?(t):([t[0],t[2],t[3],t[4],t[5],t[6],t[7]])),
				borderColor : it.color
			 };
		}
	});

	CHARTS[0].data = {labels:labels, datasets:datasets };
	CHARTS[0].update();

}

function outputCharacterAttacksComparison()
{
	var out = $("#simulation_output");
	out.html("");
	if (!initSimulation())
	{
		return;
	}

	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose the character<br/> who will perform attacks<br/><br/><select id='char_cmp_atk_sel'></select></div>");

	var selout = $("#char_cmp_atk_sel");
	$(CHARACTERS).each(function(id,it)
	{
		selout.append("<option value='" + id + "'>" + it.name + "</option>");
	});

	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose the attacks to compare : <br/><table style='width:100%;'><tbody id='atk_cmp_select_atk'></tbody></table></div>");

	out.append("<div style='clear:both;'></div><br/><br/>");

	var sel_outatk = $("#atk_cmp_select_atk");
	var tmp = "";
	$(ATTACKS).each(function(id,it)
	{
		if ((!tmp)||(id%3==0))
		{
			tmp += "<tr>";
		}
		tmp += "<td>"
		tmp += "<input type='checkbox' id='atk_cmp_atk_" + id + "' />";
		tmp += it.name;
		tmp += "</td>"
		if ((id%3==2))
		{
			tmp += "</tr>";
		}

	});
	if (!tmp.endsWith("</tr>")) {tmp += "</tr>";}
	sel_outatk.html(tmp);

	
	$(ATTACKS).each(function(id,it)
	{
		$("#atk_cmp_atk_" + id).change(function(){ updateAttackComparisonChart(); });
	});
	selout.change(function(){ updateAttackComparisonChart(); });

	out.append("<div id='atkcmp_chart' class='chartcontainerRadar' style='display:none;'><canvas id='atkcmp_0'></canvas></div>");
	out.append("<div id='atkcmp_chart_rel' class='chartcontainerRadar' style='display:none;'><canvas id='atkcmp_1'></canvas></div>");
	var ctx  = document.getElementById("atkcmp_0").getContext('2d');
	var ctx2 = document.getElementById("atkcmp_1").getContext('2d');

	CHARTS = [];
	CHARTS[0] = new Chart(ctx, { type:'line', 
		data: 
		{
			labels : null,
			datasets: [],
		},
		options: 
		{
			scaleBeginAtZero: false,
			maintainAspectRatio: false,
			scales : 
			{
				xAxes : [{ ticks:{min:((SHOWBEFORELEVELTEN)?(1):(10))},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
				yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage'}}]
			}
		}
	});

	CHARTS[1] = new Chart(ctx2, { type:'line', 
		data: 
		{
			labels : null,
			datasets: [],
		},
		options: 
		{
			scaleBeginAtZero: false,
			maintainAspectRatio: false,
			scales : 
			{
				xAxes : [{ ticks:{min:((SHOWBEFORELEVELTEN)?(1):(10))},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
				yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Damage%'}}]
			}
		}
	});
}

function updateAttackComparisonChart()
{
	if (!initSimulation())
	{
		return;
	}

	DISPLAYED = "chart_atk_cmp";

	var chosenchar = CHARACTERS[$("#char_cmp_atk_sel").val()];
	var chosenatk = [];
	$(ATTACKS).each(function(id,it)
	{
		if ($("#atk_cmp_atk_" + id).is(':checked'))
		{
			chosenatk[chosenatk.length] = id;
		}
	});

	var labels = [];
	var datasets = [];
	var datasetsRel = [];

	$(chosenatk).each(function(id,it)
	{
		datasets[datasets.length] = 
		{
			label : "Damage using " + ATTACKS[it].name,
			backgroundColor: COLORS[id%COLORS.length],
			borderColor: COLORS[id%COLORS.length],
			fill:false,
			data : []
		};
		datasetsRel[datasetsRel.length] = 
		{
			label : "Relative Dmg% using " + ATTACKS[it].name,
			backgroundColor: COLORS[id%COLORS.length],
			borderColor: COLORS[id%COLORS.length],
			fill:false,
			data : []
		};
	});


	for (var i= ((SHOWBEFORELEVELTEN)?(0):(9));i<99;i++)
	{
		var level = i+1;
		var index = labels.length;
		labels[index] = level;
		var mhp = MONSTER.getStat("mhp",level);
		$(chosenatk).each(function(id,it)
		{
			var attack = ATTACKS[it];
			var dmg = MONSTER.simulateDamageFrom(level, chosenchar.stats, attack, []);
			var dmgperc = Math.floor(dmg / mhp * 10000)/100;

			datasets[id].data[index] = dmg;
			datasetsRel[id].data[index] = dmgperc;
		});
	}

	CHARTS[0].data = {labels:labels, datasets:datasets };
	CHARTS[0].update();
	CHARTS[1].data = {labels:labels, datasets:datasetsRel };
	CHARTS[1].update();
	$("#atkcmp_chart").show();
	$("#atkcmp_chart_rel").show();
}



function outputMonsterAilmentSimulator()
{
	
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");

	out.append("<br/><div style='float:left;margin-left:40px;' class='userinputdiv'><div style='margin-bottom:8px;font-weight:bold;'>Options</div><div style='margin-bottom:8px;'>Skill base ailment probability : <input type='text' value='50' id='mais_basep' />%<div>Display party probability? <input type='checkbox' id='showpowfour_in'></div></div></div>");

	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose which character will receive<br/>and inflict the ailment to the current monster<br/><br/><select id='char_ailm_sel'></select></div>");

	out.append("<div style='clear:both;'></div><br/>");

	var selout = $("#char_ailm_sel");
	$(CHARACTERS).each(function(id,it)
	{
		selout.append("<option value='" + id + "'>" + it.name + "</option>");
	});

	out.append("<div id='ailm_chart' class='chartcontainerRadar' style='display:none;'><canvas id='ailm_0'></canvas></div>");
	var ctx = document.getElementById("ailm_0").getContext('2d');

	CHARTS = [];
	CHARTS[0] = new Chart(ctx, { type:'line', 
		data: 
		{
			labels : null,
			datasets: [],
		},
		options: 
		{
			scaleBeginAtZero: true,
			maintainAspectRatio: false,
			scales : {
					xAxes : [{ ticks:{min:1,max:99},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ ticks:{beginAtZero: true,max:100},display:true, scaleLabel: {display:true, labelString: '% chance'}}]
			}
		}
	});

	selout.change(function() { updateAilmentChart(); } );
	$("#mais_basep").change(function() { updateAilmentChart(); } );
	$("#showpowfour_in").change(function() { updateAilmentChart(); } );
	updateAilmentChart();
}

function updateAilmentChart()
{
	var chosenchar = CHARACTERS[$("#char_ailm_sel").val()];
	var baseProba = readAndCheckValue("mais_basep",0,false);
	var showpowfour = $("#showpowfour_in");
	var showpf = showpowfour.is(':checked');


	if (isNaN(baseProba))
	{
		return;
	}
	if (!initSimulation())
	{
		return;
	}

	DISPLAYED = "chart_ailment";

	var labels = [];
	var datasets = [
	{
		label : "Probability for " + chosenchar.name + " to inflict the ailment",
		backgroundColor: "#0000ff",
		borderColor: "#0000ff",
		fill:false,
		data : []
	},
	{
		label : "Probability that " + chosenchar.name + " will receive the ailment",
		backgroundColor: "#ff0000",
		borderColor: "#ff0000",
		fill:false,
		data : []
	}
	];

	if (showpf)
	{
		datasets[0] = 
		{
			label : "Probability that a 4 people party (with same luk) will receive the ailment",
			backgroundColor: "#0000ff",
			borderColor: "#0000ff",
			fill:false,
			data : []
		}
	}

	for(var i=0;i<99;i++)
	{
		var lv = i+1;
		labels[i] = lv;

		var mnst_luk = MONSTER.getStat("luk",lv);
		var char_luk = masterCharacterFormula(chosenchar.stats["luk"],lv,999);

		if (showpf)
		{
			datasets[0].data[i] = computeMultipleAilmentProbability(baseProba,mnst_luk,char_luk,4);
		}
		else
		{
			datasets[0].data[i] = computeAilmentProbability(baseProba,char_luk,mnst_luk);
		}
		datasets[1].data[i] = computeAilmentProbability(baseProba,mnst_luk,char_luk);		
	}

	CHARTS[0].data = {labels:labels, datasets:datasets };
	CHARTS[0].update();
	$("#ailm_chart").show();

}

function computeMultipleAilmentProbability(base_proba,attacker_luk,defender_luk,party_size)
{
	/* Probability in % (0-100) not (0-1) */
	var ret = base_proba / 100 * ( 1 + (attacker_luk - defender_luk) / 1000 );
	ret = Math.pow(ret,party_size) * 100;
	if (ret > 100) {ret = 100;}
	if (ret < 0) {ret = 0;}

	ret = Math.floor(ret * 100)/100;//Round down

	return ret;
}


function computeAilmentProbability(base_proba,attacker_luk,defender_luk)
{
	/* Probability in % (0-100) not (0-1) */
	var ret = base_proba * ( 1 + (attacker_luk - defender_luk) / 1000 );
	if (ret > 100) {ret = 100;}
	if (ret < 0) {ret = 0;}

	ret = Math.floor(ret * 100)/100;//Round down

	return ret;
}

function outputMonsterCompareRadar()
{
	removeAllDisplay()
	if (!initSimulation())
	{
		return;
	}

	var out = $("#simulation_output");

	out.append("<br/><div style='float:left;margin-left:40px;' class='userinputdiv'><div style='margin-bottom:8px;font-weight:bold;'>Options</div><div style='margin-bottom:8px;'>Level : <input type='text' value='99' id='rad_level_in' /></div><div>Show MMP? <input type='checkbox' id='showma_in' /></div></div>");

	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose a Monster in the database<br/>to compare it with current Monster : <br/><br/><select id='mnst_rad_cmp_sel'><option value='-1'>Select a Monster</option></select></div>");

	out.append("<div style='clear:both;'></div><br/>");

	var selout = $("#mnst_rad_cmp_sel");
	$(MNSTDB).each(function(id,it)
	{
		selout.append("<option value='" + id + "'>" + it.name + "</option>");
	});

	out.append("<div id='rad_chart_mnst' class='chartcontainerRadar' style='display:none;'><canvas id='radar_0'></canvas></div>");
	var ctx = document.getElementById("radar_0").getContext('2d');
	
	CHARTS = [];
	CHARTS[0] = new Chart(ctx, 
	{
    		type: 'radar',
    		data: 
		{
    			labels: null,
    			datasets: null,
		},
		options : 
		{
			maintainAspectRatio: false,
			scale: 
			{
				display: true,
				ticks : 
				{
					display : false,
					beginAtZero: true,
					max : 100
				}
			}
		}
	});

	$("#rad_level_in").change(function(){refreshMonsterCompareRadar();});
	$("#showma_in").change(function(){refreshMonsterCompareRadar();});
	selout.change(function(){refreshMonsterCompareRadar();});
}

function refreshMonsterCompareRadar()
{
	var levelinput = $("#rad_level_in");
	var showmana = $("#showma_in");
	var selout = $("#mnst_rad_cmp_sel");

	var showma = showmana.is(':checked');

	var level = readAndCheckValue("rad_level_in",1,true);
	if (level > 99)
	{
		level = 99;
		levelinput.val(99);		
	}

	if (selout.val() == "-1")
	{
		$("#rad_chart_mnst").hide();
		return;
	}

	if (!initSimulation())
	{
		return;
	}


	DISPLAYED = "chart_mnst_radar";

	var CMP = MNSTDB[selout.val()];	

	var labels = ((showma)?(["mhp","mmp","atk","def","mat","mdf","agi","luk"]):(["mhp","atk","def","mat","mdf","agi","luk"]));
	var datasets = [{label:"Current Monster",data:[],borderColor:"#ff0000"},{label:CMP.name,data:[],borderColor:"#0000ff"}];

	$(labels).each(function(id,it)
	{
		var cu_s = MONSTER.getStat(it,level);
		var co_s = CMP.getStat(it,level);
		var max = ((cu_s > co_s)?(cu_s):(co_s));

		datasets[0].data[id] = Math.round((cu_s / max)*10000)/100;
		datasets[1].data[id] = Math.round((co_s / max)*10000)/100;
		
	});

	CHARTS[0].data = {labels:labels, datasets:datasets };
	CHARTS[0].update();
	$("#rad_chart_mnst").show();
}


function outputCharactersRadarChart()
{
	var out = $("#simulation_output");
	out.html("");

	out.append("<br/><div style='float:left;margin-left:40px;' class='userinputdiv'><div style='margin-bottom:8px;font-weight:bold;'>Options</div><div style='margin-bottom:8px;'>Level : <input type='text' value='99' id='rad_level_in' /></div><div>Show MMP? <input type='checkbox' id='showma_in' /></div></div>");
	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv'>Please choose the character(s) to compare : <br/><table style='width:100%;'><tbody id='rad_cmp_select_chars'></tbody></table></div>");
	out.append("<div style='clear:both;'></div><br/>");

	var whoChars = $("#rad_cmp_select_chars");

	var tmp = "";
	$(CHARACTERS).each(function(id,it)
	{
		if ((!tmp)||(id%3==0))
		{
			tmp += "<tr>";
		}
		tmp += "<td>"
		tmp += "<input type='checkbox' id='cmp_rad_ch_" + id + "' />";
		tmp += it.name;
		tmp += "</td>"
		if ((id%3==2))
		{
			tmp += "</tr>";
		}

	});
	if (!tmp.endsWith("</tr>")) {tmp += "</tr>";}
	whoChars.html(tmp);


	out.append("<div id='rad_chart' class='chartcontainerRadar'><canvas id='radar_0'></canvas></div>");
	var ctx = document.getElementById("radar_0").getContext('2d');

	CHARTS = [];
	CHARTS[0] = new Chart(ctx, 
	{
    		type: 'radar',
    		data: 
		{
    			labels: null,
    			datasets: null,
		},
		options : 
		{
			maintainAspectRatio: false,
			scale: 
			{
				display: true,
				ticks : 
				{
					display : false,
					beginAtZero: true,
					max : 100
				}
			}
		}
	});

	updateRadarCharacterCharts("rad_level_in","showma_in");
	
	$("#rad_level_in").change(function(){updateRadarCharacterCharts();});
	$("#showma_in").change(function(){updateRadarCharacterCharts();});
	$(CHARACTERS).each(function(id,it)
	{
		$("#cmp_rad_ch_" + id).change(function(){updateRadarCharacterCharts();});
	});
}

function outputCharacterSpeedRange()
{
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");

	out.append("<div style='float:left;margin-left:5px;' class='userinputdiv spdrng_ch'>Please choose the character you want<br/> the speed range displayed<br/><br/><select id='char_spd_rng_sel'></select></div>");
	
	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv spdrng_ch'>Which action is the<br/>character performing?<br/><br/><select id='skill_spd_rng_sel'></select></div>");

	out.append("<div style='float:left;margin-left:40px;' class='userinputdiv spdrng_ch'>Which action is the<br/>enemy performing?<br/><br/><select id='eskill_spd_rng_sel'></select></div>");

	out.append("<div style='clear:both;'></div><br/>");

	var chselout = $("#char_spd_rng_sel");
	$(CHARACTERS).each(function(id,it)
	{
		chselout.append("<option value='" + id + "'>" + it.name + "</option>");
	});

	var skselout = $("#skill_spd_rng_sel");
	$(ATTACKS).each(function(id,it)
	{
		skselout.append("<option value='" + id + "'>" + it.name + ((it.speed!=0)?(" (" + ((it.speed>0)?("+"):("")) + it.speed +  " speed)"):("")) + "</option>");
	});
	skselout.append("<option value='-1'>Use a Potion</option>");

	var eskselout = $("#eskill_spd_rng_sel");
	$(ATTACKS).each(function(id,it)
	{
		eskselout.append("<option value='" + id + "'>" + it.name + ((it.speed!=0)?(" (" + ((it.speed>0)?("+"):("")) + it.speed +  " speed)"):("")) + "</option>");
	});




	out.append("<div id='spd_rng_chart' class='chartcontainerRadar' style='display:none;'><canvas id='spd_rng_0'></canvas></div>");
	var ctx = document.getElementById("spd_rng_0").getContext('2d');

	out.append("<div id='act_first_chart' class='chartcontainerRadar' style='display:none;'><canvas id='spd_rng_1'></canvas></div>");
	var ctx2 = document.getElementById("spd_rng_1").getContext('2d');

	CHARTS = [];
	CHARTS[0] = new Chart(ctx, { type:'line', 
		data: 
		{
			labels : null,
			datasets: [],
		},
		options: 
		{
			legend : 
			{
				labels : 
				{
					filter: function(it,cd)
					{
						return it.datasetIndex%2==1;
					}
				}
			},
			elements : 
			{
				point : 
				{
					radius : 0,
					hitradius : 3,
					hoverRadius : 3
				}
			},
			scaleBeginAtZero: true,
			maintainAspectRatio: false,
			scales : {
					xAxes : [{ ticks:{min:1,max:99},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ ticks:{beginAtZero: true},display:true, scaleLabel: {display:true, labelString: 'Speed Range'}}]
			}
		}
	});

	CHARTS[1] = new Chart(ctx2, { type:'line', 
		data: 
		{
			labels : null,
			datasets: [],
		},
		options: 
		{
			scaleBeginAtZero: true,
			maintainAspectRatio: false,
			scales : {
					xAxes : [{ ticks:{min:1,max:99},display:true, scaleLabel: {display:true, labelString: 'Level'}}],
					yAxes : [{ ticks:{beginAtZero: true,max:100},display:true, scaleLabel: {display:true, labelString: '% chance'}}]
			}
		}
	});

	$(".spdrng_ch").change(function() {refreshSpeedRangeChart();});
	refreshSpeedRangeChart();
}

function refreshSpeedRangeChart()
{
	var chosenchar = CHARACTERS[$("#char_spd_rng_sel").val()];
	var idchsk = $("#skill_spd_rng_sel").val();
	var sksp = (idchsk>-1)?(ATTACKS[idchsk].speed):(0);
	var esksp = ATTACKS[$("#eskill_spd_rng_sel").val()].speed;

	DISPLAYED = "chart_speed_range";

	var labels = [];
	var datasets = [
	{
		label : "Min Speed for " + chosenchar.name,
		backgroundColor: "rgba(0, 255, 0, 0.5)",
		borderColor: "rgba(0, 255, 0, 0)",
		fill:1,
		data : []
	},
	{
		label : "Speed range for " + chosenchar.name,
		backgroundColor: "rgba(0, 255, 0, 0.5)",
		borderColor: "rgba(0, 255, 0, 0)",
		fill:false,
		data : []
	},
	{
		label : "Min Speed for the enemy",
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		borderColor: "rgba(255, 0, 0, 0)",
		fill:3,
		data : []
	},
	{
		label : "Speed range for the enemy",
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		borderColor: "rgba(255, 0, 0, 0)",
		fill:false,
		data : []
	}
	];


	var labels2 = [];
	var datasets2 = [
	{
		label : "Probability that " + chosenchar.name + " acts first",
		backgroundColor: "rgba(0, 255, 0, 1)",
		borderColor: "rgba(0, 255, 0, 1)",
		fill:false,
		data : []
	}
	];

	for(var i=0;i<99;i++)
	{
		var lv = i+1;
		labels[i] = lv;
		labels2[i] = lv;

		var mnst_agi = MONSTER.getStat("agi",lv);
		var char_agi = masterCharacterFormula(chosenchar.stats["agi"],lv,999);
		var char_asp = chosenchar.at_speed;
		var char_tsp = ((idchsk>-1)?(char_asp):(0)) + sksp;

		//RPGM default says "speed = subject.agi + rand(5 + subject.agi / 4)"
                //But YEA battle engine says "speed = subject.agi" (Why?)

		var cmin = char_agi + char_tsp;
		//var cmax = char_agi/4 + 4 + char_agi + char_tsp; //rand(k) returns 0, 1, 2, ..., k-2, or k-1
                var cmax = cmin
		var emin = esksp + mnst_agi;
		//var emax = esksp + mnst_agi + mnst_agi/4 + 5; 
                var emax = emin

		datasets[0].data[i] = Math.floor(cmin);
		datasets[1].data[i] = Math.floor(cmax);

		datasets[2].data[i] = Math.floor(emin);
		datasets[3].data[i] = Math.floor(emax);

		//Computing probability
		var proba = null;
		if (emin >= cmax)
		{
			proba = 0;
		}
		else if (cmin >= emax)
		{
			proba = 1;
		}
		else
		{
			var elen = ((emax>cmax)?(emax-cmax):(0)) + ((emin>cmin)?(emin-cmin):(0));
			var clen = ((cmax>emax)?(cmax-emax):(0)) + ((cmin>emin)?(cmin-emin):(0));
			var tlen = ((emax>cmax)?(emax):(cmax)) - ((emin>cmin)?(cmin):(emin));
			var blen = tlen - elen - clen;

			proba = (clen + blen/2) / tlen;
		}
		proba = Math.floor(proba*10000) / 100;
		
		datasets2[0].data[i] = proba;
	}

	CHARTS[0].data = {labels:labels, datasets:datasets };
	CHARTS[0].update();
	CHARTS[1].data = {labels:labels2, datasets:datasets2 };
	CHARTS[1].update();
	//$("#spd_rng_chart").show();
	$("#act_first_chart").show();
}

function outputBattleStatistics()
{
	removeAllDisplay();
	if (!initSimulation())
	{
		return;
	}
	var out = $("#simulation_output");

	out.html("<br/><div style='float:left;' class='userinputdiv'>Party level<br/><input id='max_lv_ch' title='Level of your party members' type='text' value='35' /></div>");
	out.append("<div style='float:left;margin-left:20px;' class='userinputdiv'>Please choose the character(s) in your party : <br/><table style='width:100%;'><tbody id='ba_sta_select_chars'></tbody></table></div>");
	out.append("<div style='float:left;margin-left:20px;' id='out_ba_sta_simulation'></div><div style='clear:both;'></div>");

	var sel_outwho = $("#ba_sta_select_chars");
	var tmp = "";
	$(CHARACTERS).each(function(id,it)
	{
		if ((!tmp)||(id%3==0))
		{
			tmp += "<tr>";
		}
		tmp += "<td>"
		tmp += "<input type='checkbox' class='ba_sta_cb' id='ba_sta_ch_" + id + "' />";
		tmp += it.name;
		tmp += "</td>"
		if ((id%3==2))
		{
			tmp += "</tr>";
		}

	});
	if (!tmp.endsWith("</tr>")) {tmp += "</tr>";}
	sel_outwho.html(tmp);

	$("#max_lv_ch").change(function(){refreshBattleStatistics();});
	$(".ba_sta_cb").change(function(){refreshBattleStatistics();});
	refreshBattleStatistics();

}

function refreshBattleStatistics()
{
	DISPLAYED = "ba_sta";

	var out = $("#out_ba_sta_simulation");
	var clv = $("#max_lv_ch").val();
	
	var isDbGld = false;
	var maxAgi = -1;
	var scout = false;

	$(CHARACTERS).each(function(id,it) 
	{
		var mycb = $("#ba_sta_ch_" + id);
		if (mycb.is(':checked'))
		{
			//dbgold
			if (it.name==THIEFNAME) {isDbGld = true;}
			//scout
			if (it.name==SCOUTNAME) {scout = true;}
			//we'll assume that the party is all of the same level
			var myAgi = masterCharacterFormula(it.stats.agi,clv*1,999); 
			if (myAgi > maxAgi) {maxAgi = myAgi;}
		}
	
	});

	var lv_range = [clv-2,2+clv*1];

	if (lv_range[0] > MONSTER.max_level) {lv_range[0] = MONSTER.max_level;}
	if (lv_range[1] > MONSTER.max_level) {lv_range[1] = MONSTER.max_level;}
	var gold_range=[];
	gold_range[0] = monsterGoldFormula(MONSTER.gold,lv_range[0],clv*1);
	gold_range[1] = monsterGoldFormula(MONSTER.gold,lv_range[1],clv*1);
	if (isDbGld) {gold_range[0]*=2;gold_range[1]*=2;}
	var xp_range = [];
	xp_range[0] = MONSTER.getStat("exp",lv_range[0]);
	xp_range[1] = MONSTER.getStat("exp",lv_range[1]);
	var enAgi_range = [];
	enAgi_range[0] = MONSTER.getStat("agi",lv_range[0]);
	enAgi_range[1] = MONSTER.getStat("agi",lv_range[1]);
	var prepro_range = [], surpro_range = [];
	prepro_range[0] = Math.floor(10000*computePreemptiveProbability(maxAgi,enAgi_range[1],scout)[0])/100;
	prepro_range[1] = Math.floor(10000*computePreemptiveProbability(maxAgi,enAgi_range[0],scout)[0])/100;
	surpro_range[0] = Math.floor(10000*computePreemptiveProbability(maxAgi,enAgi_range[0],scout)[1])/100;
	surpro_range[1] = Math.floor(10000*computePreemptiveProbability(maxAgi,enAgi_range[1],scout)[1])/100;
	var escpro_range = [];
	escpro_range[0] = Math.floor(10000*computeChanceToEscape(maxAgi,enAgi_range[1]))/100;
	escpro_range[1] = Math.floor(10000*computeChanceToEscape(maxAgi,enAgi_range[0]))/100;


	out.html("<div style='float:left;' class='userinputdiv'><span class='redbold'>Battle statistics : </span><br/>" 
	+ ((lv_range[0]==lv_range[1])?("Enemy level : " + lv_range[0]):("Enemy level range : " + lv_range[0] + " - " + lv_range[1]))
	
	+ ((maxAgi>0)?
	(
		((prepro_range[0]==prepro_range[1])?("<br/>Chance for preemptive attack : " + prepro_range[0] + "%"):("<br/>Chance for preemptive attack range : " + prepro_range[0] + "% - " + prepro_range[1] + "%"))
		+ ((surpro_range[0]==surpro_range[1])?("<br/>Chance for surprise attack : " + surpro_range[0] + "%"):("<br/>Chance for surprise attack range : " + surpro_range[0] + "% - " + surpro_range[1] + "%"))
		+ ((escpro_range[0]==escpro_range[1])?("<br/>Chance to escape* : " + escpro_range[0] + "%"):("<br/>Chance to escape* range : " + escpro_range[0] + "% - " + escpro_range[1] + "%"))

	):(""))

	+ ((gold_range[0]==gold_range[1])?("<br/>Gold reward : " + gold_range[0]):("<br/>Gold reward range : " + gold_range[0] + " - " + gold_range[1]))
	+ ((xp_range[0]==xp_range[1])?("<br/>XP reward : " + xp_range[0]):("<br/>XP reward range : " + xp_range[0] + " - " + xp_range[1]))
	+ "</div>");

//+ "<br/>*escape chance increases by 10% for each failed try, up to 100%. 100% chance to escape if you had a preemptive attack."


	console.log("Max party agi = " + maxAgi);
	console.log("En. agi range = " + enAgi_range[0] + " - " + enAgi_range[1]);
		
}

function computeChanceToEscape(pagi,eagi)
{
	var ret = 1.5 - 1.0 * eagi / pagi;
	if (ret < 0) {ret = 0;}
	if (ret > 1) {ret = 1;}
	return ret;
}

function computePreemptiveProbability(pagi,eagi,scout)
{
	var ret = []; //[0] = chance to preempt, [1] = chance to be surprised
	if (pagi < eagi)
	{
		ret[0] = 0.03;
		ret[1] = 0.05;
	}
	else
	{
		ret[0] = 0.05;
		ret[1] = 0.03;
	}
	if (scout)
	{
		ret[0] *= 4;
	}

	//The game uses two rolls - weird... - so we can have both "pre" and "sur"
	//in this case "sur" is canceled so :
	ret [1] *= (1-ret[0]); //Removing collision probability from "sur" chance

	return ret;
}

function removeAllDisplay()
{
	$("#simulation_output").html(""); //Empty output
	$("#righttable").html(""); //Empty character table
	DISPLAYED = null;	
}


function refreshAllCharts()
{
	if (initSimulation())
	{
		if (DISPLAYED == "chart_stats")
		{
			removeAllDisplay();
			outputMonsterChartStats("simulation_output");
		}
		if (DISPLAYED == "chart_mnst_radar")
		{
			refreshMonsterCompareRadar();
		}
		if (DISPLAYED == "notetags")
		{
			refreshNotetags();
		}
		if (DISPLAYED == "chart_msnt_attack")
		{
			refreshMonsterTableAttacks();
		}
		if (DISPLAYED == "chart_msnt_def")
		{
			refreshDefenseSimulationCompareCharts();
		}
		if (DISPLAYED == "chart_ailment")
		{
			updateAilmentChart();
		}
		if (DISPLAYED == "chart_atk_cmp")
		{
			updateAttackComparisonChart();
		}
		if (DISPLAYED == "chart_speed_range")
		{
			refreshSpeedRangeChart();
		}
		if (DISPLAYED == "ba_sta")
		{
			refreshBattleStatistics();
		}
	}
}

function changedMonsterValue()
{
	MONSTER.name = "Custom monster";
	$("#mnst_name").hide();
	refreshAllCharts();
}


//Initialize
var MONSTER = new Monster();
$(function()
{
resetTableDefault();
setupImportFunctions();
$("#testme1" ).click(function() {outputSimulation();});
$("#testme2" ).click(function() {outputAttackSimulation();});
$("#testme3" ).click(function() {outputNotetags();});
$("#testme4" ).click(function() {outputDefenseSimulation();});
$("#testme5" ).click(function() {outputCharacterEquipChange();});
$("#testme6" ).click(function() {outputCharacterCompare();});
$("#testme7" ).click(function() {outputCharactersRadarChart();});
$("#testme8" ).click(function() {outputMonsterCompareRadar();});
$("#testme9" ).click(function() {outputMonsterAilmentSimulator();});
$("#testme10").click(function() {outputCharacterAttacksComparison();});
$("#testme11").click(function() {outputCharacterSpeedRange();});
$("#testme12").click(function() {outputBattleStatistics();});


//On change for values
$("input.onch_tr").change(function() {changedMonsterValue();});

});

