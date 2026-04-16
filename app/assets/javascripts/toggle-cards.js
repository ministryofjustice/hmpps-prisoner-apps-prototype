//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

 // Toggle individual cards
document.querySelectorAll('.sensitive-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Don't toggle if clicking the "open all" control
    if (e.target.closest('.sensitive-card-control')) {
      return;
    }
    
    e.preventDefault();
    
    const isClosed = this.getAttribute('data-is-closed') === 'true';
    const content = this.querySelector('.sensitive');
    const openIcon = this.querySelector('.open');
    const closedIcon = this.querySelector('.closed');
    
    if (isClosed) {
      // Open this card
      this.setAttribute('data-is-closed', 'false');
      content.classList.remove('hidden');
      openIcon.classList.remove('hidden');
      closedIcon.classList.add('hidden');
    } else {
      // Close this card
      this.setAttribute('data-is-closed', 'true');
      content.classList.add('hidden');
      openIcon.classList.add('hidden');
      closedIcon.classList.remove('hidden');
    }
  });
});

// Toggle all cards
const toggleAllBtn = document.querySelector('.sensitive-card-control');
if (toggleAllBtn) {
  toggleAllBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Toggle all clicked'); // Debug log
    
    const allCards = document.querySelectorAll('.sensitive-card');
    const isCurrentlyClosed = this.getAttribute('data-is-closed') === 'true';
    
    console.log('All closed?', isCurrentlyClosed); // Debug log
    
    allCards.forEach(card => {
      const content = card.querySelector('.sensitive');
      const cardOpenIcon = card.querySelector('.open');
      const cardClosedIcon = card.querySelector('.closed');
      
      if (isCurrentlyClosed) {
        // Open all
        card.setAttribute('data-is-closed', 'false');
        content.classList.remove('hidden');
        cardOpenIcon.classList.remove('hidden');
        cardClosedIcon.classList.add('hidden');
      } else {
        // Close all
        card.setAttribute('data-is-closed', 'true');
        content.classList.add('hidden');
        cardOpenIcon.classList.add('hidden');
        cardClosedIcon.classList.remove('hidden');
      }
    });
    
    // Toggle the control button state
    if (isCurrentlyClosed) {
      this.setAttribute('data-is-closed', 'false');
      this.querySelector('.open').classList.add('hidden');
      this.querySelector('.closed').classList.remove('hidden');
    } else {
      this.setAttribute('data-is-closed', 'true');
      this.querySelector('.open').classList.remove('hidden');
      this.querySelector('.closed').classList.add('hidden');
    }
  });
}

  
})
