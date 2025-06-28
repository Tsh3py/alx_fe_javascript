let quotes = []; 

// --- NEW FUNCTION: saveQuotes() ---
// Saves the current quotes array to Local Storage.
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- NEW FUNCTION: loadQuotes() ---
// Loads quotes from Local Storage when the application initializes.
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        // If quotes are found in local storage, parse them and assign to our 'quotes' array.
        quotes = JSON.parse(storedQuotes);
    } else {
        // If no quotes in local storage yet, initialize with default quotes.
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The best way to predict the future is to create it.", category: "Action" }
        ];
        // Save these default quotes to local storage so they are available on subsequent visits.
        saveQuotes();
    }
}

// Step 2.2: Implement showRandomQuote function.
// This function selects a random quote from the 'quotes' array and displays it on the page.
function showRandomQuote() {
    // Get the HTML element where the quote will be displayed.
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Check if there are any quotes in the array.
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available. Add some!";
        // Also update session storage if no quotes are available
        sessionStorage.setItem('lastViewedQuote', 'No quotes yet.');
        return; // Exit the function if no quotes exist.
    }

    // Generate a random index within the bounds of the quotes array.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Get the random quote object.
    const randomQuote = quotes[randomIndex];

    // Update the innerHTML of the quoteDisplay div with the selected quote and its category.
    quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;

    // --- NEW: Using Session Storage (Optional requirement) ---
    // Store the text of the last viewed quote in session storage.
    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    // Call helper function to display the session storage content.
    updateSessionStorageDisplay();
}

// --- NEW FUNCTION: updateSessionStorageDisplay() ---
// Helper function to retrieve and display the last viewed quote from session storage.
function updateSessionStorageDisplay() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    const displayElement = document.getElementById('sessionStorageDisplay');
    if (lastQuote) {
        displayElement.textContent = `Last viewed quote (session): "${lastQuote}"`;
    } else {
        displayElement.textContent = `No quote viewed in this session yet.`;
    }
}


// Step 2.3: Implement createAddQuoteForm function.
// This function dynamically creates the HTML elements for adding new quotes (input fields and a button)
// and inserts them into the designated container in the DOM.
function createAddQuoteForm() {
    // Get the container element where the form will be added.
    const formContainer = document.getElementById('addQuoteFormContainer');

    // Create a new div element to group the form inputs and button.
    const formDiv = document.createElement('div');
    formDiv.id = 'quoteAdditionForm'; // Assign an ID for potential future styling or targeting.

    // Create the input field for the new quote's text.
    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText'; // Assign ID
    quoteTextInput.type = 'text'; // Set input type
    quoteTextInput.placeholder = 'Enter a new quote'; // Set placeholder text

    // Create the input field for the new quote's category.
    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.id = 'newQuoteCategory'; // Assign ID
    quoteCategoryInput.type = 'text'; // Set input type
    quoteCategoryInput.placeholder = 'Enter quote category'; // Set placeholder text

    // Create the "Add Quote" button.
    const addQuoteButton = document.createElement('button');
    addQuoteButton.textContent = 'Add Quote'; // Set button text
    // Attach the 'addQuote' function to the button's onclick event.
    // This allows the function to be called when the button is clicked.
    addQuoteButton.onclick = addQuote;

    // Append all the created elements to the formDiv.
    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(quoteCategoryInput);
    formDiv.appendChild(addQuoteButton);

    // Append the entire formDiv to its container in the HTML, making it visible on the page.
    formContainer.appendChild(formDiv);
}

// Step 3.1: Implement addQuote function.
// This function handles the logic for adding a new quote to the 'quotes' array
// and providing user feedback.
function addQuote() {
    // Get the values entered by the user in the dynamically created input fields.
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Basic validation: Check if both input fields are not empty.
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category."); // Alert the user if input is missing.
        return; // Stop the function execution.
    }

    // Create a new quote object from the user's input.
    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    // Add the newly created quote object to the 'quotes' array.
    quotes.push(newQuote);
    // --- NEW: Save to Local Storage after adding a new quote ---
    saveQuotes();

    // Clear the input fields after the quote has been added,
    // preparing them for the next user entry.
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // After adding, show a new random quote. This confirms to the user that
    // their quote has been added to the pool and new content can be displayed.
    showRandomQuote();

    // Provide an additional alert to confirm the quote was successfully added.
    alert("Quote added successfully!");
}

// --- NEW SECTION: JSON Data Import and Export ---

// Implement JSON Export: Provides a button to download quotes as a JSON file.
function exportToJsonFile() {
    // Convert the current 'quotes' array into a JSON string, pretty-printed with 2 spaces.
    const dataStr = JSON.stringify(quotes, null, 2);
    // Create a Data URI for the JSON content.
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    // Define the filename for the exported JSON file.
    const exportFileName = 'quotes.json';

    // Create a temporary anchor (<a>) element.
    const linkElement = document.createElement('a');
    // Set its 'href' attribute to the Data URI.
    linkElement.setAttribute('href', dataUri);
    // Set its 'download' attribute to trigger a download with the specified filename.
    linkElement.setAttribute('download', exportFileName);
    // Programmatically click the link to initiate the download.
    linkElement.click();
    // Clean up the temporary link element (optional, as it's usually not attached to DOM).
    linkElement.remove();
}

// Implement JSON Import: Provides a file input to upload a JSON file.
function importFromJsonFile(event) {
    // Get the first file selected by the user.
    const file = event.target.files[0];
    if (!file) {
        return; // Exit if no file was selected.
    }

    // Create a FileReader object to read the contents of the file.
    const fileReader = new FileReader();

    // Define what happens when the file is successfully loaded.
    fileReader.onload = function(event) {
        try {
            // Parse the content of the file (which is a JSON string) into a JavaScript object/array.
            const importedQuotes = JSON.parse(event.target.result);

            // Basic validation: Ensure the imported data is an array and contains valid quote objects.
            // A valid quote object must have 'text' and 'category' properties.
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                quotes = importedQuotes; // Replace current quotes with the imported ones.
                saveQuotes(); // Save the newly imported quotes to Local Storage for persistence.
                showRandomQuote(); // Display a new random quote from the imported list.
                alert('Quotes imported successfully!');
            } else {
                // Alert if the JSON format is unexpected.
                alert('Error: Invalid JSON format. Expected an array of quote objects with "text" and "category" properties.');
            }
        } catch (e) {
            // Catch any errors during JSON parsing (e.g., malformed JSON).
            alert('Error parsing JSON file: ' + e.message);
        } finally {
            // Reset the file input to allow selecting the same file again (if needed).
            event.target.value = '';
        }
    };

    // Read the content of the file as plain text.
    fileReader.readAsText(file);
}


// Step 2.4: Initial Page Load Setup.
// This ensures that our JavaScript code runs only after the entire HTML document
// has been fully loaded and parsed by the browser.
document.addEventListener('DOMContentLoaded', function() {
    // --- NEW: Load quotes from Local Storage on initialization ---
    loadQuotes();
    // Display an initial random quote when the page first loads.
    showRandomQuote();
    // Dynamically create and add the form for adding new quotes.
    createAddQuoteForm();
    // --- NEW: Display last viewed quote from Session Storage on load ---
    updateSessionStorageDisplay();

    // Get a reference to the "Show New Quote" button.
    const newQuoteButton = document.getElementById('newQuote');
    // Attach a click event listener to the button.
    newQuoteButton.addEventListener('click', showRandomQuote);

    // --- NEW: Attach event listener for Export button ---
    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    // --- NEW: Attach event listener for Import file input ---
    const importFileInput = document.getElementById('importFile');
    importFileInput.addEventListener('change', importFromJsonFile);
});
