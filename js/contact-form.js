document.addEventListener('DOMContentLoaded', function() {
  // Posa el timestamp al carregar el formulari
  const tsField = document.getElementById('ts');
  if (tsField) tsField.value = Date.now();

  // Puntuació visual (ja tens estil) -> actualitza camp hidden
  document.querySelectorAll('.puntuacio span').forEach(span => {
    span.addEventListener('click', function() {
      document.getElementById('puntuacio').value = this.dataset.valor;
      // afegir classe visual si vols...
    });
  });

  // Ajax submit
  const form = document.getElementById('contacteForm');
  const feedback = document.getElementById('missatgeFeedback');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      feedback.style.display = 'block';
      feedback.textContent = 'Enviant...';
      feedback.style.color = '#333';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          feedback.style.color = 'green';
          feedback.innerHTML = data.message;
          form.reset();
          // Reset timestamp
          document.getElementById('ts').value = Date.now();
        } else {
          feedback.style.color = 'crimson';
          feedback.innerHTML = data.message || 'Hi ha hagut un error. Torna-ho a intentar.';
        }
      })
      .catch(err => {
        feedback.style.color = 'crimson';
        feedback.innerHTML = 'Error de connexió. Torna-ho a intentar.';
        console.error(err);
      });
    });
  }
});
