document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                if (section.id === `${target}-section`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // File input handling
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
            this.nextElementSibling.textContent = fileName;

            // Show preview
            if (this.files[0]) {
                const reader = new FileReader();
                const container = this.closest('.section').querySelector('.original-image');
                
                reader.onload = function(e) {
                    container.innerHTML = `<img src="${e.target.result}" alt="Original image">`;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    // Style Transfer Form
    document.getElementById('style-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = new FormData(this);
        const section = this.closest('.section');
        const loading = section.querySelector('.loading');
        const resultContainer = section.querySelector('.processed-image');

        loading.classList.remove('hidden');
        resultContainer.innerHTML = '';

        try {
            const response = await fetch('/style_transformation', {
                method: 'POST',
                body: form
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to process image');
            }
            
            resultContainer.innerHTML = `<img src="${data.url}" alt="Transformed image">`;
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Caption Form
    document.getElementById('caption-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = new FormData(this);
        const section = this.closest('.section');
        const loading = section.querySelector('.loading');
        const resultContainer = section.querySelector('.caption-result');

        loading.classList.remove('hidden');
        resultContainer.innerHTML = '';

        try {
            const response = await fetch('/caption', {
                method: 'POST',
                body: form
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate caption');
            }
            
            resultContainer.innerHTML = `<p>${data.caption}</p>`;
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Enhancement Form
    document.getElementById('enhance-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = new FormData(this);
        const section = this.closest('.section');
        const loading = section.querySelector('.loading');
        const resultContainer = section.querySelector('.processed-image');

        loading.classList.remove('hidden');
        resultContainer.innerHTML = '';

        try {
            const response = await fetch('/enhance_image', {
                method: 'POST',
                body: form
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to enhance image');
            }
            
            resultContainer.innerHTML = `<img src="${data.url}" alt="Enhanced image">`;
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        } finally {
            loading.classList.add('hidden');
        }
    });
});

function generateResultsHTML(results) {
    let html = '<h2>Results</h2>';
    
    if (results.style) {
        html += `
            <div class="result-item">
                <h3>Style Transformation</h3>
                ${results.style.error 
                    ? `<p class="error">Error: ${results.style.error}</p>`
                    : `<a href="${results.style}" target="_blank" class="btn">View Result</a>`}
            </div>`;
    }
    
    if (results.caption) {
        html += `
            <div class="result-item">
                <h3>Image Caption</h3>
                <p>${results.caption}</p>
            </div>`;
    }
    
    if (results.enhance) {
        html += `
            <div class="result-item">
                <h3>Image Enhancement</h3>
                ${results.enhance.error 
                    ? `<p class="error">Error: ${results.enhance.error}</p>`
                    : `<a href="${results.enhance}" target="_blank" class="btn">View Result</a>`}
            </div>`;
    }
    
    html += '<button onclick="location.href=\'/\'" class="btn">Upload New Image</button>';
    return html;
}