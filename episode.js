// Exact story and dialogue from supplied-outline.md. End card extends runtime to seven minutes.
window.FRONTLINES = {
  "title": "RED vs. BLUE: FRONTLINES",
  "episode": "FIRST CONTACT",
  "duration": 420,
  "fps": 24,
  "width": 1920,
  "height": 1080,
  "cast": [
    {
      "id": "mason",
      "name": "SERGEANT MASON",
      "short": "MASON",
      "role": "Patrol leader",
      "weapon": "M4",
      "color": "#4b9df6",
      "side": 1
    },
    {
      "id": "hayes",
      "name": "CORPORAL HAYES",
      "short": "HAYES",
      "role": "Radio operator",
      "weapon": "M4",
      "color": "#76baff",
      "side": 1,
      "pack": "radio"
    },
    {
      "id": "jackson",
      "name": "PRIVATE JACKSON",
      "short": "JACKSON",
      "role": "Automatic rifleman",
      "weapon": "M249",
      "color": "#3686dd",
      "side": 1
    },
    {
      "id": "reed",
      "name": "SPECIALIST REED",
      "short": "REED",
      "role": "Combat medic",
      "weapon": "M4",
      "color": "#98ceff",
      "side": 1,
      "pack": "medic"
    },
    {
      "id": "redlead",
      "name": "RED PATROL LEADER",
      "short": "RED LEAD",
      "role": "Patrol commander",
      "weapon": "AK",
      "color": "#f26464",
      "side": -1
    },
    {
      "id": "redtwo",
      "name": "RED TWO",
      "short": "RED TWO",
      "role": "Rifleman",
      "weapon": "AK",
      "color": "#d94d53",
      "side": -1
    },
    {
      "id": "redthree",
      "name": "RED THREE",
      "short": "RED THREE",
      "role": "Rifleman",
      "weapon": "LMG",
      "color": "#ff8c81",
      "side": -1
    }
  ],
  "shots": [
    {
      "start": 0,
      "end": 12,
      "name": "The briefing",
      "view": "base",
      "label": "BLUE FORWARD OPERATING BASE"
    },
    {
      "start": 12,
      "end": 35,
      "name": "Orders",
      "view": "briefing",
      "label": "OPERATIONS ROOM"
    },
    {
      "start": 35,
      "end": 55,
      "name": "Departure",
      "view": "departure",
      "label": "BLUE FORWARD OPERATING BASE"
    },
    {
      "start": 55,
      "end": 75,
      "name": "Forest road",
      "view": "drive",
      "label": "NORTHERN BORDER TERRITORY"
    },
    {
      "start": 75,
      "end": 95,
      "name": "Unconfirmed movement",
      "view": "vehicle",
      "label": "FOREST ACCESS ROAD"
    },
    {
      "start": 95,
      "end": 115,
      "name": "Dismount",
      "view": "dismount",
      "label": "ONE KILOMETRE FROM ECHO-7"
    },
    {
      "start": 115,
      "end": 135,
      "name": "First look",
      "view": "checkpoint",
      "label": "CHECKPOINT ECHO-7 • 17:40"
    },
    {
      "start": 135,
      "end": 160,
      "name": "Investigation",
      "view": "investigate",
      "label": "CHECKPOINT ECHO-7"
    },
    {
      "start": 160,
      "end": 185,
      "name": "The warning",
      "view": "warning",
      "label": "ECHO-7 • COMMUNICATIONS"
    },
    {
      "start": 185,
      "end": 205,
      "name": "The silhouettes",
      "view": "arrival",
      "label": "NORTHERN TREELINE"
    },
    {
      "start": 205,
      "end": 230,
      "name": "The confrontation",
      "view": "standoff",
      "label": "DISPUTED BORDER"
    },
    {
      "start": 230,
      "end": 255,
      "name": "The first shot",
      "view": "trigger",
      "label": "CHECKPOINT ECHO-7"
    },
    {
      "start": 255,
      "end": 275,
      "name": "Chaos",
      "view": "combat",
      "label": "CHECKPOINT ECHO-7"
    },
    {
      "start": 275,
      "end": 295,
      "name": "First casualty",
      "view": "medic",
      "label": "BLUE POSITION"
    },
    {
      "start": 295,
      "end": 315,
      "name": "Red perspective",
      "view": "redwounded",
      "label": "RED POSITION"
    },
    {
      "start": 315,
      "end": 350,
      "name": "Withdrawal",
      "view": "withdrawal",
      "label": "CHECKPOINT ECHO-7"
    },
    {
      "start": 350,
      "end": 375,
      "name": "Aftermath",
      "view": "aftermath",
      "label": "CHECKPOINT ECHO-7"
    },
    {
      "start": 375,
      "end": 395,
      "name": "Contact restored",
      "view": "restored",
      "label": "ECHO ONE • COMMAND"
    },
    {
      "start": 395,
      "end": 415,
      "name": "The advance",
      "view": "convoy",
      "label": "NORTHERN RIDGE"
    },
    {
      "start": 415,
      "end": 420,
      "name": "End title",
      "view": "end",
      "label": "END OF EPISODE 1"
    }
  ],
  "dialogue": [
    [
      1,
      11,
      "COMMAND • RADIO",
      "Echo Actual, this is Command. Be advised, we've lost contact with Observation Post Seven. Last transmission was approximately forty minutes ago."
    ],
    [
      14,
      20,
      "MASON",
      "Command lost contact with Echo-Seven. Our job is to find out why."
    ],
    [
      21,
      25,
      "JACKSON",
      "Probably another broken radio."
    ],
    [
      26,
      32,
      "MASON",
      "Then we fix it and come home. Weapons tight unless threatened. Understood?"
    ],
    [
      32,
      34.5,
      "SQUAD",
      "Roger."
    ],
    [
      59,
      64,
      "JACKSON",
      "You think we're gonna see anything out here?"
    ],
    [
      65,
      68,
      "HAYES",
      "Hopefully not."
    ],
    [
      69,
      73,
      "JACKSON",
      "Man, you guys are boring."
    ],
    [
      77,
      85,
      "COMMAND • RADIO",
      "Echo One, be advised. Unconfirmed movement reported near the northern boundary. Exercise caution."
    ],
    [
      86,
      89,
      "MASON",
      "Echo One copies."
    ],
    [
      90,
      94,
      "MASON",
      "Pull over. We walk from here."
    ],
    [
      105,
      111,
      "MASON",
      "Stay alert. Nobody gets separated."
    ],
    [
      122,
      126,
      "REED",
      "Where is everybody?"
    ],
    [
      127,
      133,
      "MASON",
      "That's what we're here to find out."
    ],
    [
      148,
      153,
      "JACKSON",
      "Sarge. You need to see this."
    ],
    [
      155,
      159,
      "MASON",
      "Everybody, stay sharp."
    ],
    [
      161,
      172,
      "HAYES",
      "Command, Echo One. We're at Echo-Seven. Position appears abandoned. Signs of a possible engagement."
    ],
    [
      173,
      178,
      "COMMAND • RADIO",
      "Echo One, say again your last?"
    ],
    [
      180,
      184,
      "REED",
      "Sergeant... movement."
    ],
    [
      191,
      195,
      "MASON",
      "Hold your fire."
    ],
    [
      206,
      214,
      "MASON",
      "Unidentified patrol! You're inside Blue-controlled territory! Identify yourselves!"
    ],
    [
      214,
      222,
      "RED LEADER",
      "This territory is under Red military authority. Lower your weapons."
    ],
    [
      223,
      229,
      "MASON",
      "Negative. We're not looking for a fight."
    ],
    [
      234,
      238,
      "MASON",
      "CONTACT! GET DOWN!"
    ],
    [
      258,
      262,
      "JACKSON",
      "I GOT 'EM!"
    ],
    [
      265,
      270,
      "MASON",
      "Short bursts! Watch your ammunition!"
    ],
    [
      277,
      281,
      "HAYES",
      "AH! I'M HIT!"
    ],
    [
      282,
      284,
      "REED",
      "Hayes!"
    ],
    [
      285,
      290,
      "REED",
      "Stay with me. You're gonna be fine."
    ],
    [
      290,
      295,
      "HAYES",
      "Radio... get the radio..."
    ],
    [
      296,
      305,
      "RED LEADER",
      "Red Two, this is Patrol Six! We're taking fire at Echo-Seven! Request immediate support!"
    ],
    [
      305,
      311,
      "RED COMMAND",
      "Patrol Six, disengage if possible. Reinforcements are moving."
    ],
    [
      311,
      315,
      "RED LEADER",
      "We're not leaving him!"
    ],
    [
      316,
      321,
      "JACKSON",
      "They're pulling back! I can get 'em!"
    ],
    [
      321,
      325,
      "MASON",
      "Negative! Hold position!"
    ],
    [
      326,
      329,
      "MASON",
      "Reed, status?"
    ],
    [
      329,
      335,
      "REED",
      "Hayes is stable, but we need to get him out."
    ],
    [
      336,
      348,
      "MASON",
      "Command, Echo One. Troops in contact. Multiple enemy combatants. One friendly wounded. Request immediate extraction and reinforcements."
    ],
    [
      354,
      360,
      "JACKSON",
      "They just crossed the border and started shooting."
    ],
    [
      360,
      365,
      "MASON",
      "We don't know who fired first."
    ],
    [
      367,
      371,
      "JACKSON",
      "Does it matter?"
    ],
    [
      376,
      381,
      "COMMAND • RADIO",
      "Echo One, this is Command. We read you. What's your situation?"
    ],
    [
      381,
      387,
      "MASON",
      "Echo-Seven is compromised. Red troops crossed the boundary. We exchanged fire. Requesting immediate support."
    ],
    [
      388,
      391,
      "COMMAND • RADIO",
      "Echo One... you need to leave that position. Now."
    ],
    [
      391,
      392,
      "MASON",
      "Why?"
    ],
    [
      392,
      395,
      "COMMAND • RADIO",
      "We've detected multiple armored vehicles moving south toward your location."
    ],
    [
      402,
      412,
      "RED COMMANDER",
      "All units, this is Red Actual. Phase One is underway. Begin the advance."
    ]
  ]
};
