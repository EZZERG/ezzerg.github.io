fetch('publications.json')
    .then(response => response.json())
    .then(data => {
        const publicationList = document.getElementById('publication-list');
        
        data.forEach(publication => {
            const publicationItem = document.createElement('div');
            publicationItem.classList.add('publication-item');
            
            const itemContent = document.createElement('div');
            itemContent.classList.add('item-content');
            
            const title = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = publication.url;
            titleLink.textContent = publication.title;
            title.appendChild(titleLink);
            itemContent.appendChild(title);
            
            const authors = document.createElement('p');
            authors.textContent = publication.authors.join(', ');
            itemContent.appendChild(authors);
            
            const year = document.createElement('p');
            year.textContent = publication.year;
            itemContent.appendChild(year);
            
            const venue = document.createElement('p');
            venue.textContent = publication.venue;
            itemContent.appendChild(venue);
            
            const bibtexButton = document.createElement('button');
            bibtexButton.textContent = 'BibTeX';
            bibtexButton.classList.add('bibtex-button');
            bibtexButton.addEventListener('click', () => {
                generateBibtex(publication);
            });
            itemContent.appendChild(bibtexButton);
            
            // Add arXiv button
            const arxivUrl = publication['arxiv-url'] || publication.url;
            if (arxivUrl) {
                const arxivButton = document.createElement('button');
                arxivButton.textContent = 'arXiv';
                arxivButton.classList.add('arxiv-button');
                arxivButton.addEventListener('click', () => {
                    window.open(arxivUrl, '_blank');
                });
                itemContent.appendChild(arxivButton);
            }
            
            publicationItem.appendChild(itemContent);
            
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('item-icon-container');
            
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-scroll', 'item-icon');
            iconContainer.appendChild(icon);
            
            publicationItem.appendChild(iconContainer);
            
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
// Set custom properties for logo size and offset
function setLogoProperties(selector) {
    document.querySelectorAll(selector).forEach(item => {
        const logoSize = item.dataset.logoSize || 80;
        const logoOffset = item.dataset.logoOffset || 0;
        item.style.setProperty('--logo-size', `${logoSize}px`);
        item.style.setProperty('--logo-offset', `${logoOffset}px`);
    });
}

// Apply to both education and experience sections
setLogoProperties('#education .education-item');
setLogoProperties('#experience .experience-item');

// Add this function at the end of the file

function animateTimeline() {
    const timelineContainers = document.querySelectorAll('.timeline-container');
    
    timelineContainers.forEach(container => {
        const timeline = container.querySelector('.timeline');
        const items = container.querySelectorAll('.education-item, .experience-item');
        
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Remove the timeline background animation
            });
            
            item.addEventListener('mouseleave', () => {
                // Remove the timeline background reset
            });
        });
    });
}

function setupTimeline() {
    const timelineContainers = document.querySelectorAll('.timeline-container');
    
    timelineContainers.forEach(container => {
        const timeline = container.querySelector('.timeline');
        const items = container.querySelectorAll('.education-item, .experience-item');
        
        items.forEach((item, index) => {
            const circle = document.createElement('div');
            circle.classList.add('timeline-circle');
            timeline.appendChild(circle);
            
            function positionCircle() {
                const itemRect = item.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const relativeTop = itemRect.top - containerRect.top;
                const circlePosition = relativeTop + itemRect.height / 2;
                circle.style.top = `${circlePosition}px`;
            }
            
            positionCircle();
            window.addEventListener('resize', positionCircle);
            
            item.addEventListener('mouseenter', () => {
                circle.style.backgroundColor = '#FFD700';
                circle.style.boxShadow = '0 0 10px #FFD700';
                circle.style.transform = 'translateX(-50%) scale(2)';
            });
            
            item.addEventListener('mouseleave', () => {
                circle.style.backgroundColor = '';
                circle.style.boxShadow = '';
                circle.style.transform = '';
            });
        });
    });
}

// Call the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateTimeline();
    setupTimeline();
});