
module.exports = {
  isFriday(date = new Date()) {
    return date.getDay() === 5;
  }, 
  getFirstDayOfNextMonth() {
    const date = new Date();

    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  },
  capitalizeFirstLetter(string) {
    // Check if the string is not empty
    if (string.length === 0) {
      return string;
    }

    // Capitalize the first letter and concatenate it with the rest of the string
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  abbreviateNumber(value, how) {
    if (value) {
      if (how) {
        let newValue = value;
        const suffixes = ["", "k", "m", "b", "t"];
        let suffixNum = 0;
        while (newValue >= 1000) {
          newValue /= 1000;
          suffixNum++;
        }

        newValue = newValue.toString().length > 2 ? newValue.toPrecision(3) : newValue.toPrecision();

        newValue += suffixes[suffixNum];
        return newValue;
      } else {
        var newValue = String(value).replace(/(.)(?=(\d{3})+$)/g, '$1,')
        return newValue;
      }
    }

  }
}