$(document).ready(function() 
{
    /*
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
                                      THEME CODE
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
    */

    // Define themes
    var themes = [
      {
          name: 'Cool',
          fontName: 'Arial',
          fontStyle: 'normal',
          fontColor: '#000000',
          bodyColor: '#ffffff',
          backgroundColor: '#6495ED',
          backgroundImage: 'none',
          marginStyle: '10px'
      },
      {
          name: 'Sad',
          fontName: 'Verdana',
          fontStyle: 'italic',
          fontColor: '#000000',
          bodyColor: '#f0f0f0',
          backgroundColor: '#778899',
          backgroundImage: 'none',
          marginStyle: '15px'
      },
      // Add more predefined themes here
  ];

  // Save themes to local storage
  localStorage.setItem('themes', JSON.stringify(themes));

  // Render theme dropdown
  renderThemeDropdown();

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
      var image = $("#image").prop('files')[0]; 

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
      document.getElementById("image").value = '';
      // Close the modal Window
      $('#addCardModal').modal('hide');

      // Render Cards on UI
      addCardToUI(card);

    });

    // Function that adds Card to UI
    function addCardToUI(card) {

      cardHtml = `<div class="col-md-3 col-sm-5" data-id="${card.id}">
      <div class="card" >
          <img class="card-img-top" src="${card.imageUrl}" alt="Card image" >
          <div class="card-body">
              <h4 class="card-title"><b>${card.title}</b></h4>
              <span><p><b>Date:</b> ${card.date}</p></span>
              <span><p><b>Time:</b> ${card.time}</p></span>
              <span><p><b>Event:</b> ${card.event}</p></span>
              <span><p><b>Location:</b> ${card.place}</p></span>
              <p class="card-text heading"> <b>Desciption:</b>${card.description}</p>
              <div class="buttons">
              <button class="btn btn-warning edit-card" data-id="${card.id}" data-target="#editCardModal" data-toggle="modal" >Edit Card</button>
              <button class="btn btn-danger delete-card">Delete Card</button>
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
    function getImageAsBase64(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        
        reader.onload = function() {
          resolve(reader.result);
        };
        
        reader.onerror = function(error) {
          reject(error);
        };
        
        reader.readAsDataURL(file);
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
      // Assuming you have an image element in the modal
      $("#changeimage").attr("src", card.imageUrl); // Update the image source

      // Show the modal
      $('#editCardModal').modal('show');
  }

    // Event listener To Store changes of card
    $("#editCardModal").submit(async function(event) {

        event.preventDefault(); 

        // Retrieve the updated values from the modal
        var updatedTitle = $("#changetitle").val();
        var updatedDescription = $("#changedescription").val();
        var updatedDate = $("#changedate").val();
        var updatedTime = $("#changetime").val();
        var updatedEvent = $("#changeevent").val();
        var updatedPlace = $("#changeplace").val();
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