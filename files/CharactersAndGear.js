/*
Leveling Monster Stats Simulator by TG22 (c) 2018-2019
Characters and Gear management file.

*/



function GameCharacter(cname,lvo,lvnn)
{
	this.name = cname;
	this.color = "#ff0000";
	this.id = NaN;

	this.isDualWield = false;

	this.stats = 
	{
		"mhp" : [lvo[0],lvnn[0],0,0],
		"mmp" : [lvo[1],lvnn[1],0,0],
		"atk" : [lvo[2],lvnn[2],0,0],
		"def" : [lvo[3],lvnn[3],0,0],
		"mat" : [lvo[4],lvnn[4],0,0],
		"mdf" : [lvo[5],lvnn[5],0,0],
		"agi" : [lvo[6],lvnn[6],0,0],
		"luk" : [lvo[7],lvnn[7],0,0]
	}

	this.at_speed = 0;

	this.eqSlots = 
	{
		"mh":null,
		"oh":null,
		"hl":null,
		"ba":null,
		"ac":null
	};

	this.pups = [];

	this.changeEq = C_changeEq;
	this.assignEq = C_assignEq; //Private Method. Don't use it unless you know what you do
	this.refresh = C_refresh;
	this.hasPUP = C_hasPUP;
	this.applyEffect = C_applyEffect;
	this.getStats = C_getStats;
	this.eraseEffects = C_eraseEffects;
	this.displayStats = C_displayStats;
	this.equippedItemName = C_equippedItemName;
	this.equippedItemId = C_equippedItemId;
	this.pupName = C_pupName;
	this.displayItemChangeMenu = C_displayItemChangeMenu;
	this.getId = C_getId;
	this.emptySlot = C_emptySlot;
	this.removePowerUp = C_removePowerUp;
	this.applyPowerUp = C_applyPowerUp;
}

function C_removePowerUp(pupid)
{
	if (this.hasPUP(ITEMS[pupid]))
	{
		if (this.pups.length == 1)
		{
			this.pups = [];
		}
		else //obviously len >1
		{
			var pupname = ITEMS[pupid].name;
			var tmppups = [];
			for (var i=0;i<this.pups.length;i++)
			{
				if (pupname != this.pups[i].name)
				{
					tmppups[tmppups.length] = this.pups[i];
				}
			}
			this.pups = tmppups;
		}
		this.refresh();
	}
}

function C_emptySlot(slot)
{
	this.eqSlots[slot] = null;
	this.refresh();
}

function C_getId()
{
	if (isNaN(this.id))
	{
		var me = this;
		var ret = -1;
		$(CHARACTERS).each(function(id,it)
		{
			it.id = id;
			if (me.name == it.name)
			{
				ret = id;
			}
		});
		return ret;
	}
	return this.id;
}

function C_eraseEffects()
{
	var tmp_gc = this;
	$(["mhp","mmp","atk","def","mat","mdf","agi","luk"]).each(function(id,it)
	{
		tmp_gc.stats[it][2] = 0;
		tmp_gc.stats[it][3] = 0;
	});
}

function C_getStats()
{
	return this.stats;
}

function C_applyEffect(effect)
{
	if (effect.statName == "nooh") //No off hand - for two handed weapons. Will instantly remove any shield.
	{
		this.eqSlots["oh"] = null;
		//no need to refresh as oh is always processed last.
		return;
	}
	if (effect.statName == "aspd") //Attack Speed bonus (no % bonus ig)
	{
		this.at_speed += effect.value*1;
		return;
	}

	//else : base stat	
	this.stats[effect.statName][ ((effect.percent)?(3):(2)) ] += effect.value*1;

}

function C_refresh()
{

	this.eraseEffects();

	//start with pup
	for (var  i=0;i<this.pups.length;i++)
	{
		var pup = this.pups[i];
		for (var j=0;j<pup.effects.length;j++)
		{
			this.applyEffect(pup.effects[j]);
		}
	}
	//slots - oh must be the last processed one (as other items can disable this slot)
	var slots = ["mh","hl","ba","ac","oh"];
	for (var i=0;i<slots.length;i++)
	{
		var itm = this.eqSlots[slots[i]];
		if (itm) //Item in slot!
		{
			for (var j=0;j<itm.effects.length;j++)
			{
				this.applyEffect(itm.effects[j]);
			}
		}
	}
}

function C_hasPUP(newpup)
{
	if (newpup.slot != "pup")
	{
		return false;
	}
	var ret = false;
	$(this.pups).each(function(id,it)
	{
		if (it.name == newpup.name)
		{
			ret = true;
		}
	});
	return ret;
}

function C_assignEq(neweq,forceoh)
{
	if (neweq == null) {return;}
	if (neweq.slot == "pup")
	{
		if (!this.hasPUP(neweq))
		{
			this.pups[this.pups.length] = neweq;
		}
	}
	else
	{

		if ((this.isDualWield)&&(forceoh)&&(neweq.slot=="mh")&&(!neweq.isTwoHandedWeapon()))
		{
			this.eqSlots["oh"] = neweq;
		}
		else
		{
			this.eqSlots[neweq.slot] = neweq;
		}
	}
}

function C_changeEq(neweq,forceoh)
{
	if (neweq == null) {return;}
	this.assignEq(neweq,forceoh);
	this.refresh();
}

function C_applyPowerUp(mypup)
{
	if (mypup == null) {return;}
	if (mypup.slot == "pup")
	{
		this.assignEq(mypup);
		this.refresh();	
	}
}

function C_equippedItemName(slot,fullname)
{
	var MAXLEN = 20;
	if (this.eqSlots[slot])
	{
		var itna = this.eqSlots[slot].name
		if ((!fullname)&&(itna.length > MAXLEN))
		{
			itna = itna.substring(0,MAXLEN-3) + "...";
		}
		return itna;
	}
	else
	{
		return "";
	}
}

function C_equippedItemId(slot)
{
	if (this.eqSlots[slot])
	{
		return this.eqSlots[slot].getId();
	}
	return -1;
}

function C_pupName(id,fullname)
{
	var MAXLEN = 20;
	if (this.pups.length > id)
	{
		var puna = this.pups[id].name
		if ((!fullname)&&(puna.length > MAXLEN))
		{
			puna = puna.substring(0,MAXLEN-3) + "...";
		}
		return puna;
	}
	else
	{
		return "";
	}
}


function C_displayStats(output)
{
	$("#" + output).html("<table class='ch_tab'><tbody id='ch_tbdy'></tbody></table>");
	var tout = $("#ch_tbdy");
	tout.append("<tr><td class='ch_td_name' colspan='6'>" + this.name + "</td></tr>");	
	tout.append("<tr><td class='ch_td_title'>Equipped Items</td><td class='ch_td_title'></td><td class='ch_td_title'>Lv1 value</td>"
		+ "<td class='ch_td_title'>Lv99 value</td><td class='ch_td_title'>Itm bonus</td><td class='ch_td_title'>Itm bonus %</td></tr>");
	tout.append("<tr><td class='ch_td_itmna' title=\"" + this.equippedItemName("mh",true) + "\">" + this.equippedItemName("mh") + "</td><td class='ch_td_title'>MHP</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mhp"][0] + "</td><td class='ch_td_val'>" + this.stats["mhp"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mhp"][2] + "</td><td class='ch_td_val'>" + this.stats["mhp"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_itmna' title=\"" + this.equippedItemName("oh",true) + "\">" + this.equippedItemName("oh") + "</td><td class='ch_td_title'>MMP</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mmp"][0] + "</td><td class='ch_td_val'>" + this.stats["mmp"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mmp"][2] + "</td><td class='ch_td_val'>" + this.stats["mmp"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_itmna' title=\"" + this.equippedItemName("hl",true) + "\">" + this.equippedItemName("hl") + "</td><td class='ch_td_title'>ATK</td>" 
	+ "<td class='ch_td_val'>" + this.stats["atk"][0] + "</td><td class='ch_td_val'>" + this.stats["atk"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["atk"][2] + "</td><td class='ch_td_val'>" + this.stats["atk"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_itmna' title=\"" + this.equippedItemName("ba",true) + "\">" + this.equippedItemName("ba") + "</td><td class='ch_td_title'>DEF</td>" 
	+ "<td class='ch_td_val'>" + this.stats["def"][0] + "</td><td class='ch_td_val'>" + this.stats["def"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["def"][2] + "</td><td class='ch_td_val'>" + this.stats["def"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_itmna' title=\"" + this.equippedItemName("ac",true) + "\">" + this.equippedItemName("ac") + "</td><td class='ch_td_title'>MAT</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mat"][0] + "</td><td class='ch_td_val'>" + this.stats["mat"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mat"][2] + "</td><td class='ch_td_val'>" + this.stats["mat"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_pupna' title=\"" + this.pupName(0,true) + "\">" + this.pupName(0) + "</td><td class='ch_td_title'>MDF</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mdf"][0] + "</td><td class='ch_td_val'>" + this.stats["mdf"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["mdf"][2] + "</td><td class='ch_td_val'>" + this.stats["mdf"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_pupna' title=\"" + this.pupName(1,true) + "\">" + this.pupName(1) + "</td><td class='ch_td_title'>AGI</td>" 
	+ "<td class='ch_td_val'>" + this.stats["agi"][0] + "</td><td class='ch_td_val'>" + this.stats["agi"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["agi"][2] + "</td><td class='ch_td_val'>" + this.stats["agi"][3] + "</td></tr>");
	tout.append("<tr><td class='ch_td_pupna' title=\"" + this.pupName(2,true) + "\">" + this.pupName(2) + "</td><td class='ch_td_title'>LUK</td>" 
	+ "<td class='ch_td_val'>" + this.stats["luk"][0] + "</td><td class='ch_td_val'>" + this.stats["luk"][1] + "</td>" 
	+ "<td class='ch_td_val'>" + this.stats["luk"][2] + "</td><td class='ch_td_val'>" + this.stats["luk"][3] + "</td></tr>");	
}

var LASTMODIFIED = null;
function C_displayItemChangeMenu(output)
{
	if (!output)
	{
		output = "out_equip_ch";
	}

	LASTMODIFIED = this.getId();
	$("#" + output).html("<br/><div style='float:left;' id='itm_chg_menu'></div><div style='float:left;margin-left:10px;' id='statsoutput'></div><div style='clear:both;'></div>");
	$("#itm_chg_menu").html("<table class='itmchg'><tbody id='itmchgtbdy'><tr><td class='ict_h'>Slot</td><td class='ict_h'>Item</td></tr></tbody></table>");
	var itmtab = $("#itmchgtbdy");
	var me = this;
	var slots = [["mh","Main hand"],["oh","Off hand"],["hl","Helmet"],["ba","Body Armor"],["ac","Accessory"]];
	$(slots).each(function(id,it)
	{
		var eq = me.equippedItemId(it[0]);
		itmtab.append("<tr><td class='itmtype'>" + it[1] + "</td><td><select id='ch_itm_" + it[0] 
			+ "'><option value='-1'>Empty Slot</option></select></td></tr>");
		var sel_fill = $("#ch_itm_" + it[0]);
		$(ITEMS).each(function(itmid,itmit)
		{

			var disqualified = false;

			
			if (me.isDualWield)
			{
				//Dual Wielders (Rhea) can't use 2h weaps
				if ((itmit.isTwoHandedWeapon())&&(it[0] == "mh"))
				{
					disqualified = true;
				}
			}

			if ((itmit.slot == it[0])&&(!disqualified))
			{
				sel_fill.append(itmit.getItemAsOption(eq));
			}

			//add 1h weapons as possible offhand
			if ( (me.isDualWield) && (it[0] == "oh") && (itmit.slot == "mh") && (!itmit.isTwoHandedWeapon()) )
			{
				sel_fill.append(itmit.getItemAsOption(eq));
			}

		});
		$("#ch_itm_" + it[0]).change(function()
		{
			if (LASTMODIFIED != null)
			{
				var newitmid = $(this).val();
				var slot = this.id.substring(7);
				if (newitmid > -1)
				{
					if ((slot == "oh")&&(CHARACTERS[LASTMODIFIED].isDualWield))
					{
						CHARACTERS[LASTMODIFIED].changeEq(ITEMS[newitmid],true);
					}
					else
					{
						CHARACTERS[LASTMODIFIED].changeEq(ITEMS[newitmid]);
					}
				}
				else
				{
					
					CHARACTERS[LASTMODIFIED].emptySlot(slot);
				}
				CHARACTERS[LASTMODIFIED].displayItemChangeMenu();
			}
		});
	});

	var pups = listAllPuPs();
	if (this.pups.length < pups.length)
	{
		//add option
		itmtab.append("<tr><td class='puptit'>Add a powerup</td><td><select id='addpup_sel'></select>"
			+ " <input id='addpup_btn' type='button' value='add'></td></tr>");
		var seladd = $("#addpup_sel");		
		$(pups).each(function(id,it)
		{
			if (!me.hasPUP(ITEMS[it]))
			{
				seladd.append("<option value='" + it + "'>" + ITEMS[it].name + "</option>");
			}
		});
		$("#addpup_btn").click(function()
		{
			var pupid = $("#addpup_sel").val();
			CHARACTERS[LASTMODIFIED].applyPowerUp(ITEMS[pupid]);
			CHARACTERS[LASTMODIFIED].displayItemChangeMenu();
		});
	}
	if (this.pups.length > 0)
	{
		//remove option
		itmtab.append("<tr><td class='puptit'>Remove a powerup</td><td><select id='rempup_sel'></select>"
			+ " <input id='rempup_btn' type='button' value='remove'></td></tr>");
		var selrem = $("#rempup_sel");	
		$(this.pups).each(function(id,it)
		{
			selrem.append("<option value='" + it.getId() + "'>" + it.name + "</option>");
		});
		$("#rempup_btn").click(function()
		{
			var pupid = $("#rempup_sel").val();
			CHARACTERS[LASTMODIFIED].removePowerUp(pupid);
			CHARACTERS[LASTMODIFIED].displayItemChangeMenu();
		});
	}	
	this.displayStats("statsoutput");
}

function listAllPuPs()
{
	var ret = [];
	$(ITEMS).each(function(id,it) 
	{
		if (it.slot == "pup")
		{
			ret[ret.length] = id;
		}
	});
	return ret;
}

function GameEffect(stat,val,perc)
{
	this.statName = stat;
	this.value = val;
	this.percent = perc;
}

function GameEquipment(un_id,slotid,eqname,eqeffects)
{
	this.uid = un_id;
	this.slot = slotid;
	this.name = eqname;
	this.effects = eqeffects;
	this.id = NaN;

	this.getId = GE_getId;
	this.isTwoHandedWeapon = GE_isTwoHandedWeapon;
	this.getItemAsOption = GE_getItemAsOption;
	this.getStatValue = GE_getStatValue;
}

function GE_isTwoHandedWeapon()
{
	for (var i=0;i<this.effects.length;i++)
	{
		if (this.effects[i].statName == "nooh")
		{
			return true;
		}
	}
	return false;
}

function GE_getStatValue(stat)
{
	var ret = 0;
	for(var i=0;i<this.effects.length;i++)
	{
		var ef = this.effects[i];
		//Not counting % bonus
		if ((ef.statName == stat)&&(!ef.perc))
		{
			ret += ef.value;
		}
	}
	return ret;
}

function GE_getId()
{
	if (isNaN(this.id))
	{
		var me = this;
		var ret = -1;
		$(ITEMS).each(function(id,it)
		{
			if (me.name == it.name)
			{
				me.id = id;
				ret = id;
			}
		});
		return ret;
	}
	return this.id;
}

function GE_getItemAsOption(eq)
{
	var itmid = this.getId();
	
	if (this.slot == "mh") //weapon
	{
		var mat = this.getStatValue("mat");
		var atk = this.getStatValue("atk");	

		return "<option style='background-color:#ffff80;' value='" + itmid + "' " + ((eq==itmid)?("selected"):("")) + ">" + this.name 
		+ " [+" + ((mat>atk)?(mat + " mat"):(atk + " atk")) + "]"
		+ "</option>";
	}
	if ((this.slot == "hl")||(this.slot == "ba")||(this.slot == "oh")) //armor
	{
		var def = this.getStatValue("def");

		return "<option style='background-color:#90ff90;' value='" + itmid + "' " + ((eq==itmid)?("selected"):("")) + ">" + this.name 
		+ " [+" + def + " def]"
		+ "</option>";
	}
	if (this.slot == "ac") //acc
	{
		return "<option value='" + itmid + "' " + ((eq==itmid)?("selected"):("")) + ">" + this.name + "</option>";
	}
	if (this.slot == "pup") //PUp
	{
		return "<option value='" + itmid + "' " + ((eq==itmid)?("selected"):("")) + ">" + this.name + "</option>";
	}
	//default
	return "<option value='" + itmid + "' " + ((eq==itmid)?("selected"):("")) + ">" + this.name + "</option>";
}

function findItemByUID(uid)
{
	for (var i=0;i<ITEMS.length;i++)
	{
		if (ITEMS[i].uid == uid)
		{
			return ITEMS[i];
		}
	}
	return null;
}

function removeAllItems()
{
	$(CHARACTERS).each(function(id,it)
	{
		it.emptySlot("mh");
		it.emptySlot("oh");
		it.emptySlot("hl");
		it.emptySlot("ba");
		it.emptySlot("ac");
	});
}
