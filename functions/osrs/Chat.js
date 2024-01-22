


class Chat {
  constructor() {
    this.specialLootRegex = /^(?::[^:]+:\s)?([^:]+?) received special loot from a raid:\s(.*?)$/i;
    this.regularDropRegex = /^(?::[^:]+:\s)?([^:]+?) received a drop:\s(\d+) x (.*?) \(([\d,]+) coins\) from (.*?)$/i;
    this.regularWOSDropRegex = /^(?::[^:]+:\s)?([^:]+?) received a drop:\s(.*?) \(([\d,]+) coins\)(.*?)$/i;
    this.funnyFeelingRegex = /^(?::[^:]+:\s)?([^:]+?) has a funny feeling like (?:he(?:'s)?|she(?:'s)?|they(?:'re)?) (?:being followed|would have been followed):\s(.*?)\.?$/i;
    this.defeatedRegex = /^(?::[^:]+:\s)?([^:]+?) (?:has been defeated by|has defeated) (.+?) and (?:received|lost) \(([\d,]+) coins\) worth of loot(.*?)$/i;
    this.collectiongLogRegex = /^(?::[^:]+:\s)?([^:]+?) received a new collection log item: (.+?) \((\d+)\/(\d+)\)\.?$/i;
    this.questRegex = /^(?::[^:]+:\s)?([^:]+?) has completed a quest: (.+)\.?$/i;
    this.personalBestRegex = /^(?::[^:]+:\s)?([^:]+?) has achieved a new (.+?) personal best: (\d+:\d+)\.?$/i;
    this.levelUpRegex = /^(?::[^:]+:\s)?([^:]+?) has reached (\w+) level (\d+)\.?$/i;
    this.totalLevelUpRegex = /^(?::[^:]+:\s)?([^:]+?) has reached a total level of (\d+)\.?$/i;
    this.completedDiaryRegex = /^(?::[^:]+:\s)?([^:]+?) has completed the (.+?) diary\.$/i;
    this.expelledRegex = /^(?::[^:]+:\s)?([^:]+?) has expelled ([^:]+?) from the clan\.$/i;
    this.invitedRegex = /^(?::[^:]+:\s)?([^:]+?) has been invited into the clan by ([^:]+?)\.$/i;
    this.leftClanRegex = /^(?::[^:]+:\s)?([^:]+?) has left the clan\.$/i;
    this.cofferTransactionRegex = /^(?::[^:]+:\s)?([^:]+?) has (deposited|withdrawn) ([\d,]+) coins (into|from) the coffer\.$/i;
  }
  parseAll(message) {
    let parsedData = null;
    const parsers = [
      { type: "Special Loot from a Raid", parser: this.parseSpecialLootMessage },
      { type: "Regular Drop", parser: this.parseRegularDropMessage },
      { type: "Pet Drop", parser: this.parseFunnyFeelingMessage },
      { type: "Defeated", parser: this.parseDefeatedMessage },
      { type: "Collection Log Item", parser: this.parseCollectionLogMessage },
      { type: "Quest Completion", parser: this.parseQuestCompletionMessage },
      { type: "Personal Best", parser: this.parsePersonalBestMessage },
      { type: "Level Up", parser: this.parseLevelUpMessage },
      { type: "Total Level Up", parser: this.parseTotalLevelUpMessage },
      { type: "Completed diary", parser: this.parseCompletedDiaryMessage },
      { type: "Expell", parser: this.parseExpelledMessage },
      { type: "Invite", parser: this.parseInvitedMessage },
      { type: "Left", parser: this.parseLeftClanMessage },
      { type: "Coffer", parser: this.parseCofferTransactionMessage },
    ];

    for (const { type, parser } of parsers) {
      parsedData = parser.call(this, message);
      if (parsedData) {
        return { type, data: parsedData };
      }
    }

    return { type: "Unknown", data: null };
  }
  
  parseCofferTransactionMessage(message) {
    const matches = message.match(this.cofferTransactionRegex);
  
    if (!matches) {
      return null;
    }
  
    const [, playerName, action, amount] = matches;
    const isDeposit = action.toLowerCase() === "deposited";
  
    return {
      playerName,
      isDeposit,
      amount: parseInt(amount.replace(/,/g, ""), 10),
    };
  }
  parseLeftClanMessage(message) {
    const matches = message.match(this.leftClanRegex);
  
    if (!matches) {
      return null;
    }
  
    const [, playerName] = matches;
  
    return {
      playerName,
    };
  }
  parseInvitedMessage(message) {
    const matches = message.match(this.invitedRegex);
  
    if (!matches) {
      return null;
    }
  
    const [, invitee, inviter] = matches;
  
    return {
      invitee,
      inviter,
    };
  }
  parseExpelledMessage(message) {
    const matches = message.match(this.expelledRegex);
  
    if (!matches) {
      return null;
    }
  
    const [, expeller, expelled] = matches;
  
    return {
      expeller,
      expelled,
    };
  }
  parseCompletedDiaryMessage(message) {
    const matches = message.match(this.completedDiaryRegex);
  
    if (!matches) {
      return null;
    }
  
    const [, playerName, diaryName] = matches;
  
    return {
      playerName,
      completionType: "Diary Completion",
      diary: diaryName.trim(),
    };
  }
  parseCollectionLogMessage(message) {
    const matches = message.match(this.collectiongLogRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, item, currentCount, totalCount] = matches;

    return {
      playerName,
      logType: "Collection Log Item",
      item: item.trim(),
      currentCount: parseInt(currentCount),
      totalCount: parseInt(totalCount),
    };
  }
  parseQuestCompletionMessage(message) {
    const matches = message.match(this.questRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, questName] = matches;

    return {
      playerName,
      questType: "Quest Completion",
      questName: questName.trim(),
    };
  }
  parsePersonalBestMessage(message) {
    const matches = message.match(this.personalBestRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, activity, time] = matches;

    return {
      playerName,
      bestType: "Personal Best",
      activity: activity.trim(),
      time: time.trim(),
    };
  }
  parseSpecialLootMessage(message) {
    const matches = message.match(this.specialLootRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, lootFromRaid] = matches;
    var cox = ["Dexterous prayer scroll", "Arcane prayer scroll", "Twisted buckler", "Dragon hunter crossbow", "Dinh's bulwark", "Ancestral hat", "Ancestral robe top", "Ancestral robe bottom", "Dragon claws", "Elder maul", "Kodai insignia", "Twisted bow"];
    var tob = ["Avernic defender hilt", "Ghrazi rapier", "Sanguinesti staff (uncharged)", "Justiciar faceguard", "Justiciar chestguard", "Justiciar legguards.png", "Scythe of vitur (uncharged)"]
    var toa = ["Osmumten's fang", "Lightbearer", "Elidinis' ward", "Masori mask", "Masori body", "Masori chaps.png", "Tumeken's shadow (uncharged)"];
    var source = "";
    var loot = lootFromRaid.replaceAll(".", "")
    if (cox.includes(loot)) {
      source = "cox";
    } else if (tob.includes(loot)) {
      source = "tob";
    } else if (toa.includes(loot)) {
      source = "toa";
    }
    return {
      playerName,
      dropType: "Special Loot from a Raid",
      item: loot.trim(),
      source: source,
    };
  }
  parseRegularDropMessage(message) {
    const matchesWithSource = message.match(this.regularDropRegex);

    if (matchesWithSource) {
      const [, playerName, quantity, item, coins, source] = matchesWithSource;

      return {
        playerName,
        dropType: "Regular Drop",
        item: item.trim(),
        quantity: parseInt(quantity),
        coins: parseInt(coins.replace(/,/g, "")),
        source: source.trim(),
      };
    }

    const matchesWithoutSource = message.match(this.regularWOSDropRegex);
    if (matchesWithoutSource) {

      const [, playerName, item, coins] = matchesWithoutSource;

      return {
        playerName,
        dropType: "Regular Drop",
        item: item.trim(),
        quantity: 1,
        coins: parseInt(coins.replace(/,/g, ""))
      };
    }

    return null;
  }
  parseFunnyFeelingMessage(value) {
    const matches = value.match(this.funnyFeelingRegex);

    if (!matches) {
      // Invalid funny feeling message
      return null;
    }

    const [, playerName, petWithInfo] = matches;
    let pet = petWithInfo.trim();
    let killcount = null;
    let xp = null;

    if (pet.includes(' at ')) {
      const petParts = pet.split(' at ');
      pet = petParts[0].trim();
      const info = petParts[1].trim();

      if (info.includes('XP')) {
        const xpMatch = info.match(/([\d,]+) XP/);
        if (xpMatch) {
          xp = parseInt(xpMatch[1].replace(/,/g, ''), 10);
        }
      } else if (info.includes('completions')) {
        const completionsMatch = info.match(/(\d+) completions/);
        if (completionsMatch) {
          killcount = parseInt(completionsMatch[1], 10);
        }
      } else if (info.includes('killcount')) {
        const killcountMatch = info.match(/(\d+) killcount/);
        if (killcountMatch) {
          killcount = parseInt(killcountMatch[1], 10);
        }
      }
    }

    const result = {
      playerName: playerName.trim(),
      dropType: 'Pet Drop',
      pet,
      petType: killcount !== null || xp !== null ? 'Skilling pet' : 'Pet',
    };

    if (killcount !== null) {
      result.killcount = killcount;
      result.petType = "Pet";
    }

    if (xp !== null) {
      result.xp = xp;
      result.petType = 'Skilling pet';
    }

    return result;
  }
  parseDefeatedMessage(message) {
    const matches = message.match(this.defeatedRegex);

    if (!matches) {
      return null;
    }

    const [, defeatedPlayer, restInfo, coins] = matches;
    const receivedOrLost = message.includes("received");
    let killerPlayer, location;

    if (receivedOrLost) {
      killerPlayer = restInfo;
      location = "";
    } else {
      [killerPlayer, location = ""] = restInfo.split(" in ");
    }

    return {
      Player: defeatedPlayer.trim(),
      killerPlayer: killerPlayer.trim(),
      won: receivedOrLost,
      coins: parseInt(coins.replace(/,/g, ""), 10),
    };
  }
  parseLevelUpMessage(message) {
    const matches = message.match(this.levelUpRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, skillName, skillLevel] = matches;

    return {
      playerName,
      levelUpType: "Level Up",
      skill: skillName.trim(),
      level: parseInt(skillLevel),
    };
  }
  parseTotalLevelUpMessage(message) {
    const matches = message.match(this.totalLevelUpRegex);

    if (!matches) {
      return null;
    }

    const [, playerName, totalLevel] = matches;

    return {
      playerName,
      levelUpType: "Total Level Up",
      totalLevel: parseInt(totalLevel),
    };
  }
}

module.exports = new Chat();

