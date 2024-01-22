class MageDpsCalculator {
    constructor(playerStats, monsterStats, spellAttackSpeed) {
      this.playerStats = playerStats;
      this.monsterStats = monsterStats;
      this.spellAttackSpeed = spellAttackSpeed;
    }
  
    calculateMaximumHit() {
      return this.playerStats.maxHit;
    }
  
    calculateEffectiveLevel() {
      const { magicLevel, magicBoost, prayerBonus, usingVoidMagic, usingAccurateTrident } = this.playerStats;
      let effectiveLevel = (magicLevel + magicBoost) * prayerBonus * 1.45;
  
      if (usingVoidMagic) {
        effectiveLevel += 2;
      }
  
      if (usingAccurateTrident) {
        effectiveLevel += 9;
      }
  
      return Math.floor(effectiveLevel) + 2;
    }
  
    calculateAccuracyRoll() {
      const effectiveLevel = this.calculateEffectiveLevel();
      const { equipmentBonus, usingSalveAmulet, onTask } = this.playerStats;
  
      let accuracyRoll = Math.floor(effectiveLevel * (equipmentBonus + 64));
  
      if (usingSalveAmulet && (onTask || this.monsterStats.isUndead)) {
        accuracyRoll = Math.floor(accuracyRoll * 1.15);
      }
  
      return accuracyRoll;
    }
  
    calculateDefenceRoll() {
      const { npcMagicLevel, npcMagicDefence } = this.monsterStats;
      return (9 + npcMagicLevel) * (npcMagicDefence + 64);
    }
  
    calculateHitChance() {
      const accuracyRoll = this.calculateAccuracyRoll();
      const defenceRoll = this.calculateDefenceRoll();
  
      if (accuracyRoll > defenceRoll) {
        return 1 - (defenceRoll + 2) / (2 * (accuracyRoll + 1));
      } else {
        return accuracyRoll / (2 * (defenceRoll + 1));
      }
    }
  
    calculateDamagePerHit() {
      const maxHit = this.calculateMaximumHit();
      const hitChance = this.calculateHitChance();
      
      return (maxHit * hitChance) / 2;
    }
  
    calculateDPS() {
      const damagePerHit = this.calculateDamagePerHit();
      return damagePerHit / this.spellAttackSpeed;
    }
  }

  module.exports = MageDpsCalculator;