(function () {
  "use strict";

  // ----- Intro: car drives in, then overlay fades out (commented out) -----
  // var introOverlay = document.getElementById("introOverlay");
  // if (introOverlay) {
  //   window.addEventListener("load", function () {
  //     setTimeout(function () {
  //       introOverlay.classList.add("is-done");
  //       setTimeout(function () {
  //         introOverlay.remove();
  //       }, 600);
  //     }, 2200);
  //   });
  // }

  // ----- FAQ: only one accordion open at a time -----
  var faqList = document.querySelector(".faq-list");
  if (faqList) {
    var faqItems = faqList.querySelectorAll(".faq-item");
    faqItems.forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (details.open) {
          faqItems.forEach(function (other) {
            if (other !== details) other.open = false;
          });
        }
      });
    });
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute("href");
    if (href === "#") return;
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ----- Mobile nav -----
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ----- Scroll-triggered animations -----
  const animated = document.querySelectorAll("[data-animate]");
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  animated.forEach(function (el) {
    observer.observe(el);
  });

  // ----- Counter animation for stats -----
  const statValues = document.querySelectorAll(".stat-value[data-count]");

  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.getAttribute("data-count"), 10);
        if (!isNaN(end) && !el.dataset.animated) {
          el.dataset.animated = "true";
          animateValue(el, end, 1500);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach(function (el) {
    counterObserver.observe(el);
  });

  // ----- Testimonials slider: 3 on web, 1 on mobile, auto every 2s -----
  var testimonialsTrack = document.getElementById("testimonialsTrack");
  var testimonialsDots = document.getElementById("testimonialsDots");
  var testimonialsCurrentIndex = 0;
  var testimonialsTotal = 6;
  var testimonialsInterval = null;

  function testimonialsUpdatePosition() {
    if (!testimonialsTrack) return;
    var slidePage = Math.floor(testimonialsCurrentIndex / 3);
    testimonialsTrack.style.setProperty("--slide-index", String(testimonialsCurrentIndex));
    testimonialsTrack.style.setProperty("--slide-page", String(slidePage));
    if (testimonialsDots) {
      var dots = testimonialsDots.querySelectorAll("button");
      var activeIndex = window.innerWidth <= 768 ? testimonialsCurrentIndex : slidePage;
      dots.forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === activeIndex);
      });
    }
  }

  function testimonialsBuildDots() {
    if (!testimonialsDots) return;
    var isMobile = window.innerWidth <= 768;
    var count = isMobile ? 6 : 2;
    testimonialsDots.innerHTML = "";
    for (var i = 0; i < count; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Go to slide " + (i + 1));
      (function (idx, isMob) {
        btn.addEventListener("click", function () {
          testimonialsCurrentIndex = isMob ? idx : idx * 3;
          testimonialsUpdatePosition();
        });
      })(i, isMobile);
      testimonialsDots.appendChild(btn);
    }
    testimonialsUpdatePosition();
  }

  if (testimonialsTrack) {
    testimonialsUpdatePosition();
    testimonialsBuildDots();
    testimonialsInterval = setInterval(function () {
      testimonialsCurrentIndex = (testimonialsCurrentIndex + 1) % testimonialsTotal;
      testimonialsUpdatePosition();
    }, 2000);
  }

  window.addEventListener("resize", function () {
    if (!testimonialsDots) return;
    var wasMobile = testimonialsDots.querySelectorAll("button").length === 6;
    var isMobile = window.innerWidth <= 768;
    if (wasMobile !== isMobile) testimonialsBuildDots();
    else testimonialsUpdatePosition();
  });

  // ----- Contact form -----
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Sending…";
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = "Request sent ✓";
        btn.style.background = "var(--border)";
        form.reset();
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = "";
        }, 2500);
      }, 800);
    });
  }

  // ----- Optional: header background on scroll -----
  const header = document.querySelector(".header");
  if (header) {
    header.style.background = "rgba(248, 250, 252, 0.9)";
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 50) {
          header.style.background = "rgba(248, 250, 252, 0.98)";
        } else {
          header.style.background = "rgba(248, 250, 252, 0.9)";
        }
      },
      { passive: true }
    );
  }

  // ----- Video modal (play without feeling like YouTube) -----
  const videoModal = document.getElementById("videoModal");
  const videoModalPlayer = document.getElementById("videoModalPlayer");
  const videoModalBackdrop = document.getElementById("videoModalBackdrop");
  const videoModalClose = document.getElementById("videoModalClose");

  function getYoutubeId(url) {
    if (!url || typeof url !== "string") return null;
    var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function openVideoModal(content) {
    if (!videoModal || !videoModalPlayer) return;
    videoModalPlayer.innerHTML = "";
    videoModalPlayer.appendChild(content);
    videoModal.setAttribute("aria-hidden", "false");
    videoModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!videoModal || !videoModalPlayer) return;
    var video = videoModalPlayer.querySelector("video");
    if (video) {
      video.pause();
      if (video.src && video.src.indexOf("blob:") === 0) URL.revokeObjectURL(video.src);
    }
    videoModalPlayer.innerHTML = "";
    videoModal.setAttribute("aria-hidden", "true");
    videoModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (videoModalBackdrop) videoModalBackdrop.addEventListener("click", closeVideoModal);
  if (videoModalClose) videoModalClose.addEventListener("click", closeVideoModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal && videoModal.classList.contains("is-open")) closeVideoModal();
  });

  // YouTube cards: click play → open modal with clean embed (no YT branding feel)
  document.querySelectorAll(".video-card[data-youtube-id] .video-play").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = this.closest(".video-card");
      var id = card.getAttribute("data-youtube-id");
      if (!id) return;
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube.com/embed/" +
        id +
        "?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      openVideoModal(iframe);
    });
  });

  // Upload: file or YouTube URL
  var uploadedVideoUrl = null;
  var videoFileInput = document.getElementById("videoFileInput");
  var youtubeUrlInput = document.getElementById("youtubeUrlInput");
  var playUploadBtn = document.getElementById("playUploadBtn");

  if (videoFileInput) {
    videoFileInput.addEventListener("change", function () {
      var file = this.files[0];
      if (!file) return;
      if (uploadedVideoUrl) URL.revokeObjectURL(uploadedVideoUrl);
      uploadedVideoUrl = URL.createObjectURL(file);
      if (playUploadBtn) {
        playUploadBtn.style.display = "inline-flex";
        playUploadBtn.setAttribute("data-has-upload", "1");
      }
      youtubeUrlInput.value = "";
    });
  }

  if (youtubeUrlInput) {
    youtubeUrlInput.addEventListener("input", function () {
      var id = getYoutubeId(this.value);
      if (playUploadBtn) {
        if (id) {
          playUploadBtn.style.display = "inline-flex";
          playUploadBtn.setAttribute("data-yt-id", id);
        } else {
          playUploadBtn.removeAttribute("data-yt-id");
          if (!playUploadBtn.getAttribute("data-has-upload")) playUploadBtn.style.display = "none";
        }
      }
    });
  }

  if (playUploadBtn) {
    playUploadBtn.addEventListener("click", function () {
      var ytId = this.getAttribute("data-yt-id");
      if (ytId) {
        var iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube.com/embed/" +
          ytId +
          "?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        openVideoModal(iframe);
        return;
      }
      if (uploadedVideoUrl) {
        var video = document.createElement("video");
        video.src = uploadedVideoUrl;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        openVideoModal(video);
      }
    });
  }
})();
