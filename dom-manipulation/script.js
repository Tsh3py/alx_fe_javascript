let quotes = []; 

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but but rather to be of value.", category: "Motivation" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The best way to predict the future is to create it.", category: "Action" }
        ];
        saveQuotes();
    }
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all'; 

    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `No quotes found for category: "${selectedCategory}". Add some!`;
        sessionStorage.setItem('lastViewedQuote', 'No quotes yet for this filter.');
        return; 
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    updateSessionStorageDisplay();
}

function updateSessionStorageDisplay() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    const displayElement = document.getElementById('sessionStorageDisplay');
    if (lastQuote) {
        displayElement.textContent = `Last viewed quote (session): "${lastQuote}"`;
    } else {
        displayElement.textContent = `No quote viewed in this session yet.`;
    }
}

function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteFormContainer');
    const formDiv = document.createElement('div');
    formDiv.id = 'quoteAdditionForm'; 

    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText'; 
    quoteTextInput.type = 'text'; 
    quoteTextInput.placeholder = 'Enter a new quote'; 

    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.id = 'newQuoteCategory'; 
    quoteCategoryInput.type = 'text'; 
    quoteCategoryInput.placeholder = 'Enter quote category'; 

    const addQuoteButton = document.createElement('button');
    addQuoteButton.textContent = 'Add Quote'; 
    addQuoteButton.onclick = addQuote;

    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(quoteCategoryInput);
    formDiv.appendChild(addQuoteButton);

    formContainer.appendChild(formDiv);
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category."); 
        return; 
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories();
    showRandomQuote();
    alert("Quote added successfully!");
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob); 

    const exportFileName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    URL.revokeObjectURL(url); 
    linkElement.remove();
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return; 
    }

    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                quotes = importedQuotes; 
                saveQuotes(); 
                populateCategories(); 
                showRandomQuote(); 
                alert('Quotes imported successfully!');
            } else {
                alert('Error: Invalid JSON format. Expected an array of quote objects with "text" and "category" properties.');
            }
        } catch (e) {
            alert('Error parsing JSON file: ' + e.message);
        } finally {
            event.target.value = '';
        }
    };

    fileReader.readAsText(file);
}


function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    
    uniqueCategories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;

    localStorage.setItem('selectedCategory', selectedCategory);

        showRandomQuote();
}


document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm();
    populateCategories(); 
    updateSessionStorageDisplay();

        const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.addEventListener('click', showRandomQuote);

    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    
});
