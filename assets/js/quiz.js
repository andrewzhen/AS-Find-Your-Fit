var num_questions = 13;

// Unanswered
var character_questions = [2, 7, 9, 10, 12];
var office_questions = [1, 3, 4, 5, 6, 7, 8, 11, 13];

// Matched answers
var character_results = [];
var office_results = [];

// Filtered matched answers
var character = "";
var office_list = [];
var other_list = [];

// Filtered matched answer descriptions
var character_description = "";
var office_description = [];
var other_description = [];



// Update windowHeight variable on load
window.onload = function() {
  setWindowHeight();
}



// Update windowHeight variable on resize
window.onresize = function() {
  setWindowHeight();
};



// Update windowHeight variable
function setWindowHeight() {
  let windowHeight = window.innerHeight * 0.01;
  document.documentElement.style.setProperty ("--windowHeight", `${windowHeight * 100}px`);
}



function getMostFrequent(lst) {
  // Category followed by number of points (e.g. Community: 2)
  let counts = lst.reduce((a,c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});
  // console.log(counts);

  // Maximum point
  let maxCount = Math.max(...Object.values(counts));
  // console.log(maxCount);

  // Category associated with maximum point (could be tied)
  let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
  // console.log(mostFrequent);

  return mostFrequent.slice();
}



function calculateCharacter() {
  // Go through character questions
  for (let i = 0; i < character_questions.length; i++) {
    // Go through each character's answers, adding it to a list if answers match
    for (let j = 0; j < characters.length; j++) {
      if (characters[j].answers.includes(character_answers[i])) {
        character_results.push(characters[j].character);
      }
    }
  }

  // Determine most frequent character
  var mostFrequent = getMostFrequent(character_results);

  // Select a random character among a list of them
  character = mostFrequent[Math.floor(Math.random() * mostFrequent.length)];

  // Get character description
  for (let d = 0; d < characters.length; d++) {
    if (character == characters[d].character) {
      character_description = characters[d].description;
      break;
    }
  }

  // console.log(character);
}



function calculateOffice() {
  // Go through office questions
  for (let i = 0; i < office_questions.length; i++) {
    // Go through positions matching the character, adding it to a list if answers match
    for (let j = 0; j < offices.length; j++) {
      if (offices[j].character == character) {
        for (let n = 0; n < offices[j].positions.length; n++) {
          if (offices[j].positions[n].answers.includes(office_answers[i])) {
            office_results.push(offices[j].positions[n].name);
          }
        }
      }
    }
  }

  // console.log(office_results);

  // Determine results if any
  if (office_results.length > 0) {
    // Get most frequent offices and add to list
    office_list = getMostFrequent(office_results);
  }

  // Get office description
  for (let o = 0; o < office_list.length; o++) {
    for (let d = 0; d < offices.length; d++) {
      if (character == offices[d].character) {
        for (let e = 0; e < offices[d].positions.length; e++) {
          if (office_list[o] == offices[d].positions[e].name) {
            office_description.push(offices[d].positions[e].description);
          }
        }
        break;
      }
    }
  }

  // console.log(office_list);
}



function generateOffice(character) {
  // 3 fits into the grid nicely
  var num = 3;

  // Find num number of offices that the user hasn't already matched with
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < offices.length; j++) {
      // Use generator if there are offices left to choose from
      if (character == offices[j].character && office_list.length < offices[j].positions.length) {
        // Choose 3 or however many offices or left, whichever is smaller
        var max_num = offices[j].positions.length - office_list.length;
        num = max_num < num ? max_num : num;

        // Find an office and add to list, then exit
        var randomInt = getRandomInt(0, offices[j].positions.length - 1);
        var randomOffice = offices[j].positions[randomInt].name;
        while (office_list.includes(randomOffice) || other_list.includes(randomOffice)) {
          randomInt = getRandomInt(0, offices[j].positions.length - 1);
          randomOffice = offices[j].positions[randomInt].name;
        }
        other_list.push(randomOffice);
        other_description.push(offices[j].positions[randomInt].description);
        break;
      }
    }
  }

  // console.log(other_list);
  // console.log(other_description);
}