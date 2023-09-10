function findTheMostSuitablePosition({
  inputKey,
  keySet,
}: {
  inputKey: string;
  keySet: string[];
}) {
  let bestMatch = null;
  let maxCommonCount = 0;
  const inputKeyHasDot = inputKey.includes(".");

  if (inputKeyHasDot) {
    for (const key of keySet) {
      const keyHasDot = key.includes(".");

      if (inputKeyHasDot !== keyHasDot) {
        continue; // Skip keys that don't have the same type
      }

      const inputParts = inputKey.split(".");
      const keyParts = key.split(".");
      let commonCount = 0;

      const minLength = Math.min(inputParts.length, keyParts.length);

      for (let i = 0; i < minLength; i++) {
        if (inputParts[i] === keyParts[i]) {
          commonCount++;
        } else {
          break;
        }
      }

      if (commonCount >= maxCommonCount) {
        maxCommonCount = commonCount;
        bestMatch = key;
      }
    }

    if (bestMatch && maxCommonCount > 0) {
      return bestMatch;
    } else {
      // handle case when inputKey does not match any key's keyParts in keySet
      const sortedKeys = keySet.filter((item) => item.includes(".")).sort();
      for (let i = 0; i < sortedKeys.length; i++) {
        if (inputKey.split(".")[0] < sortedKeys[i].split(".")[0]) {
          return sortedKeys[i - 1];
        }
      }
      return sortedKeys[sortedKeys.length - 1];
    }
  } else {
    const sortedKeys = keySet.filter((item) => !item.includes(".")).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      if (inputKey < sortedKeys[i]) {
        return sortedKeys[i - 1];
      }
    }
    return sortedKeys[sortedKeys.length - 1];
  }
}

// function levenshteinDistance(str1: string, str2: string) {
//   const m = str1.length;
//   const n = str2.length;
//   const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

//   for (let i = 0; i <= m; i++) {
//     for (let j = 0; j <= n; j++) {
//       if (i === 0) {
//         dp[i][j] = j;
//       } else if (j === 0) {
//         dp[i][j] = i;
//       } else if (str1[i - 1] === str2[j - 1]) {
//         dp[i][j] = dp[i - 1][j - 1];
//       } else {
//         dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
//       }
//     }
//   }

//   return dp[m][n];
// }

export default findTheMostSuitablePosition;
