fetch('publications.json')
    .then(response => response.json())
    .then(data => {
        const publicationList = document.getElementById('publication-list');
        
        data.forEach(publication => {
            const publicationItem = document.createElement('div');
            publicationItem.classList.add('publication-item');
            
            const title = document.createElement('h3');
            title.textContent = publication.title;
            publicationItem.appendChild(title);
            
            const authors = document.createElement('p');
            authors.textContent = publication.authors.join(', ');
            publicationItem.appendChild(authors);
            
            const year = document.createElement('p');
            year.textContent = publication.year;
            publicationItem.appendChild(year);
            
            const venue = document.createElement('p');
            venue.textContent = publication.venue;
            publicationItem.appendChild(venue);
            
            publicationList.appendChild(publicationItem);
        });
    })
    .catch(error => {
        console.error('Error loading publications:', error);
    });

// Highlight active section in the navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});