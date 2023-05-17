const categoryForm = document.getElementById('categoryForm');
//categoryForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {

    event.preventDefault();

    const form = event.target;
    const url = new URL(form.action);
    const formData = new FormData(form);

    const fetchOptions = {
      method: form.method,
      body: formData,
    };
  
    console.log(url, fetchOptions);

    fetch(url, fetchOptions);
  
  }