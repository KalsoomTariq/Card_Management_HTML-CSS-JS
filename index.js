$(document).ready(function() 
{
    /*
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
                                      THEME CODE
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
    */
      // Default Themes
      // localStorage.clear();
      function populateDefaultThemes() {
          var defaultThemes = [
              {
                  title: "Storm",
                  fontName: "Aldrich",
                  fontStyle: "normal",
                  fontColor: "#82cef1",
                  bgColor: "#162f35",
                  backgroundType: 'image',
                  backgroundImage: "./assets/storm.png",
                  backgroundVideo: null,
                  marginStyle: "solid"
              },
              {
                  title: "Autumn",
                  fontName: "Poor Story",
                  fontStyle: "bold",
                  fontColor: "#f3af60",
                  bgColor: "#5e1f1f",
                  backgroundType: 'image',
                  backgroundImage: "./assets/autumn.png",
                  backgroundVideo: null,
                  marginStyle: "dashed"
              },
              {
                  title: "Cat",
                  fontName: "Henny Penny",
                  fontStyle: "normal",
                  fontColor: "#829c94",
                  bgColor: "#27382c",
                  backgroundType: 'image',
                  backgroundImage: "./assets/cat.png",
                  backgroundVideo: null,
                  marginStyle: "dotted"
              }
          ];
  
          localStorage.setItem('themes', JSON.stringify(defaultThemes));
      }

      // Check for default themes
      if (!localStorage.getItem('themes')) {
          populateDefaultThemes();
      }
  
      // Create Theme Dropdown
      function generateThemeDropdown() {
          var themes = JSON.parse(localStorage.getItem('themes'));
  
          var dropdown = document.getElementById('themeDropdown');
          dropdown.innerHTML = ''; 
  
          themes.forEach(function(theme, index) {
              var option = document.createElement('option');
              option.value = index;
              option.text = theme.title;
              dropdown.appendChild(option);
          });
      }
      var themes = JSON.parse(localStorage.getItem('themes'));
      var selectedThemeName = themes[0].title;
      setSelectedTheme(selectedThemeName);
  
      // Show DropDown
      generateThemeDropdown();



      // Function to set the selected theme and apply it automatically
      function setSelectedTheme(themeName) {

        // Retrieve themes from local storage
        var themes = JSON.parse(localStorage.getItem('themes')) || [];
        var themeIndex = themes.findIndex(function(theme) {
            return theme.title == themeName;
        });

        if (themeIndex !== -1) {

            // Apply the selected theme
            selectedTheme = themes[themeIndex];
            themes.splice(themeIndex, 1);
            themes.unshift(selectedTheme)
            localStorage.setItem('themes', JSON.stringify(themes));
            generateThemeDropdown();
            applyTheme(selectedTheme);
        } 
        else{
            console.error('Selected theme not found.');
        }
      }
  
      // Apply Selected Theme
      document.getElementById('themeDropdown').addEventListener('change', function() {
          var selectedIndex = this.value;
          var themes = JSON.parse(localStorage.getItem('themes'));
          console.log(selectedIndex);
          console.log(themes[selectedIndex].title);
          setSelectedTheme(themes[selectedIndex].title);
      });
  
      function applyTheme(theme) {

          console.log(theme);
          var video = document.getElementById('video');
          var image = document.getElementById('image');

          // Set background based on the theme's background type
          if (theme.backgroundType == 'image') {
              video.style.display = 'none'; 
              image.style.display = 'block';
              image.src = theme.backgroundImage;
          } else if (theme.backgroundType =='video') {
              video.style.display = 'block'; 
              image.style.display = 'none'; 
              video.src = theme.backgroundVideo;
              video.load();
          } else {
              video.style.display = 'none'; 
              image.style.display = 'none'; 
          }


          document.documentElement.style.setProperty('--font-new', theme.fontName);
          document.documentElement.style.setProperty('--font-style', theme.fontStyle);
          document.documentElement.style.setProperty('--primary-color-dark', theme.bgColor);
          document.documentElement.style.setProperty('--secondary-color-light', theme.fontColor);
          document.documentElement.style.setProperty('--border-style', theme.marginStyle);
          
      }

      document.getElementById('customThemeForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        // Retrieve Theme Values
        var themeTitle = document.getElementById('themeTitle').value;
        var fontColor = document.getElementById('fontColor').value;
        var bgColor = document.getElementById('bgColor').value;
        var fontName = document.getElementById('fontName').value;
        var fontStyle = document.getElementById('fontStyle').value;
        var marginStyle = document.getElementById('marginStyle').value;
        var bgImage = document.getElementById('bg').files[0]; // Image file
        var bgVideo = document.getElementById('bg').files[0]; // Video file
    
        // Create theme object
        var newTheme = {
            title: themeTitle,
            fontColor: fontColor,
            bgColor: bgColor,
            fontName: fontName,
            fontStyle: fontStyle,
            marginStyle: marginStyle,
            backgroundType: bgImage ? 'image' : bgVideo ? 'video' : 'none',
            backgroundImage: bgImage ? URL.createObjectURL(bgImage) : null,
            backgroundVideo: bgVideo ? URL.createObjectURL(bgVideo) : null 
        };
    
        // Add new theme to local storage
        addThemeToLocalStorage(newTheme);
    
        // Close the modal
        $('#createThemeModal').modal('hide');
    
        // Clear form inputs for next use
        document.getElementById('customThemeForm').reset();
    });
    
    function addThemeToLocalStorage(theme) {
        // Retrieve existing themes from local storage or create an empty array
        var themes = JSON.parse(localStorage.getItem('themes')) || [];
    
        // Add the new theme to the themes array
        themes.push(theme);
    
        // Update themes array in local storage
        localStorage.setItem('themes', JSON.stringify(themes));
        generateThemeDropdown();
    
    }
    
     /*
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
                                      CARDS CODE
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
    */

        // Load All Cards from LocalStorage when page is reloaded
        loadCardsFromLocalStorage();

        function loadCardsFromLocalStorage() {
          // Retrieve all Cards Saved in Local Storage
          var cards = JSON.parse(localStorage.getItem('cards')) || [];
          
          // Add each card to the UI
          cards.forEach(function(card) {
            addCardToUI(card);
          });
        }

    /*
    ---------------------------------------------------------------------------------------
                                     ADD NEW CARD
    ---------------------------------------------------------------------------------------
    */

    // Initialize a Variable to get data from Modal Add Card Form
    let addCardForm = document.getElementById("addCardForm");

    // Event Listener to add New Card
    addCardForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get Data From Modal
      var title = document.getElementById("title").value;
      var description = document.getElementById("description").value;
      var date = document.getElementById("date").value;
      var time = document.getElementById("time").value;
      var event = document.getElementById("event").value;
      var place = document.getElementById("place").value;
      var image = $("#cimage").prop('files')[0]; 

      if(!image){
        image = './assets/nopic.png';
      }
      // Convert image to Base64 using asynchronous call
      var imageUrl= await getImageAsBase64(image);

      // Create a unique ID for each card to refer later
      var cardId = Date.now().toString(); 

      // Create a card object to store in localStorage
      var card = {
        id: cardId,
        title: title,
        description: description,
        date: date,
        time: time,
        event: event,
        place: place,
        imageUrl: imageUrl
      };
      
      // Save the card to local storage
      saveCardToLocalStorage(card);

      // Clear input fields
      document.getElementById("title").value = '';
      document.getElementById("description").value = '';
      document.getElementById("date").value = '';
      document.getElementById("time").value = '';
      document.getElementById("event").value = '';
      document.getElementById("place").value = '';
      document.getElementById("cimage").value = '';
      // Close the modal Window
      $('#addCardModal').modal('hide');

      // Render Cards on UI
      addCardToUI(card);

    });

    // Function that adds Card to UI
    function addCardToUI(card) {

      cardHtml = `<div class="col-md-3 col-sm-4 col-xs-6 col-xxs-12" data-id="${card.id}">
      <div class="card w-75 h-100" >
          <img class="card-img-top" src="${card.imageUrl}" alt="Card image" >
          <div class="card-body">
              <h4 class="card-title"><b>${card.title}</b></h4>
              <span><p><b>Date:</b> ${card.date}</p></span>
              <span><p><b>Time:</b> ${card.time}</p></span>
              <span><p><b>Event:</b> ${card.event}</p></span>
              <span><p><b>Location:</b> ${card.place}</p></span>
              <p class="card-text heading"> <b>Desciption:</b>${card.description}</p>
              <div class="buttons">
              <button class="btn btn-sm btn-dark edit-card" data-id="${card.id}" data-target="#editCardModal" data-toggle="modal" >Edit Card</button>
              <button class="btn btn-sm btn-dark delete-card">Delete Card</button>
              </div>
          </div>
      </div>
      </div>`;
      
      $("#cardList").append(cardHtml);
    }
    // Function that Adds a new Card to Local Storage
    function saveCardToLocalStorage(card) {
      // Retrieve Existing Cards from Local Storage
      var cards = JSON.parse(localStorage.getItem('cards')) || [];
      // Append New Card to the list
      cards.push(card);
      // Save the new list in Local Storage
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  
    // Function that Converts image file in a base 64 format to be stored in Local Storage
    function getImageAsBase64(input) {
      return new Promise((resolve, reject) => {
        if (typeof input === 'string') {
            // If input is a string (file path), load the image as Blob
            fetch(input)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        } else if (input instanceof Blob) {
            // If input is a Blob (file object), read the image as Data URL
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(input);
        } else {
            reject(new Error('Invalid input type. Expected a file object or file path.'));
        }
    });
}

    /*
    ---------------------------------------------------------------------------------------
                                     DELETE ALL CARDS
    ---------------------------------------------------------------------------------------
    */
  
    // Initialize Variable with id of delete all cards Modal button
    let deleteAllCards = document.getElementById("deleteAllCards");

    // Event Listener to Delete all Cards
    deleteAllCards.addEventListener("submit", (e) => {
      e.preventDefault();
      // Empty the cards from List
      $("#cardList").empty();

      // Empty the local storage
      localStorage.removeItem('cards');
    
    });

    /*
    ---------------------------------------------------------------------------------------
                                     DELETE A SINGLE CARD
    ---------------------------------------------------------------------------------------
    */

    // Delete A Single Card
    $("#cardList").on("click", ".delete-card", function() 
    {
      // Get the id of the card clicked
      var cardId = $(this).closest('.col-md-3').data('id');
      // Remove the card from local storage
      removeCardFromLocalStorage(cardId);
      // Remove the card from UI
      $(this).closest('.col-md-3').remove();

    });

    function removeCardFromLocalStorage(cardId) {
      // Retrieve existing cards from local storage
      var cards = JSON.parse(localStorage.getItem('cards')) || [];

      // Compare IDs to filter out the relevant card
      cards = cards.filter(function(card) {
        return card.id != cardId;
      });
      // Save the updated cards to local storage
      localStorage.setItem('cards', JSON.stringify(cards));
    }

    /*
    ---------------------------------------------------------------------------------------
                                     EDIT A CARD
    ---------------------------------------------------------------------------------------
    */

    // Event listener for edit card buttons
    $("#cardList").on("click", ".edit-card", function() {

      // Get the card ID from the data-id attribute
      var cardId = $(this).closest('.btn').data('id');
      // Retrieve the card details using the cardId
      var card = getCardById(cardId);

      // Populate the modal with current card details
      populateModal(card);

    });

    // Function to retrieve card details by ID
    function getCardById(cardId) {
        // Fetch all Cards from the localStorage
        var cards = JSON.parse(localStorage.getItem('cards')) || [];
        
        // Return the card that matches the ID
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].id == cardId) {
                return cards[i];
            }
        }
        return null; 
    }

    // Function to Populate Modal with Clicked Card Details
    function populateModal(card) {
      // Populate modal form fields with card details
      $("#changetitle").val(card.title);
      $("#changedescription").val(card.description);
      $("#changedate").val(card.date);
      $("#changetime").val(card.time);
      $("#changeevent").val(card.event);
      $("#changeplace").val(card.place);
      $("#cardid").val(card.id);
      // Show the modal
      $('#editCardModal').modal('show');
  }

    // Event listener To Store changes of card
    $("#editCardModal").submit(async function(event) {
      event.preventDefault(); 
      console.log("Helloo2");
      // Retrieve the updated values from the modal
      var updatedTitle = $("#changetitle").val();
      var updatedDescription = $("#changedescription").val();
      var updatedDate = $("#changedate").val();
      var updatedTime = $("#changetime").val();
      var updatedEvent = $("#changeevent").val();
      var updatedPlace = $("#changeplace").val();
      var updatedImage = $("#changeimage").prop('files')[0]; 
  
      // Retrieve card ID from hidden input field
      var cardId = $("#cardid").val(); 
  
      // Retrieve the matching card from local storage
      var cards = JSON.parse(localStorage.getItem('cards')) || [];
  
      var cardIndex = cards.findIndex(function(card) {
          return card.id == cardId;
      });
  
      // Update card if found
      if (cardIndex !== -1) {
          cards[cardIndex].title = updatedTitle;
          cards[cardIndex].description = updatedDescription;
          cards[cardIndex].date = updatedDate;
          cards[cardIndex].time = updatedTime;
          cards[cardIndex].event = updatedEvent;
          cards[cardIndex].place = updatedPlace;
          if(updatedImage){
            var imageUrl= await getImageAsBase64(updatedImage);
            cards[cardIndex].imageUrl = imageUrl;
          }
          
  
          // Update the card in local storage
          localStorage.setItem('cards', JSON.stringify(cards));
  
          // Update the card's UI
          $("#cardList").empty();
          // Reload cards
          loadCardsFromLocalStorage();
      } else {
          console.error('Card not found.');
      }
  });



    /*
    ---------------------------------------------------------------------------------------
                                     DYNAMICALLY SEARCH A CARD
    ---------------------------------------------------------------------------------------
    */

    // Get Search Bar Input by query Selector
    const searchInput = document.querySelector("[data-search]");

    // Add an event listener to change in input
    searchInput.addEventListener("input",(e)=>{
        const value = e.target.value;

        // Convert Query to lower Case
        searchQuery = value.toLowerCase();

        // Iterate over each card in cardList
        $("#cardList .col-md-3").each(function() {
            
          // Convert card content to lower case
            var cardContent = $(this).text().toLowerCase();
            console.log(cardContent);

          // Add hidden and visible class according to match found
            if (cardContent.includes(searchQuery)) {
              $(this).addClass('visible').removeClass('hidden');
            } else {
                $(this).addClass('hidden').removeClass('visible');
            } 
        })

    });

});