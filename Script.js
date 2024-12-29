// Ensure that the form submission triggers the function
document.getElementById('book-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting the default way

  // Prepare the FormData object for sending the file and form data
  const formData = new FormData();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const date = document.getElementById('date').value;
  const bookFile = document.getElementById('bookFile').files[0];

  // Check if all fields are filled
  if (!title || !author || !date || !bookFile) {
    alert('Please fill all fields and upload a PDF.');
    return;
  }

  // Append data to formData
  formData.append('title', title);
  formData.append('author', author);
  formData.append('date', date);
  formData.append('bookFile', bookFile);

  try {
    // Send data to the server via a POST request
    const response = await fetch('http://localhost:5000/add-book', {
      method: 'POST',
      body: formData,
    });

    // Check if the server responded with success
    const result = await response.json();
    if (response.ok) {
      // Clear form fields and show success message
      document.getElementById('book-form').reset();
      document.getElementById('message').innerHTML = `<p style="color: green;">${result.message}</p>`;
    } else {
      // Show error message if there was an issue
      document.getElementById('message').innerHTML = `<p style="color: red;">${result.message}</p>`;
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    document.getElementById('message').innerHTML = `<p style="color: red;">Failed to upload book. Please try again.</p>`;
  }
});
