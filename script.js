fetch('publications.json')
    .then(response => response.json())
    .then(data => {
        const publicationList = document.getElementById('publication-list');
        
        data.forEach(publication => {
            const publicationItem = document.createElement('div');
            publicationItem.classList.add('publication-item');
            
            const title = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = publication.url;
            titleLink.textContent = publication.title;
            title.appendChild(titleLink);
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
            
            const bibtexButton = document.createElement('button');
            bibtexButton.textContent = 'BibTeX';
            bibtexButton.classList.add('bibtex-button');
            bibtexButton.addEventListener('click', () => {
                generateBibtex(publication);
            });
            publicationItem.appendChild(bibtexButton);
            
            // Add arXiv button
            const arxivUrl = publication['arxiv-url'] || publication.url;
            if (arxivUrl) {
                const arxivButton = document.createElement('button');
                arxivButton.textContent = 'arXiv';
                arxivButton.classList.add('arxiv-button');
                arxivButton.addEventListener('click', () => {
                    window.open(arxivUrl, '_blank');
                });
                publicationItem.appendChild(arxivButton);
            }
            
            publicationList.appendChild(publicationItem);
        });
    })
    .catch(error => {
        console.error('Error loading publications:', error);
    });

function generateBibtex(publication) {
    const bibtex = `@inproceedings{${publication.authors[0].split(' ')[0].toLowerCase()}${publication.year},
    title={${publication.title}},
    author={${publication.authors.join(' and ')}},
    booktitle={${publication.venue}},
    year={${publication.year}}
}`;

    copyToClipboard(bibtex);
    showNotification('Copied to clipboard');
}

function copyToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

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