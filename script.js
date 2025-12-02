document.getElementById('showText').addEventListener('click', function() {
    const content = document.getElementById('content');
    const button = document.getElementById('showText');
    
    if (content.innerHTML === '') {
        content.innerHTML = '<p>Welcome to Text as Data! This course explores computational methods for analyzing textual information.</p>';
        button.textContent = 'Hide Content';
    } else {
        content.innerHTML = '';
        button.textContent = 'Show Content';
    }
});