var quiz;
var currQuestion = 0;
var colors = ["#15274B", "#00609C", "#79AFDB"]; //dark, medium, light
var stickers = [
  {
    bgLight: ["arrow", "as", "civic", "community", "dark-date", "grubhub", "hand", "twentytwenty"],
    bgMedium: ["community", "light-date", "grubhub", "hand", "twentytwenty", "zoom"],
    bgDark: ["arrow", "as", "civic", "community", "light-date", "dark-date", "grubhub", "hand", "twentytwenty", "zoom"]
  }
];
var character_answers = [];
var office_answers = [];



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // max is exclusive and min is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}



function addProgressCircles() {
  var quizProgress = document.querySelector(".quiz-progress");

  // Create and add circles to DOM
  for (let i = 0; i < questions.length; i++) {
    var circle = document.createElement("div");

    // Make the first question the current one
    i == 0 ? circle.classList.add("present") : circle.classList.add("future");
  
    quizProgress.appendChild(circle);
  }
}



function updateProgressCircles() {
  var circles = document.querySelectorAll(".quiz-progress > div");
  
  // Set current question as done, next question as current
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i].classList;
    
    // Finds current question
    if (circle.contains("present")) {
      circle.remove("present");
      circle.add("past");

      // Set the next question as current then exit
      if (i < circles.length - 1) {
        circles[i + 1].classList.remove("future");
        circles[i + 1].classList.add("present");
      }

      break;
    }
  }
}



function loadingBar() {
  // Create elements
  var loadingResultsContainer = document.createElement("div");
  var title = document.createElement("h1");
  var titleText = document.createTextNode("Finding Your Fit...");
  var barContainer = document.createElement("div");
  var progressBar = document.createElement("div");

  // Add classes
  loadingResultsContainer.classList.add("secondary-results-container");
  barContainer.classList.add("bar-container");
  progressBar.classList.add("progress-bar");

  // Build DOM
  barContainer.appendChild(progressBar);
  title.appendChild(titleText);
  loadingResultsContainer.appendChild(title);
  loadingResultsContainer.appendChild(barContainer);
  quiz.appendChild(loadingResultsContainer);

  // Add hidden anchor link for transition
  var linkToResults = document.createElement("a");
  linkToResults.id = "linkToResults";
  linkToResults.href = "results";
  quiz.appendChild(linkToResults);

  // Loading bar animation then go to results page
  setTimeout(function() {
    if (window.innerWidth <= 767) {
      document.getElementById("quiz").style.backgroundImage = "url('assets/images/loading-mobile.svg')";      
    } else {
      document.getElementById("quiz").style.backgroundImage = "url('assets/images/loading.svg')";
    }
    loadingResultsContainer.style.opacity = "1";
    document.querySelector(".progress-bar").style.width = "100%";

    setTimeout(function() {
      document.getElementById("linkToResults").click();
    }, 5000);
  }, 500);
}



function handleStickers(timing) {
  var stickerList;
  var numStickers = getRandomInt(2, 5);
  var uniqueStickers = [];

  // Choose light, medium, or dark stickers
  if (getComputedStyle(document.documentElement).getPropertyValue("--current-blue") == "#79AFDB") {
    stickerList = stickers[0].bgLight;
  } else if (getComputedStyle(document.documentElement).getPropertyValue("--current-blue") == "#00609C") {
    stickerList = stickers[0].bgMedium;
  } else {
    stickerList = stickers[0].bgDark;
  }

  // Choose unique stickers
  while (uniqueStickers.length != numStickers) {
    var sticker = stickerList[getRandomInt(0, stickerList.length)];
    if (!uniqueStickers.includes(sticker)) {
      uniqueStickers.push(sticker);
    }
  }

  // Reset classes of all stickers and fade in/out
  var domStickers = document.querySelectorAll(".sticker");
  for (let j = 0; j < domStickers.length; j++) {
    domStickers[j].style.opacity = "0";

    setTimeout(function() {
      domStickers[j].className = "";
      domStickers[j].classList.add("sticker");
    }, timing * 500);
    
    setTimeout(function() {
      domStickers[j].style.opacity = "1";
    }, timing * 1000);
  }

  // Add specific class to a random number of stickers
  if (currQuestion < num_questions) {
    setTimeout(function() {
      var uniqueLoc = [];
      for (let i = 0; i < uniqueStickers.length; i++) {
        domStickers[i].classList.add(uniqueStickers[i]);

        var loc = getRandomInt(0, 3); // 0, 1, or 2
        var x;
        var y;

        // Top
        if (loc == 0) {
          x = getRandomInt(0, 3) * 20 + 25 + "vw"; //25, 45, or 65
          while(uniqueLoc.includes("t" + x)) {
            x = getRandomInt(0, 3) * 20 + 45 + "vw";
          }
          uniqueLoc.push("t" + x);
          y = "-6vh";
        // Bottom
        } else if (loc == 1) {
          x = getRandomInt(0, 4) * 20 + 5 + "vw"; //5, 25, 45, or 65
          while(uniqueLoc.includes("b" + x)) {
            x = getRandomInt(0, 5) * 20 + 5 + "vw";
          }
          uniqueLoc.push("b" + x);
          y = getRandomInt(80, 86) + "vh";
        // Side
        } else {
          x = getRandomInt(82, 87) + "vw";
          y = getRandomInt(0, 4) * 20 + 20 + "vh"; //20, 40, 60, or 80
          while(uniqueLoc.includes("s" + y)) {
            y = getRandomInt(0, 4) * 20 + 20 + "vh";
          }
          uniqueLoc.push("s" + y);
        }

        domStickers[i].style.left = x;
        domStickers[i].style.top = y;
      }
    }, timing * 500);
  }
}



function handleBackgroundColor() {
  var html = document.documentElement;
  var randomColor;

  // Randomize color while still taking quiz
  if (currQuestion > num_questions) {
    var currentColor = getComputedStyle(html).getPropertyValue("--current-blue");
    randomColor = colors[getRandomInt(0, 3)];

    // Change color of background to a new blue
    while (randomColor === currentColor) {
      randomColor = colors[getRandomInt(0, 3)];
    }

  // Set to dark blue for loading bar page
  } else {
    randomColor = "#15274B";
  }

  html.style.setProperty("--current-blue", randomColor);
}



function nextQuestion() {
  // Get answer
  var answer = document.querySelector('input[name="' + (currQuestion + 1) + '"]:checked').value;
  
  // Store character answer
  if (character_questions.includes(currQuestion + 1)) {
    character_answers.push(answer);

  // Store office answer
  } else {
    office_answers.push(answer);
  }

  // Fade out previous question
  var prevQuestion = document.querySelector(".question");
  prevQuestion.style.opacity = "0";
  
  // Wait before removing previous question from DOM
  setTimeout(function() {
    prevQuestion.remove();    
  }, 500);

  // Next question
  currQuestion += 1;

  // Background color and stickers
  handleBackgroundColor();
  handleStickers(1);

  // If there is another question, add it
  if (currQuestion < questions.length) {
    setTimeout(function() {
      addQuestion(currQuestion, quiz);
    }, 500);

    // Fade into new question and update progress
    setTimeout(function() {
      document.querySelector(".question").style.opacity = "1";
      updateProgressCircles();
    }, 1000);

  // If no more questions, transition to results
  } else {
    // Fade out progress
    document.querySelector(".quiz-progress").style.opacity = "0";

    // Show loading bar and display results
    setTimeout(function() {
      loadingBar();
    }, 1000);
  }
}



function addQuestion(index, quiz) {
  // Create elements
  var q = document.createElement("div");
  var title = document.createElement("h2");
  var ul = document.createElement("ul");
  var li1 = document.createElement("li");
  var input1 = document.createElement("input");;
  var label1 = document.createElement("label");
  var li2 = document.createElement("li");
  var input2 = document.createElement("input");;
  var label2 = document.createElement("label");
  if (questions[index].c) {
    var li3 = document.createElement("li");
    var input3 = document.createElement("input");;
    var label3 = document.createElement("label");
  }
  if (questions[index].d) {
    var li4 = document.createElement("li");
    var input4 = document.createElement("input");;
    var label4 = document.createElement("label");
  }

  // Add classes, attributes, event listeners
  q.classList.add("question");
  title.classList.add("title");
  input1.type = "radio";
  input1.name = (index + 1).toString();
  input1.id = (index + 1) + "a";
  input1.value = questions[index].a;
  input1.addEventListener("change", nextQuestion);
  label1.htmlFor = (index + 1) + "a";
  input2.type = "radio";
  input2.name = (index + 1).toString();
  input2.id = (index + 1) + "b";
  input2.value = questions[index].b;
  input2.addEventListener("change", nextQuestion);
  label2.htmlFor = (index + 1) + "b";
  if (questions[index].c) {
    input3.type = "radio";
    input3.name = (index + 1).toString();
    input3.id = (index + 1) + "c";
    input3.value = questions[index].c;
    input3.addEventListener("change", nextQuestion);
    label3.htmlFor = (index + 1) + "c";
  }
  if (questions[index].d) {
    input4.type = "radio";
    input4.name = (index + 1).toString();
    input4.id = (index + 1) + "d";
    input4.value = questions[index].d;
    input4.addEventListener("change", nextQuestion);
    label4.htmlFor = (index + 1) + "d";
  }

  // Add text
  title.innerText = questions[index].q;
  label1.innerText = questions[index].a;
  label2.innerText = questions[index].b;
  if (questions[index].c) {
    label3.innerText = questions[index].c;
  }
  if (questions[index].d) {
    label4.innerText = questions[index].d;
  }

  // Build DOM
  li1.appendChild(input1);
  li1.appendChild(label1);
  ul.appendChild(li1);
  li2.appendChild(input2);
  li2.appendChild(label2);
  ul.appendChild(li2);
  if (questions[index].c) {
    li3.appendChild(input3);
    li3.appendChild(label3);
    ul.appendChild(li3);
  }
  if (questions[index].d) {
    li4.appendChild(input4);
    li4.appendChild(label4);
    ul.appendChild(li4);
  }
  q.appendChild(title);
  q.appendChild(ul);
  quiz.appendChild(q);
}



function makeQuiz(quiz) {
  currQuestion = 0;
  addProgressCircles(quiz);
  addQuestion(0, quiz);

  // Fade in first question
  document.querySelector(".question").style.opacity = "1";

  // Populate with stickers
  handleStickers(0);
}



function handleResults() {
  var resultsContainer = document.getElementById("results-container");
  
  // If taken entire quiz
  if (currQuestion == num_questions) {
    calculateCharacter()

    // Character ---------------------------------------------------------------

    // Create elements
    var contentContainer = document.createElement("div");
    var grid = document.createElement("div");
    var characterLeft = document.createElement("div");
    var characterDetails = document.createElement("div");
    var characterMascot = document.createElement("div");
    var titleDiv = document.createElement("div");
    var descriptionDiv = document.createElement("div");
    var title = document.createElement("h1");
    var titleSpan = document.createElement("span");
    var description = document.createElement("p");

    // Add classes
    contentContainer.classList.add("content-container");
    contentContainer.classList.add("results");
    grid.classList.add("grid");
    characterLeft.classList.add("character");
    characterLeft.classList.add("left");
    characterDetails.classList.add("character-details");
    characterMascot.classList.add("character-mascot");
    characterMascot.classList.add(character.replace(/\s+/g, '-').toLowerCase());

    // Add text
    var titleSpanText = document.createTextNode("The");
    var titleText = document.createTextNode(character);
    var descriptionText = document.createTextNode(character_description);

    // Build DOM
    titleSpan.appendChild(titleSpanText);
    title.appendChild(titleSpan);
    title.appendChild(titleText);
    titleDiv.appendChild(title);
    description.appendChild(descriptionText);
    descriptionDiv.appendChild(description);
    characterDetails.appendChild(titleDiv);
    characterDetails.appendChild(descriptionDiv);
    characterLeft.appendChild(characterDetails);
    characterLeft.appendChild(characterMascot);
    grid.appendChild(characterLeft);

    contentContainer.appendChild(grid);
    resultsContainer.appendChild(contentContainer);

    // Main Roles -------------------------------------------------------------

    calculateOffice();

    if (office_list.length) {
      // Create elements
      var roleTitleGrid = document.createElement("div");
      var roleGridTitle = document.createElement("div");
      var roleGridTitleP = document.createElement("p");
      var roleThirdsGrid = document.createElement("div");

      // Add classes
      roleTitleGrid.classList.add("title-grid");
      roleGridTitle.classList.add("grid-title");
      roleThirdsGrid.classList.add("thirds-grid");

      // Add text
      var roleGridTitlePText = document.createTextNode("Offices You're Most Suited For");
      
      // Add roles
      for (let a = 0; a < office_list.length; a++) {
        var roleDiv = document.createElement("div");
        var roleTitle = document.createElement("h3");
        var roleDescription = document.createElement("p");
        var roleTitleText = document.createTextNode(office_list[a]);
        var roleDescriptionText = document.createTextNode(office_description[a]);
        roleTitle.appendChild(roleTitleText);
        roleDescription.appendChild(roleDescriptionText);
        roleDiv.appendChild(roleTitle);
        roleDiv.appendChild(roleDescription);
        roleThirdsGrid.appendChild(roleDiv);
      }

      // Build DOM
      roleGridTitleP.appendChild(roleGridTitlePText);
      roleGridTitle.appendChild(roleGridTitleP);
      roleTitleGrid.appendChild(roleGridTitle);
      roleTitleGrid.appendChild(roleThirdsGrid);
      contentContainer.appendChild(roleTitleGrid);
    }

    // Other Roles ------------------------------------------------------------

    generateOffice(character);

    if (other_list.length) {
      // Create elements
      var otherTitleGrid = document.createElement("div");
      var otherGridTitle = document.createElement("div");
      var otherGridTitleP = document.createElement("p");
      var otherThirdsGrid = document.createElement("div");

      // Add classes
      otherTitleGrid.classList.add("title-grid");
      otherGridTitle.classList.add("grid-title");
      otherThirdsGrid.classList.add("thirds-grid");

      // Add text
      var otherGridTitlePText = document.createTextNode(character + "s Also Enjoy Working At");

      // Add other roles
      for (let b = 0; b < other_list.length; b++) {
        var otherDiv = document.createElement("div");
        var otherTitle = document.createElement("h3");
        var otherDescription = document.createElement("p");
        var otherTitleText = document.createTextNode(other_list[b]);
        var otherDescriptionText = document.createTextNode(other_description[b]);
        otherTitle.appendChild(otherTitleText);
        otherDescription.appendChild(otherDescriptionText);
        otherDiv.appendChild(otherTitle);
        otherDiv.appendChild(otherDescription);
        otherThirdsGrid.appendChild(otherDiv);
      }

      // Build DOM
      otherGridTitleP.appendChild(otherGridTitlePText);
      otherGridTitle.appendChild(otherGridTitleP);
      otherTitleGrid.appendChild(otherGridTitle);
      otherTitleGrid.appendChild(otherThirdsGrid);
      contentContainer.appendChild(otherTitleGrid);
    }

    // CTA --------------------------------------------------------------------

    // Create elements
    var twoColumnGrid = document.createElement("div");
    var gridItem1 = document.createElement("div");
    var gridItem2 = document.createElement("div");
    var gridItem1Title = document.createElement("p");
    var ctaContainer1 = document.createElement("div");
    var gridItem1Link = document.createElement("a");
    var gridItem2Title = document.createElement("p");
    var ctaContainer2 = document.createElement("div");
    var gridItem2LinkA = document.createElement("a");
    var gridItem2LinkB = document.createElement("a");

    // Add classes and attributes
    twoColumnGrid.classList.add("two-column-grid");
    ctaContainer1.classList.add("cta-container");
    if (["Creative Wizard", "Community Builder"].includes(character)) {
      gridItem1Link.href = "https://www.facebook.com/events/630810694292653/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22surface%22%2C%22surface%22%3A%22permalink%22%7D]%2C%22ref_notif_type%22%3Anull%7D";
    } else if (character == "Gracious Giver") {
      gridItem1Link.href = "https://www.facebook.com/events/630810697625986?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22surface%22%2C%22surface%22%3A%22permalink%22%7D]%2C%22ref_notif_type%22%3Anull%7D";
    } else {
      gridItem1Link.href = "https://www.facebook.com/events/630810690959320/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22surface%22%2C%22surface%22%3A%22permalink%22%7D]%2C%22ref_notif_type%22%3Anull%7D";
    }
    gridItem1Link.target = "_blank";
    ctaContainer2.classList.add("cta-container");
    gridItem2LinkA.href = "https://www.instagram.com/asucsd";
    gridItem2LinkA.target = "_blank";
    gridItem2LinkB.href = "https://www.facebook.com/ASUCSD/";
    gridItem2LinkB.target = "_blank";

    // Add text
    var gridItem1TitleText = document.createTextNode(character + " Workshop:");
    var eventDate;
    if (["Creative Wizard", "Community Builder"].includes(character)) {
      eventDate = "Tuesday, Sept 29";
    } else if (character == "Gracious Giver") {
      eventDate = "Monday, Sept 28";
    } else {
      eventDate = "Wednesday, Sept 30";
    }
    var gridItem1LinkText = document.createTextNode(eventDate);
    var gridItem2TitleText = document.createTextNode("Connect With Us!");
    var gridItem2LinkAText = document.createTextNode("Instagram");
    var gridItem2LinkBText = document.createTextNode("Facebook");

    // Build DOM
    gridItem1Title.appendChild(gridItem1TitleText);
    gridItem1Link.appendChild(gridItem1LinkText);
    gridItem2Title.appendChild(gridItem2TitleText);
    gridItem2LinkA.appendChild(gridItem2LinkAText);
    gridItem2LinkB.appendChild(gridItem2LinkBText);
    ctaContainer1.appendChild(gridItem1Link);
    gridItem1.appendChild(gridItem1Title);
    gridItem1.appendChild(ctaContainer1);
    ctaContainer2.appendChild(gridItem2LinkA);
    ctaContainer2.appendChild(gridItem2LinkB);
    gridItem2.appendChild(gridItem2Title);
    gridItem2.appendChild(ctaContainer2);
    twoColumnGrid.appendChild(gridItem1);
    twoColumnGrid.appendChild(gridItem2);
    contentContainer.appendChild(twoColumnGrid);

    // NAV --------------------------------------------------------------------
    var navLink = document.createElement("a");
    navLink.classList.add("nav-link");
    navLink.href = "offices-and-services";
    navLinkText = document.createTextNode("View All Offices & Services");
    navLink.appendChild(navLinkText);
    contentContainer.appendChild(navLink);

  } else {
    // Show error screen
    resultsContainer.classList.add("error-container");
    document.querySelector("article").style.height = "100vh";
    var header = document.querySelector("#results-container header");
    header.style.position = "absolute";
    header.style.top = "0";
    header.style.left = "0";
    header.style.width = "100%";

    var secondaryResultsContainer = document.createElement("div");
    var title = document.createElement("h1");
    var titleText = document.createTextNode("Oops! You Haven't Taken The Quiz Yet");
    var linkContainer = document.createElement("div");
    var link = document.createElement("a");
    var linkText = document.createTextNode("Take The Quiz!");
    secondaryResultsContainer.classList.add("secondary-results-container");
    secondaryResultsContainer.style.opacity = "1";
    linkContainer.classList.add("cta-container");
    link.href = "quiz";
    link.appendChild(linkText);
    title.appendChild(titleText);
    linkContainer.appendChild(link);
    secondaryResultsContainer.appendChild(title);
    secondaryResultsContainer.appendChild(linkContainer);
    resultsContainer.appendChild(secondaryResultsContainer);
  }
}



function delay(n) {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}



// init barba
barba.init({
  sync: true,
  
  transitions: [{
    async leave(data) {
      const done = this.async();

      // Fade and move upwards out of view
      gsap.timeline().to(data.current.container, {
        y: -1000,
        opacity: 0
      });

      await delay(350);
      done();
    },
    async enter(data) {
      // Fade and move upwards into view
      gsap.timeline().from(data.next.container, {
        y: 1000,
        opacity: 0
      });

      // For overflowing backgrounds
      window.scrollTo(0, 0);
    }
  }],

  views: [
    {
      namespace: "quiz",
      beforeEnter() {
        // For overflowing backgrounds
        document.body.style.overflow = "hidden";

        // Display quiz
        quiz = document.getElementById("quiz");
        makeQuiz(quiz);
      },
      beforeLeave() {
        // Undo effect for overflowing backgrounds
        document.body.style.overflow = "visible";

        // Reset background color
        handleBackgroundColor();
      }
    },

    {
      namespace: "results",
      beforeEnter() {
        handleResults();
      },
      beforeLeave() {
        // Reset answers
        currQuestion = 0;
        character = "";
        offices_list = [];
      }
    }
  ]
});