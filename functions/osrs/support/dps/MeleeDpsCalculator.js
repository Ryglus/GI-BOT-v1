class MeleeDpsCalculator {
    constructor(playerStats, monsterStats, attackStyle) {
      this.playerStats = playerStats;
      this.monsterStats = monsterStats;
      this.attackStyle = attackStyle;
    }
  
    calculateEffectiveStrengthLevel() {
      const { strengthLevel, strengthBoost, prayerBonus } = this.playerStats;
      let effectiveStrength = Math.floor((strengthLevel + strengthBoost) * prayerBonus);
      
      if (this.attackStyle === "aggressive") {
        effectiveStrength += 3;
      } else if (this.attackStyle === "controlled") {
        effectiveStrength += 1;
      }
      
      effectiveStrength += 8;
      
      if (this.playerStats.voidGear) {
        effectiveStrength = Math.floor(effectiveStrength * 1.1);
      }
      
      return effectiveStrength;
    }
  
    calculateMaximumHit() {
      const effectiveStrength = this.calculateEffectiveStrengthLevel();
      const equipmentStrengthBonus = this.playerStats.equipmentStrengthBonus;
      const targetSpecificBonus = this.playerStats.targetSpecificBonus;
  
      let maxHit = Math.floor((effectiveStrength * (equipmentStrengthBonus + 64) + 320) / 640);
  
      if (targetSpecificBonus !== 1) {
        maxHit = Math.floor(maxHit * targetSpecificBonus);
      }
  
      return maxHit;
    }
  
    calculateEffectiveAttackLevel() {
      const { attackLevel, attackBoost, prayerBonus } = this.playerStats;
      let effectiveAttack = Math.floor((attackLevel + attackBoost) * prayerBonus);
  
      if (this.attackStyle === "accurate") {
        effectiveAttack += 3;
      } else if (this.attackStyle === "controlled") {
        effectiveAttack += 1;
      }
  
      effectiveAttack += 8;
  
      if (this.playerStats.voidGear) {
        effectiveAttack = Math.floor(effectiveAttack * 1.1);
      }
  
      return effectiveAttack;
    }
  
    calculateAttackRoll() {
      const effectiveAttack = this.calculateEffectiveAttackLevel();
      const equipmentAttackBonus = this.playerStats.equipmentAttackBonus;
      const targetSpecificBonus = this.playerStats.targetSpecificBonus;
  
      let attackRoll = Math.floor(effectiveAttack * (equipmentAttackBonus + 64));
  
      if (targetSpecificBonus !== 1) {
        attackRoll = Math.floor(attackRoll * targetSpecificBonus);
      }
  
      return attackRoll;
    }
  
    calculateDefenceRoll() {
      const { targetDefenceLevel, targetStyleDefenceBonus } = this.monsterStats;
      const effectiveDefence = this.playerStats.effectiveDefence;
      const defRoll = (effectiveDefence * (targetStyleDefenceBonus + 64)) || ((targetDefenceLevel + 9) * (targetStyleDefenceBonus + 64));
      return defRoll;
    }
  
    calculateHitChance() {
      const attackRoll = this.calculateAttackRoll();
      const defRoll = this.calculateDefenceRoll();
      
      if (attackRoll > defRoll) {
        return 1 - (defRoll + 2) / (2 * (attackRoll + 1));
      } else {
        return attackRoll / (2 * (defRoll + 1));
      }
    }
  
    calculateAverageDamagePerAttack() {
      const maxHit = this.calculateMaximumHit();
      const hitChance = this.calculateHitChance();
      
      return (maxHit * hitChance) / 2;
    }
  
    calculateDPS(attackSpeed) {
      const averageDamagePerAttack = this.calculateAverageDamagePerAttack();
      return averageDamagePerAttack / attackSpeed;
    }
  }
  
  module.exports = MeleeDpsCalculator;