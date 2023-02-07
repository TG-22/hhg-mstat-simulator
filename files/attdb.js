/*
Leveling Monster Stats Simulator by TG22 (c) 2018-2019
Attacks "database" file

*/

var ATTACKS = 
[
	new Attack("[001]Attack"         ,  0,function(stats) {return 4*stats.a.atk - 2*stats.b.def;}),
	new Attack("[004]Double Attack"  ,  0,function(stats) {return 4*stats.a.atk - 2*stats.b.def;}),
	new Attack("[051]Fire"           ,  0,function(stats) {return 15*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[053]Flame"          ,-10,function(stats) {return 15*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[055]Ice"            ,  0,function(stats) {return 15*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[057]Blizzard"       ,-10,function(stats) {return 15*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[061]Spark"          ,-10,function(stats) {return 20*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[065]Stone"          , -5,function(stats) {return 30*stats.a.lv+3*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[066]Quake"          ,-15,function(stats) {return 300 + 2*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[080]Strong Attack"  ,  0,function(stats) {return 5*stats.a.atk-2*stats.b.def;}),
	new Attack("[081]Cleave"         ,  0,function(stats) {return 2*stats.a.atk - 1*stats.b.def;}),
	new Attack("[084]Massive Cleave" ,  0,function(stats) {return 12*stats.a.atk - 6*stats.b.def;}),
	new Attack("[085]Tackle"         ,  0,function(stats) {return 4*stats.a.atk + 2*stats.a.def - 2*stats.b.def;}),
	new Attack("[088]Leaping Fury"   ,100,function(stats) {return 5*stats.a.atk;}),
	new Attack("[089]Spear Dance"    ,  0,function(stats) {return 12*stats.a.atk;}),
	new Attack("[108]Triple Shot"    ,  0,function(stats) {return 4*stats.a.atk + 2*stats.a.agi - 2*stats.b.def;}),
	new Attack("[109]Thousand Arrows",  0,function(stats) {return 3*stats.a.atk + 2*stats.a.agi - 2*stats.b.def;}),
	new Attack("[132]Acid Bomb"      ,200,function(stats) {return 20 + 0.8*stats.a.atk - 0.4*stats.b.def;}),
	new Attack("[158]Gore"           , 30,function(stats) {return 5*stats.a.atk - 2*stats.b.def;}),
	new Attack("[162]Acid spit"      ,120,function(stats) {return 2*stats.a.atk - 2*stats.b.def;}),
	new Attack("[163]Encircle"       , 80,function(stats) {return 6*stats.a.atk;}),
	new Attack("[165]Dragons Breath" ,-10,function(stats) {return 250 + 4*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[169]Incinerate"     ,-10,function(stats) {return 450 + 4*stats.a.mat - 2*stats.b.mdf;}),
	new Attack("[187]Bleed"          , 30,function(stats) {return 100 + 4*stats.a.atk;}),
	new Attack("[203]Deep Freeze"    , 80,function(stats) {return 50 + 2*stats.a.atk;}),
	new Attack("[209]Whirling spear" ,  0,function(stats) {return 3*stats.a.atk - 1*stats.b.def;}),
	new Attack("[210]Frozen Fury"    ,100,function(stats) {return 600 + 1*stats.a.atk+2*stats.a.mat - 2*stats.b.def;}),
	new Attack("[227]Blade Fury"     ,  0,function(stats) {return 5*stats.a.atk - 2*stats.b.def;}),
	new Attack("[241]Corrosive Spray",-50,function(stats) {return 30 + 8*stats.a.atk - 9*stats.b.def;}),
	new Attack("[260]Reckless Swing" ,  0,function(stats) {return 10*stats.a.atk - 2*stats.b.def;}),
	new Attack("[274]Dust storm"     ,-15,function(stats) {return 10*stats.a.lv + 3*stats.a.mat - 2*stats.b.mdf;})
];
