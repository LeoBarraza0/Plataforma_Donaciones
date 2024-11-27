class DonationPlatform {
    constructor() {
        this.projects = [];
        this.currentCarouselIndex = 0;
        this.fetchProjects();
        this.initializeEventListeners();
    }

    async fetchProjects() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();
            this.initializeDashboard();
            this.renderProjects();
            this.initializeCarousel();
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    initializeDashboard() {
        const totalDonations = this.projects.reduce((sum, p) => sum + p.current, 0);
        const totalDonationsElement = document.getElementById('totalDonations');
        this.animateValue(totalDonationsElement, 0, totalDonations, 2000);

        const activeProjectsElement = document.getElementById('activeProjects');
        this.animateValue(activeProjectsElement, 0, this.projects.length, 1000);

        const registeredOrgsElement = document.getElementById('registeredOrgs');
        const uniqueOrgs = new Set(this.projects.map(p => p.organization)).size;
        this.animateValue(registeredOrgsElement, 0, uniqueOrgs, 1000);
    }


    

    renderProjects() {
        const projectList = document.getElementById('projectList');
        projectList.innerHTML = '';

        this.projects.forEach(project => {
            const progress = (project.current / project.goal) * 100;
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p><strong>Organización:</strong> ${project.organization}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                    <p>$${project.current.toLocaleString()} de $${project.goal.toLocaleString()}</p>
                    <button class="btn" onclick="platform.donate(${project.id})">Donar</button>
                </div>
            `;
            projectList.appendChild(card);
        });
    }

    async donate(projectId) {
        const amount = prompt('Ingrese el monto a donar:');
        if (amount && !isNaN(amount)) {
            try {
                const response = await fetch(`/api/projects/${projectId}/donate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: Number(amount) }),
                });
                const result = await response.json();
                if (response.ok) {
                    alert('¡Gracias por tu donación!');
                    await this.fetchProjects(); // Refresh projects data
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error making donation:', error);
                alert('Hubo un error al procesar tu donación. Por favor, intenta de nuevo.');
            }
        }
    }

    initializeEventListeners() {
        document.getElementById('orgForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const orgData = {
                name: formData.get('name'),
                description: formData.get('description'),
                category: formData.get('category')
            };
            try {
                const response = await fetch('/api/organizations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orgData),
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Organización registrada exitosamente');
                    e.target.reset();
                } else {
                    alert('Error al registrar la organización: ' + result.message);
                }
            } catch (error) {
                console.error('Error registering organization:', error);
                alert('Hubo un error al registrar la organización. Por favor, intenta de nuevo.');
            }
        });

        // ... (other event listeners remain the same)
    }
}
const platform = new DonationPlatform();
document.addEventListener('DOMContentLoaded', () => {
    const platform = new DonationPlatform();
    
    window.addEventListener('load', () => {
        document.getElementById('loader').style.display = 'none';
        document.querySelector('main').style.display = 'block';
        platform.animateOnScroll();
    });
});