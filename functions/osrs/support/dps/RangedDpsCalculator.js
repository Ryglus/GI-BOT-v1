class RangedDpsCalculator {
    constructor(playerStats, monsterStats, attackStyle, isOnTask, hasSalveAmulet) {
      this.playerStats = playerStats;
      this.monsterStats = monsterStats;
      this.attackStyle = attackStyle;
      this.isOnTask = isOnTask;
      this.hasSalveAmulet = hasSalveAmulet;
    }
  
    calculateEffectiveRangedStrength() {
      const {
        rangedLevel,
        boost,
        prayerBonus,
        voidModifier,
      } = this.playerStats;
  
      let atkStyle = 0;
      if (this.attackStyle === "accurate") {
        atkStyle = 3;
      }
  
      let effectiveRangedStrength = Math.floor(
        (Math.floor((rangedLevel + boost) * prayerBonus) +
          atkStyle +
          8) *
          voidModifier
      );
  
      return effectiveRangedStrength;
    }
  
    calculateMaximumHit() {
        // Extract necessary data from playerStats
        const { rangedLevel, boost, equipmentRangedStrength, gearBonus } = this.playerStats;
    
        // Calculate max hit based on provided formula
        let effectiveRangedStrength = Math.floor(
          (Math.floor((rangedLevel + boost) * 1.0) + (this.attackStyle === 'rapid' ? 0 : 3) + 8) *
          (this.playerStats.voidModifier || 1.0)
        );
    
        if (this.attackStyle === 'rapid') {
          effectiveRangedStrength *= 0.2927;
        }
    
        let maxHit = Math.floor(0.5 + (effectiveRangedStrength * (equipmentRangedStrength + 64)) / 640);
    
        if (gearBonus !== 1.0) {
          maxHit = Math.floor(maxHit * gearBonus);
        }
    
        return maxHit;
      }
  
    calculateEffectiveRangedAttack() {
      const {
        rangedLevel,
        boost,
        prayerBonus,
        voidModifier,
      } = this.playerStats;
  
      let atkStyle = 0;
      if (this.attackStyle === "accurate") {
        atkStyle = 3;
      }
  
      let effectiveRangedAttack = Math.floor(
        (Math.floor((rangedLevel + boost) * prayerBonus) +
          atkStyle +
          8) *
          voidModifier
      );
  
      return effectiveRangedAttack;
    }
  
    calculateAttackRoll() {
      const effectiveRangedAttack = this.calculateEffectiveRangedAttack();
      const { equipmentRangedAttack, gearBonus } = this.playerStats;
  
      let attackRoll = Math.floor(
        effectiveRangedAttack * (equipmentRangedAttack + 64)
      );
  
      if (gearBonus !== 1.0) {
        attackRoll = Math.floor(attackRoll * gearBonus);
      }
  
      return attackRoll;
    }
  
    calculateDefenceRoll() {
      const { targetDefenceLevel, targetRangedDefenceBonus } = this.monsterStats;
      return (targetDefenceLevel + 9) * (targetRangedDefenceBonus + 64);
    }
  
    calculateHitChance() {
      const attackRoll = this.calculateAttackRoll();
      const defenceRoll = this.calculateDefenceRoll();
  
      if (attackRoll > defenceRoll) {
        return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
      } else {
        return attackRoll / (2 * (defenceRoll + 1));
      }
    }
  
    calculateDamagePerHit() {
      const maxHit = this.calculateMaximumHit();
      const hitChance = this.calculateHitChance();
  
      return (maxHit * hitChance) / 2;
    }
  
    calculateDPS(attackSpeed) {
        const damagePerHit = this.calculateMaximumHit();
        const hitChance = this.calculateHitChance();
    
        // Adjust attack speed for rapid style
        if (this.attackStyle === "rapid") {
          attackSpeed -= 0.6; // 1 tick reduction
        }
    
        return damagePerHit / attackSpeed;
      }
  }

  module.exports = RangedDpsCalculator;