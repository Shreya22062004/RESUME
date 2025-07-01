// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const lightSheet = document.getElementById('light-theme');
const darkSheet = document.getElementById('dark-theme');
themeToggle.addEventListener('click', () => {
  if (darkSheet.disabled) {
    darkSheet.disabled = false;
    lightSheet.disabled = true;
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    darkSheet.disabled = true;
    lightSheet.disabled = false;
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
});

// Fade-in on scroll for .fade-in elements (timeline, projects)
function fadeInOnScroll() {
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
}
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('DOMContentLoaded', fadeInOnScroll);

// Filterable Project Gallery
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.classList.contains(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Project Lightbox Modal (with download/web links)
window.openLightbox = function (title, desc, linksHtml) {
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-desc').textContent = desc;
  document.getElementById('lightbox-links').innerHTML = linksHtml || '';
  document.getElementById('lightbox').style.display = 'flex';
};
window.closeLightbox = function () {
  document.getElementById('lightbox').style.display = 'none';
};
window.onclick = function (event) {
  const lightbox = document.getElementById('lightbox');
  if (event.target === lightbox) closeLightbox();
};
// Project card click for lightbox
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function (e) {
    // Only open lightbox if not clicking a link inside the card
    if (e.target.tagName === 'A') return;
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    let linksHtml = '';
    if (card.dataset.web) {
      linksHtml += `<a href="${card.dataset.web}" target="_blank" class="btn-action web-link"><i class="fa-solid fa-globe"></i> Website</a>`;
    }
    if (card.dataset.download) {
      linksHtml += `<a href="${card.dataset.download}" target="_blank" class="btn-action download-link"><i class="fa-solid fa-download"></i> Download</a>`;
    }
    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-desc').textContent = desc;
    document.getElementById('lightbox-links').innerHTML = linksHtml;
    document.getElementById('lightbox').style.display = 'flex';
  });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Contact Form AJAX for Formspree
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const feedback = document.getElementById("form-feedback");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    feedback.textContent = "";
    feedback.style.color = "#e74c3c";
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      feedback.textContent = "Please fill in all required fields.";
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      return;
    }
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        feedback.style.color = "#27ae60";
        feedback.textContent = "Message sent successfully!";
        form.reset();
      } else {
        const result = await response.json();
        if (result.errors) {
          feedback.textContent = result.errors.map(error => error.message).join(", ");
        } else {
          feedback.textContent = "Oops! There was a problem submitting your form.";
        }
      }
    } catch (error) {
      feedback.textContent = "Oops! There was a problem submitting your form.";
    }
    setTimeout(() => { feedback.textContent = ""; }, 4000);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById('download-pdf');
  if (btn) {
    btn.addEventListener('click', async function () {
      // Save current theme state
      const lightSheet = document.getElementById('light-theme');
      const darkSheet = document.getElementById('dark-theme');
      const wasDark = !darkSheet.disabled;

      // Switch to light mode for PDF
      lightSheet.disabled = false;
      darkSheet.disabled = true;

      // Wait for CSS to apply
      await new Promise(requestAnimationFrame);

      // Add PDF export class
      document.body.classList.add('pdf-export');
      var element = document.querySelector('.container');
      var opt = {
        margin: 0.2,
        filename: 'S-J-Shreya-Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();

      // Remove PDF export class and restore theme
      document.body.classList.remove('pdf-export');
      if (wasDark) {
        darkSheet.disabled = false;
        lightSheet.disabled = true;
      }
    });
  }
});


// Hide PDF button in dark mode (extra safety for dynamic theme switching)
function togglePdfButton() {
  const darkSheet = document.getElementById('dark-theme');
  const pdfBtn = document.getElementById('download-pdf');
  if (pdfBtn) {
    if (!darkSheet.disabled) {
      pdfBtn.style.display = 'none';
    } else {
      pdfBtn.style.display = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', togglePdfButton);
document.getElementById('theme-toggle').addEventListener('click', togglePdfButton);
