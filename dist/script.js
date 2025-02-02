"use strict";
document.addEventListener('DOMContentLoaded', function () {
    // Array to store questions dynamically
    // const questions: any[] = [];
    const tabLinks = document.querySelectorAll('.tab-links a');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const addQuestionButton = document.querySelector('.add-question');
    const questionSection = document.getElementById('question-section');
    const saveFormButton = document.getElementById('save-form');
    const savedFormsTable = document.getElementById('saved-forms-table');
    const popup = document.getElementById('form-popup');
    const popupContent = document.getElementById('popup-content');
    let closePopupButton = document.querySelector('.close');
    // Array to store references to all questionDivs
    let questionDivs = [];
    let questions = [];
    tabLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            var _a;
            e.preventDefault(); // Prevent default link behavior
            // Remove the "active" class from all tab links and content panes
            tabLinks.forEach((tab) => { var _a; return (_a = tab.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('active'); });
            tabPanes.forEach((pane) => pane.classList.remove('active'));
            // TypeScript does not automatically know that `this` is an HTMLElement, so we cast it
            const linkElement = this;
            // Add the "active" class to the clicked tab's parent <li> element
            (_a = linkElement.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add('active');
            // Use the href value (which points to the target tab content) to select the corresponding content
            const targetTab = document.querySelector(linkElement.getAttribute('href'));
            // Add the "active" class to show the corresponding tab content
            targetTab.classList.add('active');
        });
    });
    // Function to add new question
    addQuestionButton.addEventListener('click', function () {
        const questionInput = document.querySelector('.question');
        const questionTypeSelect = document.querySelector('.question-type');
        const optionsInput = document.querySelector('.options');
        const question = questionInput.value;
        const questionType = questionTypeSelect.value;
        const options = optionsInput.value
            .split(',')
            .map((option) => option.trim())
            .filter((option) => option !== '');
        // Create the question dynamically
        if (question && options.length > 0) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            // Create a button to remove the question (using an icon)
            const removeButton = document.createElement('button');
            removeButton.innerHTML = '&#10006;'; // Unicode for the "×" symbol (delete icon)
            removeButton.classList.add('delete-btn'); // Add a class to style the button
            // Add click event listener to remove button
            removeButton.addEventListener('click', () => {
                questionDiv.remove(); // Remove questionDiv immediately
                // Find the index of the question in the questions array
                const index = questions.findIndex((q) => q.question === question && q.type === questionType);
                if (index > -1) {
                    questions.splice(index, 1); // Remove the corresponding question from the array
                }
                const divIndex = questionDivs.indexOf(questionDiv);
                if (divIndex > -1) {
                    questionDivs.splice(divIndex, 1); // Remove from array
                }
            });
            let questionHTML = `<p><strong>${question}</strong> (${questionType})</p>`;
            if (questionType === 'checkbox') {
                options.forEach((option) => {
                    questionHTML += `<label><input type="checkbox" name="${question}">${option}</label><br>`;
                });
            }
            else if (questionType === 'radio') {
                options.forEach((option) => {
                    questionHTML += `<label><input type="radio" name="${question}">${option}</label><br>`;
                });
            }
            else if (questionType === 'dropdown') {
                questionHTML += `<select name="${question}">`;
                options.forEach((option) => {
                    questionHTML += `<option value="${option}">${option}</option>`;
                });
                questionHTML += `</select>`;
            }
            questionDiv.innerHTML = questionHTML;
            questionDiv.appendChild(removeButton); // Add remove button to questionDiv
            questionSection.appendChild(questionDiv);
            // Store the reference to the questionDiv in the array
            questionDivs.push(questionDiv);
            // Store the question object in the array
            questions.push({
                question: question,
                type: questionType,
                options: options,
            });
            // Reset inputs
            questionInput.value = '';
            optionsInput.value = '';
        }
    });
    // Handle saving the form (for now, we just log the form name and description)
    saveFormButton.addEventListener('click', function () {
        const formName = document.getElementById('form-name')
            .value;
        const formDescription = document.getElementById('form-description').value;
        if (formName && formDescription) {
            // Create a JSON object with form data
            const formData = {
                formName: formName,
                formDescription: formDescription,
                questions: questions,
            };
            // Save the JSON object in localStorage
            const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
            savedForms.push(formData);
            localStorage.setItem('savedForms', JSON.stringify(savedForms));
            // Optional: Display a confirmation message or log to the console
            console.log('Form Saved:', formData);
            alert('Form saved successfully!');
            // Optionally clear the form after saving
            document.getElementById('form-name').value = '';
            document.getElementById('form-description').value = '';
            // Loop through the array and remove each questionDiv
            questionDivs.forEach((div) => {
                div.remove(); // Remove from DOM
            });
            // Optionally, clear the stored array after removing the elements
            questionDivs = []; // Clear the question section
            // Update the saved forms table
            displaySavedForms();
        }
        else {
            alert('Please enter a form name and description!');
        }
    });
    // Display all saved forms in the table
    function displaySavedForms() {
        const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
        const tbody = savedFormsTable.querySelector('tbody');
        tbody.innerHTML = '';
        savedForms.forEach((form, index) => {
            const row = document.createElement('tr');
            const formNameCell = document.createElement('td');
            formNameCell.textContent = form.formName;
            row.appendChild(formNameCell);
            const formDescriptionCell = document.createElement('td');
            formDescriptionCell.textContent = form.formDescription;
            row.appendChild(formDescriptionCell);
            const actionsCell = document.createElement('td');
            const viewButton = document.createElement('button');
            viewButton.classList.add('view-form');
            viewButton.textContent = 'View Form';
            viewButton.addEventListener('click', function () {
                showFormInPopup(form);
            });
            actionsCell.appendChild(viewButton);
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
    }
    // Show form in the popup
    function showFormInPopup(form) {
        let popupHTML = `<span class="close">&times;</span> <div class="popup-items">
    <h2>${form.formName}</h2>
    <p>${form.formDescription}</p>`;
        form.questions.forEach((question) => {
            popupHTML += `<div class="card">
      <p><strong>${question.question}</strong></p>`;
            if (question.type === 'checkbox') {
                question.options.forEach((option) => {
                    popupHTML += `<label><input type="checkbox">${option}</label><br>`;
                });
            }
            else if (question.type === 'radio') {
                question.options.forEach((option) => {
                    popupHTML += `<label><input type="radio">${option}</label><br>`;
                });
            }
            else if (question.type === 'dropdown') {
                popupHTML += `<select>`;
                question.options.forEach((option) => {
                    popupHTML += `<option value="${option}">${option}</option>`;
                });
                popupHTML += `</select><br>`;
            }
            popupHTML += `</div>`;
        });
        popupHTML += `</div>`;
        // Insert the dynamically generated HTML into the popup-content div
        let popupContent = document.querySelector('#popup-content');
        popupContent.innerHTML = popupHTML;
        // Display the popup
        const popup = document.querySelector('#form-popup');
        popup.style.display = 'block';
        closePopupButton = document.querySelector('.close');
        // Close the popup
        closePopupButton.addEventListener('click', function () {
            popup.style.display = 'none';
        });
    }
    // Display saved forms when the page loads
    displaySavedForms();
});
